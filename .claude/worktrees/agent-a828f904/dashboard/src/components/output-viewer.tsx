'use client';

import { OutputSection, OutputAction } from '@/lib/types';
import { addToast } from './toast';
import { clsx } from 'clsx';
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Mail,
  Calendar,
  User,
  DollarSign,
  Eye,
  Send,
  Pencil,
  Download,
  UserPlus,
  Phone,
  X,
  ExternalLink,
  FileSpreadsheet,
  FileImage,
} from 'lucide-react';

const sectionStyles = {
  summary: { border: 'border-brand-500/20', bg: 'bg-brand-500/5', titleColor: 'text-brand-400' },
  results: { border: 'border-accent-500/20', bg: 'bg-accent-500/5', titleColor: 'text-accent-400' },
  attention: { border: 'border-yellow-500/20', bg: 'bg-yellow-500/5', titleColor: 'text-yellow-400' },
  files: { border: 'border-gray-500/20', bg: 'bg-gray-500/5', titleColor: 'text-gray-300' },
  documents: { border: 'border-blue-500/20', bg: 'bg-blue-500/5', titleColor: 'text-blue-400' },
  contacts: { border: 'border-purple-500/20', bg: 'bg-purple-500/5', titleColor: 'text-purple-400' },
};

const itemIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  check: CheckCircle2,
  alert: AlertTriangle,
  file: FileText,
  email: Mail,
  calendar: Calendar,
  user: User,
  money: DollarSign,
  spreadsheet: FileSpreadsheet,
  image: FileImage,
};

const itemIconColors: Record<string, string> = {
  check: 'text-accent-400',
  alert: 'text-yellow-400',
  file: 'text-gray-400',
  email: 'text-brand-400',
  calendar: 'text-blue-400',
  user: 'text-purple-400',
  money: 'text-green-400',
  spreadsheet: 'text-green-400',
  image: 'text-pink-400',
};

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  send: Send,
  edit: Pencil,
  eye: Eye,
  download: Download,
  calendar: Calendar,
  'user-plus': UserPlus,
  phone: Phone,
  x: X,
  open: ExternalLink,
};

const actionStyles: Record<string, string> = {
  primary: 'bg-brand-500/15 text-brand-400 hover:bg-brand-500/25 border-brand-500/20',
  secondary: 'bg-surface-overlay text-gray-300 hover:bg-surface-overlay/80 border-surface-border',
  success: 'bg-accent-500/15 text-accent-400 hover:bg-accent-500/25 border-accent-500/20',
  danger: 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border-red-500/20',
};

const tagColors: Record<string, string> = {
  green: 'bg-accent-500/20 text-accent-400',
  blue: 'bg-blue-500/20 text-blue-400',
  purple: 'bg-purple-500/20 text-purple-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
  red: 'bg-red-500/20 text-red-400',
  gray: 'bg-gray-500/20 text-gray-400',
};

function ActionButton({ action }: { action: OutputAction }) {
  const IconComp = actionIcons[action.icon || 'eye'] || Eye;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        addToast(`${action.label} — action triggered`, 'success');
      }}
      className={clsx(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors',
        actionStyles[action.style]
      )}
    >
      <IconComp className="w-3 h-3" />
      {action.label}
    </button>
  );
}

export function OutputViewer({ sections }: { sections: OutputSection[] }) {
  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const style = sectionStyles[section.type] || sectionStyles.summary;
        return (
          <div key={idx} className={clsx('rounded-xl border p-4', style.border, style.bg)}>
            <h4 className={clsx('text-sm font-semibold mb-3 uppercase tracking-wider', style.titleColor)}>
              {section.title}
            </h4>
            <div className="space-y-2.5">
              {section.items.map((item, i) => {
                const IconComp = itemIcons[item.icon || 'check'] || Eye;
                const iconColor = itemIconColors[item.icon || 'check'] || 'text-gray-400';
                const hasActions = item.actions && item.actions.length > 0;

                return (
                  <div
                    key={i}
                    className={clsx(
                      'rounded-lg px-3 py-2.5',
                      item.highlight ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-surface/30',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <IconComp className={clsx('w-4 h-4 mt-0.5 shrink-0', item.highlight ? 'text-yellow-400' : iconColor)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={clsx('text-sm leading-relaxed', item.highlight ? 'text-yellow-100 font-medium' : 'text-gray-300')}>
                              {item.text}
                            </p>
                            {item.subtitle && (
                              <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                            )}
                          </div>
                          {item.tag && (
                            <span className={clsx('text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 uppercase', tagColors[item.tagColor || 'gray'])}>
                              {item.tag}
                            </span>
                          )}
                        </div>
                        {hasActions && (
                          <div className="flex flex-wrap gap-2 mt-2.5">
                            {item.actions!.map((action, ai) => (
                              <ActionButton key={ai} action={action} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
