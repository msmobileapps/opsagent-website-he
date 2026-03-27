# OpsAgent — Claude Project Context

## What is this project?

OpsAgent is an AI-powered operations automation platform. Each client gets a **virtual Mac running Claude Desktop** with their specific MCP integrations (Google Calendar, iCount, Notion, etc.). A central **dashboard** controls and monitors all client VMs from one place.

Built by **MSApps** (tech/AI consulting company run by Michal Shatz).

## Current Stage (2026-03-27)

**POC phase** — building the multi-client virtual Mac + dashboard architecture. The old single-server model (Claude Agent SDK running agents directly) works and is kept for reference below. The new architecture replaces it.

## Target Architecture (NEW)

```
┌─────────────────────────────────────────────────┐
│                  DASHBOARD                       │
│        (Next.js — controls all clients)          │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Client A │  │ Client B │  │ Client C │  ... │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
└───────┼──────────────┼──────────────┼────────────┘
        │              │              │
   Cloudflare     Cloudflare     Cloudflare
    Tunnel          Tunnel         Tunnel
        │              │              │
┌───────┴───┐  ┌───────┴───┐  ┌───────┴───┐
│ Virtual   │  │ Virtual   │  │ Virtual   │
│ Mac A     │  │ Mac B     │  │ Mac C     │
│           │  │           │  │           │
│ Claude    │  │ Claude    │  │ Claude    │
│ Desktop + │  │ Desktop + │  │ Desktop + │
│ MCP       │  │ MCP       │  │ MCP       │
│ servers   │  │ servers   │  │ servers   │
│ (client's │  │ (client's │  │ (client's │
│ integra-  │  │ integra-  │  │ integra-  │
│ tions)    │  │ tions)    │  │ tions)    │
└───────────┘  └───────────┘  └───────────┘
```

**Key idea:** Each VM is a fully autonomous ops environment for one client. Claude Desktop has all their tools (calendar, accounting, email, CRM). The dashboard just orchestrates — trigger agents, view results, manage schedules, approve actions.

**Client config now includes:**
- `tunnel_url` — Cloudflare Tunnel URL to the VM's API
- `vm_id` — identifier for the virtual Mac instance
- All existing fields (agents, schedules, context, etc.)

## Legacy Architecture (reference — still works)

```
index.js                    ← Entry point: starts the scheduler
├── src/scheduler.js        ← Loads client configs, schedules cron jobs
├── src/runner.js           ← Executes agents via Claude Agent SDK
├── src/logger.js           ← Saves run outputs to logs/ as markdown
├── src/cli.js              ← Manual CLI: node src/cli.js <clientId> <agentName>
├── src/dashboard.js        ← Express API server (port 4242) with embedded HTML dashboard
├── agents/                 ← Markdown prompt templates (one per agent type)
│   ├── lead-pipeline.md
│   ├── linkedin-outreach.md
│   ├── social-posts.md
│   ├── receipts.md
│   ├── invoicing.md
│   └── recruiter.md
├── clients/                ← JSON configs (one per client organization)
│   ├── template.json       ← Reference template — do not load
│   └── msapps.json         ← Live config for MSApps
├── logs/                   ← Output logs organized as logs/<clientId>/<agentName>/<date>.md
├── mcp-servers.json        ← MCP server configs with auth tokens (gitignored)
└── dashboard/              ← Next.js 14 frontend (separate app, port 3000)
```

## Tech Stack

**Backend (root project):**
- Node.js with ES modules (`"type": "module"`)
- `@anthropic-ai/claude-agent-sdk` — spawns autonomous Claude sessions
- `@anthropic-ai/sdk` — Anthropic API client
- `express` — REST API + SSE streaming for dashboard
- `node-cron` — cron-based scheduling
- `dotenv` — environment configuration

**Frontend (dashboard/):**
- Next.js 14 with App Router
- React 18 + TypeScript
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons

## How Agent Execution Works

1. **Scheduler** (`src/scheduler.js`) loads all client JSON configs from `clients/` (excluding `template.json`)
2. For each client, it iterates over `agents` entries and schedules enabled ones via `node-cron`
3. When a cron fires, **Runner** (`src/runner.js`) executes the agent:
   - Reads the markdown template from `agents/<name>.md`
   - Injects client context using `{{client_name}}`, `{{timezone}}`, `{{industry}}`, etc.
   - Builds a user prompt with today's date and agent-specific context
   - Calls `query()` from Claude Agent SDK with `permissionMode: 'bypassPermissions'`
   - Allowed tools: `Read`, `Glob`, `Grep`, `Bash`, `WebSearch`, `WebFetch`
   - Streams progress events via `onProgress` callback
4. **Logger** (`src/logger.js`) saves the output as `logs/<clientId>/<agentName>/<YYYY-MM-DD>.md`

## Key Conventions

- **Agent templates** are markdown files in `agents/`. They use `{{placeholder}}` syntax for client-specific values.
- **Client configs** are JSON files in `clients/`. Each has an `agents` object where keys match agent filenames (without `.md`). Each agent entry has `enabled`, `schedule` (cron expression), and `context` (key-value pairs).
- **Logs** are stored as markdown with a header: `# <agent> — <client> — <timestamp>` followed by token counts and the agent output.
- **MCP servers** are configured in `mcp-servers.json` (gitignored). This file contains auth tokens for Google Calendar, Notion, and other integrations.
- All times use `Asia/Jerusalem` timezone by default.

## Running the Project

```bash
# Start the cron scheduler (production mode)
npm start                    # → node index.js

# Run a specific agent manually
npm run run -- msapps lead-pipeline
# or: node src/cli.js msapps lead-pipeline

# Start the Express dashboard API (port 4242)
npm run dashboard            # → node src/dashboard.js

# Start the Next.js frontend dashboard (port 3000)
cd dashboard && npm run dev
```

## Environment Variables

```
ANTHROPIC_API_KEY=<required — Claude API key>
REPORT_EMAIL=<optional — email for reports>
DASHBOARD_PORT=<optional — default 4242>
```

## Current Client: MSApps

The primary (and currently only) client. Config in `clients/msapps.json`:

| Agent | Schedule | Status |
|-------|----------|--------|
| lead-pipeline | Sun-Thu 8:00 AM | Enabled |
| linkedin-outreach | Sun-Thu 9:00 AM | Enabled |
| social-posts | Sun-Thu 7:00 AM | Enabled |
| receipts | Monday 8:00 AM | Enabled |
| invoicing | 1st of month 9:00 AM | Enabled |
| recruiter | Monday 10:00 AM | Disabled |

**Integrations:** Google Calendar (CRM), iCount (accounting), Monday.com (timesheets), Notion (LinkedIn CRM), Zoho Mail

## Dashboard API Endpoints

- `GET /api/status` — All clients, agents, and last-run info
- `GET /api/logs/:clientId/:agentName` — List log dates for an agent
- `GET /api/logs/:clientId/:agentName/:date` — Read a specific log
- `GET /api/run/:clientId/:agentName` — Run an agent (SSE stream)

## Deployment

- **Dashboard frontend** is deployed to Netlify at `opsagent-dashboard.netlify.app`
- **Landing page** at `opsagent.netlify.app`
- Git repo is initialized; use standard git workflow

## Files to Never Commit

- `.env` — API keys
- `mcp-servers.json` — MCP auth tokens
- `logs/` — execution output
- `node_modules/`

## Adding a New Agent

1. Create `agents/<agent-name>.md` with the prompt template (use `{{client_name}}`, `{{timezone}}` placeholders)
2. Add the agent to each relevant client config in `clients/<client>.json` under the `agents` key
3. Set `enabled: true`, `schedule` (cron), and `context` (key-value pairs the agent needs)

## Adding a New Client (Legacy)

1. Copy `clients/template.json` → `clients/<client-id>.json`
2. Fill in `id`, `name`, `contact_email`, `timezone`, `industry`, `company_size`
3. Enable desired agents with schedules and context
4. The scheduler will auto-discover it on next restart

## Adding a New Client (New Architecture)

1. Provision a virtual Mac VM
2. Install Claude Desktop + configure MCP servers for client's integrations
3. Set up Cloudflare Tunnel exposing the API
4. Add client to dashboard registry with `tunnel_url` and `vm_id`
5. Configure agents and schedules via dashboard UI
