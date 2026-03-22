'use client';

import { useState } from 'react';
import { Agent, ExecutionLog } from '@/lib/types';
import { StatusBadge } from './status-badge';
import { OutputViewer } from './output-viewer';
import { clsx } from 'clsx';
import {
  X,
  Play,
  Square,
  Clock,
  ChevronRight,
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
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  target: Target, send: Send, users: Users, receipt: Receipt,
  'file-check': FileCheck, megaphone: Megaphone, 'file-text': FileText,
  'clipboard-list': ClipboardList, mail: Mail, calendar: Calendar,
};

const statusConfig = {
  success: { icon: CheckCircle2, color: 'text-accent-400', label: 'Completed' },
  partial: { icon: AlertCircle, color: 'text-yellow-400', label: 'Partial' },
  failed: { icon: XCircle, color: 'text-red-400', label: 'Failed' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IL', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-IL', {
    hour: '2-digit', minute: '2-digit',
  });
}

function duration(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

interface AgentDetailProps {
  agent: Agent;
  logs: ExecutionLog[];
  onClose: () => void;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onEditSchedule: (id: string) => void;
}

export function AgentDetail({ agent, logs, onClose, onStart, onStop, onEditSchedule }: AgentDetailProps) {
  const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(null);
  const Icon = icons[agent.icon] || Target;
  const isRunning = agent.status === 'running';
  const agentLogs = logs.filter(l => l.agentId === agent.id);

  return (
    <div className="fixed inset-0 bg-black/60 z-[90] flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-[#0d0d1a] border-l border-surface-border h-full overflow-y-auto animate-slide-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0d0d1a]/95 backdrop-blur-sm border-b border-surface-border p-5 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{agent.name}</h2>
                <p className="text-xs text-gray-500">{agent.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={agent.status} />
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-raised">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-3">{agent.description}</p>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            {isRunning ? (
              <button
                onClick={() => onStop(agent.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
                Stop
              </button>
            ) : (
              <button
                onClick={() => onStart(agent.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-accent-400 bg-accent-500/10 hover:bg-accent-500/20 border border-accent-500/20 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                Run Now
              </button>
            )}
            <button
              onClick={() => onEditSchedule(agent.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              {agent.schedule}
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="p-5 border-b border-surface-border">
          <div className="grid grid-cols-3 gap-3">
            {agent.metrics.map((m) => (
              <div key={m.label} className="bg-surface-raised rounded-xl p-3 border border-surface-border">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{m.label}</p>
                <p className="text-xl font-bold text-white">{m.value}</p>
                {m.trend !== undefined && (
                  <p className={`text-xs ${m.trend >= 0 ? 'text-accent-400' : 'text-red-400'}`}>
                    {m.trend >= 0 ? '↑' : '↓'} {Math.abs(m.trend)}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Run history / Output view */}
        <div className="p-5">
          {selectedLog ? (
            // Output view
            <div>
              <button
                onClick={() => setSelectedLog(null)}
                className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 mb-4"
              >
                ← Back to run history
              </button>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">{selectedLog.summary}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(selectedLog.startedAt)} at {formatTime(selectedLog.startedAt)} · {duration(selectedLog.startedAt, selectedLog.completedAt)}
                  </p>
                </div>
                <div className={clsx('flex items-center gap-1.5 text-sm font-medium', statusConfig[selectedLog.status].color)}>
                  {(() => { const SC = statusConfig[selectedLog.status].icon; return <SC className="w-4 h-4" />; })()}
                  {statusConfig[selectedLog.status].label}
                </div>
              </div>

              {selectedLog.output ? (
                <OutputViewer sections={selectedLog.output} />
              ) : (
                // Fallback for logs without structured output
                <div className="bg-surface-raised border border-surface-border rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Details</h4>
                  <div className="space-y-2">
                    {selectedLog.details.map((detail, i) => (
                      <div key={i} className="flex items-start gap-3 px-3 py-2 bg-surface/30 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-accent-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-300">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Run history list
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Run History</h3>
              {agentLogs.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">No runs yet</p>
              ) : (
                <div className="space-y-2">
                  {agentLogs.map(log => {
                    const cfg = statusConfig[log.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <button
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-raised border border-surface-border hover:border-brand-500/30 transition-all text-left group"
                      >
                        <StatusIcon className={clsx('w-5 h-5 shrink-0', cfg.color)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{log.summary}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatDate(log.startedAt)} at {formatTime(log.startedAt)} · {duration(log.startedAt, log.completedAt)}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-brand-400 transition-colors shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
