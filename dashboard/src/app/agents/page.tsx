'use client';

import { useState } from 'react';
import { agents as initialAgents, executionLogs } from '@/lib/mock-data';
import { Agent } from '@/lib/types';
import { AgentCard } from '@/components/agent-card';
import { AgentDetail } from '@/components/agent-detail';
import { ScheduleModal } from '@/components/schedule-modal';
import { addToast } from '@/components/toast';
import { Plus, MessageSquare } from 'lucide-react';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleStart = (id: string) => {
    setAgents(prev => {
      const updated = prev.map(a =>
        a.id === id ? { ...a, status: 'running' as const, lastRun: new Date().toISOString() } : a
      );
      // Update selectedAgent if it's the one being started
      if (selectedAgent?.id === id) {
        setSelectedAgent(updated.find(a => a.id === id) || null);
      }
      return updated;
    });
    const agent = agents.find(a => a.id === id);
    addToast(`${agent?.name} started`, 'success');
  };

  const handleStop = (id: string) => {
    setAgents(prev => {
      const updated = prev.map(a =>
        a.id === id ? { ...a, status: 'idle' as const } : a
      );
      if (selectedAgent?.id === id) {
        setSelectedAgent(updated.find(a => a.id === id) || null);
      }
      return updated;
    });
    const agent = agents.find(a => a.id === id);
    addToast(`${agent?.name} stopped`, 'info');
  };

  const handleEditSchedule = (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (agent) setEditingAgent(agent);
  };

  const handleSaveSchedule = (schedule: string) => {
    if (!editingAgent) return;
    setAgents(prev => {
      const updated = prev.map(a =>
        a.id === editingAgent.id ? { ...a, schedule } : a
      );
      if (selectedAgent?.id === editingAgent.id) {
        setSelectedAgent(updated.find(a => a.id === editingAgent.id) || null);
      }
      return updated;
    });
    addToast(`${editingAgent.name} schedule updated to: ${schedule}`, 'success');
    setEditingAgent(null);
  };

  const handleCardClick = (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (agent) setSelectedAgent(agent);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Agent Monitoring</h1>
        <p className="text-sm text-gray-500 mt-1">Click an agent to view output and manage schedule</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {agents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onStart={handleStart}
            onStop={handleStop}
            onEditSchedule={handleEditSchedule}
            onClick={handleCardClick}
          />
        ))}

        {/* Request New Agent card */}
        <button
          onClick={() => addToast('Request submitted — our team will be in touch within 24 hours', 'success')}
          className="border-2 border-dashed border-surface-border rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-brand-500/40 hover:bg-brand-500/5 transition-all group min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
            <Plus className="w-6 h-6 text-brand-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-white">Request New Agent</p>
            <p className="text-xs text-gray-500 mt-1">Automate another workflow</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-400 bg-brand-500/10 border border-brand-500/20">
            <MessageSquare className="w-3 h-3" />
            Talk to Us
          </div>
        </button>
      </div>

      {selectedAgent && (
        <AgentDetail
          agent={selectedAgent}
          logs={executionLogs}
          onClose={() => setSelectedAgent(null)}
          onStart={handleStart}
          onStop={handleStop}
          onEditSchedule={handleEditSchedule}
        />
      )}

      {editingAgent && (
        <ScheduleModal
          agentName={editingAgent.name}
          currentSchedule={editingAgent.schedule}
          onSave={handleSaveSchedule}
          onClose={() => setEditingAgent(null)}
        />
      )}
    </div>
  );
}
