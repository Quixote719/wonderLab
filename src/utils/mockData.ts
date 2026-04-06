import type { WorkflowNode, WorkflowEdge, Agent } from '../types';

export const initialNodes: WorkflowNode[] = [
  { id: 'start', type: 'start', label: '开始', status: 'pending' },
  { id: 'plan', type: 'agent', label: '任务规划', agentId: 'supervisor', status: 'pending' },
  { id: 'search', type: 'agent', label: '资料搜索', agentId: 'researcher', status: 'pending' },
  { id: 'write', type: 'agent', label: '内容撰写', agentId: 'writer', status: 'pending' },
  { id: 'review', type: 'agent', label: '内容审核', agentId: 'reviewer', status: 'pending' },
  { id: 'end', type: 'end', label: '完成', status: 'pending' },
];

export const initialEdges: WorkflowEdge[] = [
  { id: 'e1', source: 'start', target: 'plan' },
  { id: 'e2', source: 'plan', target: 'search' },
  { id: 'e3', source: 'search', target: 'write' },
  { id: 'e4', source: 'write', target: 'review' },
  { id: 'e5', source: 'review', target: 'end' },
];

export const initialAgents: Agent[] = [
  {
    id: 'supervisor',
    name: 'Alice (总监)',
    role: 'supervisor',
    avatar: '👩‍💼',
    status: 'idle',
    description: '负责任务拆解与协调',
  },
  {
    id: 'researcher',
    name: 'Bob (研究员)',
    role: 'researcher',
    avatar: '🔍',
    status: 'idle',
    description: '负责搜索资料与调研',
  },
  {
    id: 'writer',
    name: 'Charlie (写手)',
    role: 'writer',
    avatar: '✍️',
    status: 'idle',
    description: '负责撰写内容',
  },
  {
    id: 'reviewer',
    name: 'Diana (审稿)',
    role: 'reviewer',
    avatar: '✅',
    status: 'idle',
    description: '负责校对与优化',
  },
];
