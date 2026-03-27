'use client';

import { Bot, Play, Clock, CheckCircle2, XCircle } from 'lucide-react';

const agents = [
  {
    "id": "lead-pipeline",
    "name": "Lead Pipeline",
    "enabled": true,
    "schedule": "0 8 * * 1-5"
  },
  {
    "id": "social-posts",
    "name": "Social Posts",
    "enabled": true,
    "schedule": "0 7 * * 1-5"
  },
  {
    "id": "receipts",
    "name": "Receipts",
    "enabled": false,
    "schedule": "0 8 * * 1"
  }
];

export default function DemoClientAgents() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">AI Agents — Demo Corp</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and run agents</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <div
            key={agent.id}
            className="bg-surface-raised border border-surface-border rounded-xl p-4 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-sm font-semibold text-white">{agent.name}</span>
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                agent.enabled ? 'text-emerald-400 bg-emerald-500/20' : 'text-gray-500 bg-gray-500/10'
              }`}>
                {agent.enabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {agent.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <Clock className="w-3 h-3" />
              <span>{agent.schedule || 'Manual only'}</span>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/20 transition-colors">
              <Play className="w-3 h-3" />
              Run Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}