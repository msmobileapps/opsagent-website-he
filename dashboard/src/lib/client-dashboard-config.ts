/**
 * Client Dashboard Configuration Types
 *
 * Each client gets a branded dashboard generated from this config.
 * The config defines: branding, modules, KPIs, agents, and attention items.
 */

export interface ClientDashboardConfig {
  id: string;
  name: string;
  language: 'en' | 'he';
  rtl: boolean;
  branding: {
    primaryColor: string;   // Tailwind color prefix, e.g. 'blue', 'brand', 'cyan'
    logoIcon: string;       // Lucide icon name
    subtitle: string;       // e.g. 'AI Operations Platform'
    poweredBy?: string;     // e.g. 'MSApps OpsAgent'
  };
  kpis: KpiConfig[];
  modules: ModuleConfig[];
  agents: AgentConfig[];
  attentionItems: AttentionItemConfig[];
  recentActivity: ActivityConfig[];
}

export interface KpiConfig {
  icon: string;
  label: string;
  value: string;
  trend: number;           // percentage, positive = up
  color: string;           // Tailwind color class, e.g. 'text-blue-400'
  bg: string;              // Tailwind bg class, e.g. 'bg-blue-500/10'
}

export interface ModuleConfig {
  id: string;
  icon: string;
  name: string;
  color: string;
  metric: string;
  health: number;          // 0-100
  status: 'active' | 'warning' | 'error';
}

export interface AgentConfig {
  id: string;
  name: string;
  module: string;
  description: string;
  status: 'running' | 'idle' | 'scheduled' | 'error';
  schedule: string;
  lastRun: string;
  icon: string;
  color: string;
  bgColor: string;
  metrics: { label: string; value: string | number; trend?: number }[];
  lastOutput?: string[];
}

export interface AttentionItemConfig {
  id: string;
  agent: string;
  agentIcon: string;
  text: string;
  priority: 'urgent' | 'high' | 'medium';
  actions: string[];
}

export interface ActivityConfig {
  agent: string;
  icon: string;
  text: string;
  time: string;
  status: 'success' | 'partial' | 'failed';
}

/**
 * Registry of all client dashboard configs.
 * Each client's config is imported from a separate file.
 */
const configRegistry: Record<string, () => Promise<ClientDashboardConfig>> = {};

export function registerClientConfig(clientId: string, loader: () => Promise<ClientDashboardConfig>) {
  configRegistry[clientId] = loader;
}

export async function getClientDashboardConfig(clientId: string): Promise<ClientDashboardConfig | null> {
  const loader = configRegistry[clientId];
  if (!loader) return null;
  return loader();
}

export function getRegisteredClients(): string[] {
  return Object.keys(configRegistry);
}
