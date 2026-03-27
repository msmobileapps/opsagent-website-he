import { clsx } from 'clsx';
import { AgentStatus } from '@/lib/types';

const config: Record<AgentStatus, { label: string; dot: string; bg: string; text: string }> = {
  running: {
    label: 'Running',
    dot: 'bg-accent-500 animate-pulse',
    bg: 'bg-accent-500/10 border-accent-500/20',
    text: 'text-accent-400',
  },
  idle: {
    label: 'Idle',
    dot: 'bg-gray-500',
    bg: 'bg-gray-500/10 border-gray-500/20',
    text: 'text-gray-400',
  },
  error: {
    label: 'Error',
    dot: 'bg-red-500 animate-pulse',
    bg: 'bg-red-500/10 border-red-500/20',
    text: 'text-red-400',
  },
  scheduled: {
    label: 'Scheduled',
    dot: 'bg-brand-400',
    bg: 'bg-brand-500/10 border-brand-500/20',
    text: 'text-brand-400',
  },
};

export function StatusBadge({ status }: { status: AgentStatus }) {
  const c = config[status];
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', c.bg, c.text)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', c.dot)} />
      {c.label}
    </span>
  );
}
