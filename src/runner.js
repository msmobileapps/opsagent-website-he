import { query } from '@anthropic-ai/claude-agent-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENTS_DIR = path.join(__dirname, '..', 'agents');
const MCP_CONFIG = path.join(__dirname, '..', 'mcp-servers.json');

/**
 * Run an agent for a client via the Claude Agent SDK.
 * This spawns a Claude Code session with full MCP tool access.
 *
 * @param {object} clientConfig - Client configuration
 * @param {string} agentName    - Agent to run (matches agents/<name>.md)
 * @param {function} onProgress - Optional callback for progress events
 */
export async function runAgent(clientConfig, agentName, onProgress) {
  const agentPath = path.join(AGENTS_DIR, `${agentName}.md`);
  if (!fs.existsSync(agentPath)) {
    throw new Error(`Agent not found: ${agentName}. Expected file: agents/${agentName}.md`);
  }

  const agentTemplate = fs.readFileSync(agentPath, 'utf-8');
  const agentConfig = clientConfig.agents?.[agentName] ?? {};
  const systemPrompt = injectClientContext(agentTemplate, clientConfig);
  const userPrompt = buildUserPrompt(agentName, clientConfig, agentConfig);

  console.log(`  [${clientConfig.id}] ${agentName} — launching Claude agent...`);

  // Load MCP servers from config if available
  const mcpServers = loadMcpServers();

  const options = {
    systemPrompt,
    allowedTools: ['Read', 'Glob', 'Grep', 'Bash', 'WebSearch', 'WebFetch'],
    permissionMode: 'bypassPermissions',
    allowDangerouslySkipPermissions: true,
    maxTurns: 25,
    cwd: process.cwd(),
  };

  // Add MCP servers if configured
  if (Object.keys(mcpServers).length > 0) {
    options.mcpServers = mcpServers;
  }

  let result = '';
  let stopReason = '';
  const startTime = Date.now();

  for await (const message of query({ prompt: userPrompt, options })) {
    // Result message — the final output
    if ('result' in message) {
      result = message.result;
      stopReason = message.stop_reason ?? 'end_turn';
    }

    // System init message
    if (message.type === 'system' && message.subtype === 'init') {
      if (onProgress) onProgress({ type: 'init', sessionId: message.data?.session_id });
    }

    // Assistant intermediate messages — stream text
    if (message.type === 'assistant' || ('content' in message && Array.isArray(message.content))) {
      const blocks = message.content ?? [];
      for (const block of blocks) {
        if (block.type === 'text' && block.text && onProgress) {
          onProgress({ type: 'text', text: block.text });
        }
        if (block.type === 'tool_use' && onProgress) {
          onProgress({ type: 'tool', name: block.name });
        }
      }
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`  [${clientConfig.id}] ${agentName} — done in ${elapsed}s`);

  return {
    clientId: clientConfig.id,
    clientName: clientConfig.name,
    agentName,
    timestamp: new Date().toISOString(),
    output: result,
    elapsed,
    stopReason,
    // Agent SDK doesn't expose token counts directly; estimate from output length
    usage: { input_tokens: 0, output_tokens: Math.ceil(result.length / 4) },
  };
}

/**
 * Load MCP server configurations from mcp-servers.json.
 * This file is gitignored — it contains auth tokens.
 */
function loadMcpServers() {
  if (!fs.existsSync(MCP_CONFIG)) return {};
  try {
    return JSON.parse(fs.readFileSync(MCP_CONFIG, 'utf-8'));
  } catch (e) {
    console.warn('  Warning: Failed to load mcp-servers.json:', e.message);
    return {};
  }
}

function injectClientContext(template, cfg) {
  return template
    .replace(/\{\{client_name\}\}/g, cfg.name ?? cfg.id)
    .replace(/\{\{client_id\}\}/g, cfg.id)
    .replace(/\{\{timezone\}\}/g, cfg.timezone ?? 'Asia/Jerusalem')
    .replace(/\{\{industry\}\}/g, cfg.industry ?? 'service business')
    .replace(/\{\{company_size\}\}/g, cfg.company_size ?? 'SMB')
    .replace(/\{\{contact_email\}\}/g, cfg.contact_email ?? '');
}

function buildUserPrompt(agentName, clientConfig, agentConfig) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: clientConfig.timezone ?? 'Asia/Jerusalem',
  });

  const contextLines = Object.entries(agentConfig.context ?? {})
    .map(([k, v]) => `- **${k}**: ${v}`)
    .join('\n');

  return `**Today:** ${today}

**Run agent:** \`${agentName}\` for client **${clientConfig.name}**

**Agent context:**
${contextLines || '_(no additional context)_'}

Execute this agent workflow. Use all available tools to gather real data, take actions, and produce a detailed briefing with outcomes.`;
}
