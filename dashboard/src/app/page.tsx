import { agents, executionLogs } from '@/lib/mock-data';
import { AgentCard } from '@/components/agent-card';
import { Activity, CheckCircle2, Clock, Zap } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-surface-raised border border-surface-border rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-brand-400" />
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function OverviewPage() {
  const running = agents.filter(a => a.status === 'running').length;
  const todayLogs = executionLogs.filter(l =>
    l.startedAt.startsWith('2026-03-21')
  );
  const successRate = Math.round(
    (executionLogs.filter(l => l.status === 'success').length / executionLogs.length) * 100
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Operations Overview</h1>
        <p className="text-sm text-gray-500 mt-1">MSApps — Real-time operations dashboard</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard icon={Zap} label="Active Agents" value={agents.length} sub="Across 4 departments" />
        <StatCard icon={Activity} label="Running Now" value={running} sub={running > 0 ? 'Processing tasks' : 'All idle'} />
        <StatCard icon={CheckCircle2} label="Today's Runs" value={todayLogs.length} sub="Completed today" />
        <StatCard icon={Clock} label="Success Rate" value={`${successRate}%`} sub="Last 30 days" />
      </div>

      {/* Agent grid */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Agent Status</h2>
        <div className="grid grid-cols-2 gap-4">
          {agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} compact />
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="bg-surface-raised border border-surface-border rounded-xl divide-y divide-surface-border">
          {todayLogs.slice(0, 5).map(log => {
            const statusLabel = log.status === 'success' ? 'Success' : log.status === 'partial' ? 'Partial' : 'Failed';
            const statusColor = log.status === 'success' ? 'text-accent-400' : log.status === 'partial' ? 'text-yellow-400' : 'text-red-400';
            return (
              <div key={log.id} className="flex items-center gap-4 px-4 py-3">
                <span className={`text-xs font-medium ${statusColor} w-14`}>{statusLabel}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{log.summary}</p>
                  <p className="text-xs text-gray-500">{log.agentName}</p>
                </div>
                <span className="text-xs text-gray-500 shrink-0">
                  {new Date(log.startedAt).toLocaleTimeString('en-IL', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
