import { agents } from '@/lib/mock-data';
import { AgentCard } from '@/components/agent-card';

export default function AgentsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Agent Monitoring</h1>
        <p className="text-sm text-gray-500 mt-1">Detailed view of all operational agents</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
