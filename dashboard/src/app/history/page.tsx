'use client';

import { useState } from 'react';
import { executionLogs } from '@/lib/mock-data';
import { ExecutionLogItem } from '@/components/execution-log';
import { clsx } from 'clsx';

const departments = ['All', 'Sales', 'HR', 'Finance', 'Marketing'];

export default function HistoryPage() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? executionLogs
    : executionLogs.filter(l => l.department === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Execution History</h1>
          <p className="text-sm text-gray-500 mt-1">{executionLogs.length} total executions</p>
        </div>
        <div className="flex gap-1 bg-surface-raised border border-surface-border rounded-lg p-1">
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={clsx(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                filter === d
                  ? 'bg-brand-500/20 text-brand-400'
                  : 'text-gray-400 hover:text-gray-200'
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(log => (
          <ExecutionLogItem key={log.id} log={log} />
        ))}
      </div>
    </div>
  );
}
