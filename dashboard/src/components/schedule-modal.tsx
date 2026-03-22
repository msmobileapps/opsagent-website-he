'use client';

import { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { clsx } from 'clsx';

const presets = [
  { label: 'Manual only', value: 'Manual only' },
  { label: 'Every hour', value: 'Every hour' },
  { label: 'Every 2 hours', value: 'Every 2 hours' },
  { label: 'Daily at 07:00', value: 'Every day at 07:00' },
  { label: 'Daily at 08:00', value: 'Every day at 08:00' },
  { label: 'Daily at 09:00', value: 'Every day at 09:00' },
  { label: 'Daily at 18:00', value: 'Every day at 18:00' },
  { label: 'Weekly (Monday)', value: 'Every Monday at 10:00' },
  { label: 'Weekly (Sunday)', value: 'Every Sunday at 07:00' },
  { label: 'End of month', value: 'Last day of month at 09:00' },
];

interface ScheduleModalProps {
  agentName: string;
  currentSchedule: string;
  onSave: (schedule: string) => void;
  onClose: () => void;
}

export function ScheduleModal({ agentName, currentSchedule, onSave, onClose }: ScheduleModalProps) {
  const [selected, setSelected] = useState(currentSchedule);

  return (
    <div className="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-surface-raised border border-surface-border rounded-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Edit Schedule</h3>
              <p className="text-xs text-gray-500">{agentName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-overlay">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-2">
          {presets.map(preset => (
            <button
              key={preset.value}
              onClick={() => setSelected(preset.value)}
              className={clsx(
                'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all',
                selected === preset.value
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                  : 'bg-surface/50 text-gray-300 border border-transparent hover:bg-surface-overlay hover:text-white'
              )}
            >
              {preset.label}
              {preset.value !== preset.label && (
                <span className="block text-xs text-gray-500 mt-0.5">{preset.value}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3 p-5 border-t border-surface-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-surface-overlay hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(selected)}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 transition-colors"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
