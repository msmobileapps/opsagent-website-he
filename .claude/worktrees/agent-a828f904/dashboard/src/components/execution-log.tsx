'use client';

import { useState } from 'react';
import { ExecutionLog as ExecutionLogType } from '@/lib/types';
import { clsx } from 'clsx';
import { ChevronDown, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const statusConfig = {
  success: { icon: CheckCircle2, color: 'text-accent-400', bg: 'bg-accent-500/10' },
  partial: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
};

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-IL', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function duration(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

export function ExecutionLogItem({ log }: { log: ExecutionLogType }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[log.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="bg-surface-raised border border-surface-border rounded-xl overflow-hidden hover:border-surface-border/80 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', cfg.bg)}>
          <StatusIcon className={clsx('w-4 h-4', cfg.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white">{log.agentName}</h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-overlay text-gray-400">
              {log.department}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{log.summary}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400">{formatTime(log.startedAt)}</p>
          <p className="text-[10px] text-gray-500">{duration(log.startedAt, log.completedAt)}</p>
        </div>
        <ChevronDown
          className={clsx(
            'w-4 h-4 text-gray-500 transition-transform duration-200',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="bg-surface rounded-lg p-3 space-y-1.5">
            {log.details.map((detail, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-brand-400 mt-0.5">→</span>
                <span className="text-gray-300">{detail}</span>
              </div>
            ))}
          </div>
          {log.outputCount !== undefined && (
            <p className="text-xs text-gray-500 mt-2 pl-1">
              Output: {log.outputCount} items processed
            </p>
          )}
        </div>
      )}
    </div>
  );
}
