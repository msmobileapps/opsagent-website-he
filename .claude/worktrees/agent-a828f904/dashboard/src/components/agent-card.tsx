'use client';

import { Agent } from '@/lib/types';
import { StatusBadge } from './status-badge';
import { clsx } from 'clsx';
import {
  Target,
  Send,
  Users,
  Receipt,
  FileCheck,
  Megaphone,
  FileText,
  ClipboardList,
  Mail,
  Calendar,
  Play,
  Square,
  Clock,
} from 'lucide-react';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  target: Target,
  send: Send,
  users: Users,
  receipt: Receipt,
  'file-check': FileCheck,
  megaphone: Megaphone,
  'file-text': FileText,
  'clipboard-list': ClipboardList,
  mail: Mail,
  calendar: Calendar,
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'Just now';
}

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
  onStart?: (id: string) => void;
  onStop?: (id: string) => void;
  onEditSchedule?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function AgentCard({ agent, compact, onStart, onStop, onEditSchedule, onClick }: AgentCardProps) {
  const Icon = icons[agent.icon] || Target;
  const isRunning = agent.status === 'running';

  if (compact) {
    return (
      <div className="bg-surface-raised border border-surface-border rounded-xl p-4 hover:border-brand-500/30 transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
              <p className="text-xs text-gray-500">{agent.department}</p>
            </div>
          </div>
          <StatusBadge status={agent.status} />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {agent.metrics.map((m) => (
            <div key={m.label}>
              <p className="text-xs text-gray-500 truncate">{m.label}</p>
              <p className="text-sm font-semibold text-white">{m.value}</p>
              {m.trend !== undefined && (
                <p className={`text-[10px] ${m.trend >= 0 ? 'text-accent-400' : 'text-red-400'}`}>
                  {m.trend >= 0 ? '↑' : '↓'} {Math.abs(m.trend)}%
                </p>
              )}
            </div>
          ))}
        </div>
        {(onStart || onStop) && (
          <div className="flex gap-2 pt-3 border-t border-surface-border">
            {isRunning ? (
              <button
                onClick={() => onStop?.(agent.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
              >
                <Square className="w-3 h-3" />
                Stop
              </button>
            ) : (
              <button
                onClick={() => onStart?.(agent.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-accent-400 bg-accent-500/10 hover:bg-accent-500/20 transition-colors"
              >
                <Play className="w-3 h-3" />
                Run Now
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'bg-surface-raised border border-surface-border rounded-xl p-5 hover:border-brand-500/30 transition-all duration-200',
        onClick && 'cursor-pointer'
      )}
      onClick={() => onClick?.(agent.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{agent.name}</h3>
            <p className="text-xs text-gray-500">{agent.department}</p>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      <p className="text-sm text-gray-400 mb-4 leading-relaxed">{agent.description}</p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {agent.metrics.map((m) => (
          <div key={m.label} className="bg-surface/50 rounded-lg p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">{m.label}</p>
            <p className="text-lg font-bold text-white">{m.value}</p>
            {m.trend !== undefined && (
              <p className={`text-xs ${m.trend >= 0 ? 'text-accent-400' : 'text-red-400'}`}>
                {m.trend >= 0 ? '↑' : '↓'} {Math.abs(m.trend)}%
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-surface-border mb-3">
        <span>Last run: {timeAgo(agent.lastRun)}</span>
        <span>{agent.schedule}</span>
      </div>

      {/* Action buttons */}
      {(onStart || onStop || onEditSchedule) && (
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          {isRunning ? (
            <button
              onClick={() => onStop?.(agent.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              <Square className="w-3.5 h-3.5" />
              Stop
            </button>
          ) : (
            <button
              onClick={() => onStart?.(agent.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-accent-400 bg-accent-500/10 hover:bg-accent-500/20 border border-accent-500/20 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Run Now
            </button>
          )}
          <button
            onClick={() => onEditSchedule?.(agent.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            Schedule
          </button>
        </div>
      )}
    </div>
  );
}
