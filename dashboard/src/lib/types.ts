export type AgentStatus = 'running' | 'idle' | 'error' | 'scheduled';

export interface Agent {
  id: string;
  name: string;
  department: string;
  description: string;
  status: AgentStatus;
  schedule: string;
  lastRun: string | null;
  nextRun: string;
  icon: string;
  metrics: {
    label: string;
    value: string | number;
    trend?: number; // percentage change
  }[];
}

export interface ExecutionLog {
  id: string;
  agentId: string;
  agentName: string;
  department: string;
  startedAt: string;
  completedAt: string;
  status: 'success' | 'partial' | 'failed';
  summary: string;
  details: string[];
  outputCount?: number;
}

export interface DepartmentMetrics {
  department: string;
  icon: string;
  kpis: {
    label: string;
    value: string | number;
    unit?: string;
    trend: number;
    sparkline: number[];
  }[];
}
