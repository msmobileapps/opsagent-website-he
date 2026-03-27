#!/usr/bin/env node

/**
 * Create Client Dashboard Generator
 *
 * Generates a branded dashboard for a new client under:
 *   dashboard/src/app/demo/<client-id>/
 *
 * Usage:
 *   node scripts/create-client-dashboard.js <client-id>
 *
 * Reads the client config from clients/<client-id>.json and generates:
 *   - layout.tsx (branded sidebar with modules)
 *   - page.tsx (overview with KPIs, attention items, activity)
 *   - agents/page.tsx (agent list)
 *   - config.ts (client dashboard data)
 *
 * The generated files use the same patterns as Union Motors and TradeLine demos.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CLIENTS_DIR = path.join(ROOT, 'clients');
const DEMO_DIR = path.join(ROOT, 'dashboard', 'src', 'app', 'demo');

const clientId = process.argv[2];
if (!clientId) {
  console.error('Usage: node scripts/create-client-dashboard.js <client-id>');
  process.exit(1);
}

const configPath = path.join(CLIENTS_DIR, `${clientId}.json`);
if (!fs.existsSync(configPath)) {
  console.error(`Client config not found: ${configPath}`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const dashboard = config.dashboard || {};
const clientName = config.name || clientId;
const language = dashboard.language || 'en';
const rtl = dashboard.rtl || false;
const brandColor = dashboard.brand_color || 'blue';
const logoIcon = dashboard.logo_icon || 'Building2';

const outDir = path.join(DEMO_DIR, clientId);

// Create directories
[outDir, path.join(outDir, 'agents')].forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});

// ── Generate layout.tsx ──────────────────────────────────────────────────────

const layoutCode = `'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useState } from 'react';
import {
  LayoutDashboard,
  Bot,
  ${logoIcon},
  Menu,
  X,
  Zap,
} from 'lucide-react';

const nav = [
  { href: '/demo/${clientId}', label: '${language === 'he' ? 'סקירה כללית' : 'Overview'}', icon: LayoutDashboard },
  { href: '/demo/${clientId}/agents', label: '${language === 'he' ? 'סוכני AI' : 'AI Agents'}', icon: Bot },
];

export default function ${toPascalCase(clientId)}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div${rtl ? ' dir="rtl"' : ''}>
      {/* Hide parent MSApps sidebar and reset parent main margin */}
      <style dangerouslySetInnerHTML={{ __html: \`
        main.lg\\\\:ml-60 { margin-left: 0 !important; padding: 0 !important; }
        main.lg\\\\:ml-60 > .max-w-7xl { max-width: 100% !important; padding: 0 !important; }
        aside.w-60 { display: none !important; }
      \`}} />

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-surface border-b border-surface-border z-50 flex items-center px-4 gap-3">
        <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg hover:bg-surface-raised">
          <Menu className="w-5 h-5 text-gray-300" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-${brandColor}-500 to-${brandColor}-700 flex items-center justify-center">
            <${logoIcon} className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-sm font-bold text-white">${clientName} AI</h1>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-50" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 h-screen w-64 bg-surface border-${rtl ? 'l' : 'r'} border-surface-border flex flex-col z-50 transition-transform duration-200',
          'lg:${rtl ? 'right' : 'left'}-0 lg:translate-x-0',
          open ? '${rtl ? 'right' : 'left'}-0 translate-x-0' : '${rtl ? '' : '-'}translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-${brandColor}-500 to-${brandColor}-700 flex items-center justify-center">
              <${logoIcon} className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">${clientName}</h1>
              <p className="text-[10px] text-gray-500 -mt-0.5">AI Operations Platform</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1 rounded hover:bg-surface-raised">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-${brandColor}-500/15 text-${brandColor}-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-raised'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Client badge */}
        <div className="mt-auto p-4 border-t border-surface-border">
          <div className="bg-surface-raised rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">${language === 'he' ? 'לקוח' : 'Client'}</p>
            <p className="text-sm font-semibold text-white">${clientName}</p>
            <p className="text-xs text-gray-500">${Object.keys(config.agents || {}).length} ${language === 'he' ? 'סוכנים פעילים' : 'agents active'}</p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Powered by</p>
              <p className="text-xs font-semibold text-gray-300">MSApps OpsAgent</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:m${rtl ? 'r' : 'l'}-64 min-h-screen pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
`;

// ── Generate overview page.tsx ────────────────────────────────────────────────

const overviewCode = `'use client';

import { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  BarChart3,
  Target,
  Users,
  DollarSign,
} from 'lucide-react';

// ─── KPI Data ───────────────────────────────────
const kpiCards = [
  { icon: Target, label: '${language === 'he' ? 'סוכנים פעילים' : 'Active Agents'}', value: '${Object.values(config.agents || {}).filter(a => a.enabled).length}', trend: 0, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Activity, label: '${language === 'he' ? 'ריצות היום' : "Today's Runs"}', value: '0', trend: 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: CheckCircle2, label: '${language === 'he' ? 'אחוז הצלחה' : 'Success Rate'}', value: '—', trend: 0, color: 'text-green-400', bg: 'bg-green-500/10' },
  { icon: Users, label: '${language === 'he' ? 'סוכנים רצים כרגע' : 'Running Now'}', value: '0', trend: 0, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const priorityStyles = {
  urgent: 'border-red-500/30 bg-red-500/5',
  high: 'border-yellow-500/30 bg-yellow-500/5',
  medium: 'border-blue-500/30 bg-blue-500/5',
};

const priorityLabels = {
  urgent: { text: '${language === 'he' ? 'דחוף' : 'Urgent'}', color: 'text-red-400 bg-red-500/20' },
  high: { text: '${language === 'he' ? 'גבוה' : 'High'}', color: 'text-yellow-400 bg-yellow-500/20' },
  medium: { text: '${language === 'he' ? 'בינוני' : 'Medium'}', color: 'text-blue-400 bg-blue-500/20' },
};

export default function ${toPascalCase(clientId)}Overview() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">${language === 'he' ? 'סקירה כללית' : 'Operations Overview'} — ${clientName}</h1>
          <p className="text-sm text-gray-500 mt-1">${language === 'he' ? 'מרכז שליטה תפעולי מונע AI' : 'AI-powered operations center'}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ${language === 'he' ? 'מערכת פעילה' : 'System active'}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpiCards.map(kpi => (
          <div key={kpi.label} className="bg-surface-raised border border-surface-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={\`w-8 h-8 rounded-lg \${kpi.bg} flex items-center justify-center\`}>
                <kpi.icon className={\`w-4 h-4 \${kpi.color}\`} />
              </div>
              <span className="text-xs text-gray-500">{kpi.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            {kpi.trend !== 0 && (
              <div className="flex items-center gap-1 mt-1">
                {kpi.trend >= 0 ? (
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-red-400" />
                )}
                <span className={\`text-xs \${kpi.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}\`}>
                  {Math.abs(kpi.trend)}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">${language === 'he' ? 'דורש תשומת לב' : 'Needs Attention'}</h2>
          </div>
          <div className="text-center py-8 text-gray-500 border border-surface-border rounded-xl bg-surface-raised">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400 opacity-60" />
            <p className="text-sm">${language === 'he' ? 'הכל מטופל! אין פריטים הדורשים תשומת לב.' : 'All clear! No items need attention.'}</p>
            <p className="text-xs text-gray-600 mt-1">${language === 'he' ? 'פריטים יופיעו כאן כשהסוכנים יתחילו לעבוד' : 'Items will appear here once agents start running'}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-4 h-4 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">${language === 'he' ? 'פעילות אחרונה' : 'Recent Activity'}</h2>
          </div>
          <div className="text-center py-8 text-gray-500 border border-surface-border rounded-xl bg-surface-raised">
            <Activity className="w-8 h-8 mx-auto mb-2 text-blue-400 opacity-60" />
            <p className="text-sm">${language === 'he' ? 'אין פעילות עדיין' : 'No activity yet'}</p>
            <p className="text-xs text-gray-600 mt-1">${language === 'he' ? 'הפעל סוכנים כדי לראות פעילות' : 'Run agents to see activity here'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

// ── Generate agents page ─────────────────────────────────────────────────────

const agentEntries = Object.entries(config.agents || {}).map(([name, cfg]) => ({
  id: name,
  name: name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  enabled: cfg.enabled,
  schedule: cfg.schedule || '',
}));

const agentsCode = `'use client';

import {
  Bot,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const agents = ${JSON.stringify(agentEntries, null, 2)};

export default function ${toPascalCase(clientId)}Agents() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">${language === 'he' ? 'סוכני AI' : 'AI Agents'} — ${clientName}</h1>
        <p className="text-sm text-gray-500 mt-1">${language === 'he' ? 'ניהול והפעלת סוכנים' : 'Manage and run agents'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <div
            key={agent.id}
            className="bg-surface-raised border border-surface-border rounded-xl p-4 hover:border-${brandColor}-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-${brandColor}-500/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-${brandColor}-400" />
                </div>
                <span className="text-sm font-semibold text-white">{agent.name}</span>
              </div>
              <span className={\`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full \${
                agent.enabled
                  ? 'text-emerald-400 bg-emerald-500/20'
                  : 'text-gray-500 bg-gray-500/10'
              }\`}>
                {agent.enabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {agent.enabled ? '${language === 'he' ? 'פעיל' : 'Enabled'}' : '${language === 'he' ? 'מושבת' : 'Disabled'}'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <Clock className="w-3 h-3" />
              <span>{agent.schedule || '${language === 'he' ? 'ידני בלבד' : 'Manual only'}'}</span>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium bg-${brandColor}-500/15 text-${brandColor}-400 hover:bg-${brandColor}-500/25 border border-${brandColor}-500/20 transition-colors">
              <Play className="w-3 h-3" />
              ${language === 'he' ? 'הפעל עכשיו' : 'Run Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

// ── Write files ──────────────────────────────────────────────────────────────

fs.writeFileSync(path.join(outDir, 'layout.tsx'), layoutCode);
fs.writeFileSync(path.join(outDir, 'page.tsx'), overviewCode);
fs.writeFileSync(path.join(outDir, 'agents', 'page.tsx'), agentsCode);

console.log('\\nClient dashboard generated for "' + clientName + '" (' + clientId + ')');
console.log('  Location: dashboard/src/app/demo/' + clientId + '/');
console.log('  Files:');
console.log('    - layout.tsx  (branded sidebar)');
console.log('    - page.tsx    (overview dashboard)');
console.log('    - agents/page.tsx (agent management)');
console.log('\\n  Route: /demo/' + clientId);
console.log('  Language: ' + language + ' | RTL: ' + rtl + ' | Brand: ' + brandColor);
console.log();

function toPascalCase(str) {
  return str.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}
`;

fs.writeFileSync(path.join(outDir, 'layout.tsx'), layoutCode);
fs.writeFileSync(path.join(outDir, 'page.tsx'), overviewCode);
fs.writeFileSync(path.join(outDir, 'agents', 'page.tsx'), agentsCode);

console.log('\nClient dashboard generated for "' + clientName + '" (' + clientId + ')');
console.log('  Location: dashboard/src/app/demo/' + clientId + '/');
console.log('  Files:');
console.log('    - layout.tsx  (branded sidebar)');
console.log('    - page.tsx    (overview dashboard)');
console.log('    - agents/page.tsx (agent management)');
console.log('\n  Route: /demo/' + clientId);
console.log('  Language: ' + language + ' | RTL: ' + rtl + ' | Brand: ' + brandColor);
console.log();

function toPascalCase(str) {
  return str.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}
