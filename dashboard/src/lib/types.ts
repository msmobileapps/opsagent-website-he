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
    trend?: number;
  }[];
}

export interface OutputAction {
  label: string;
  style: 'primary' | 'secondary' | 'success' | 'danger';
  icon?: string; // 'send' | 'edit' | 'eye' | 'download' | 'calendar' | 'user-plus' | 'phone' | 'x'
}

export interface OutputItem {
  icon?: string;
  text: string;
  subtitle?: string;     // secondary info line
  highlight?: boolean;
  actions?: OutputAction[];
  tag?: string;           // small label like "PDF" "DOCX" "₪52K"
  tagColor?: string;      // 'green' | 'blue' | 'purple' | 'yellow'
}

export interface OutputSection {
  type: 'summary' | 'results' | 'attention' | 'files' | 'documents' | 'contacts';
  title: string;
  items: OutputItem[];
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
  output?: OutputSection[];
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
