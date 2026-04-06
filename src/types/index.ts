// src/types/index.ts
export type AgentRole = 'researcher' | 'writer' | 'reviewer' | 'supervisor';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  avatar: string;
  status: 'idle' | 'thinking' | 'working' | 'done';
  description: string;
}

export type MessageType = 'user' | 'agent' | 'system' | 'tool';

export interface Message {
  id: string;
  role: AgentRole | 'user' | 'system';
  type: MessageType;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface WorkflowNode {
  id: string;
  type: 'start' | 'agent' | 'tool' | 'end';
  label: string;
  agentId?: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface ToolCall {
  id: string;
  agentId: string;
  toolName: string;
  input: string;
  output: string;
  timestamp: Date;
  status: 'calling' | 'success' | 'error';
}
