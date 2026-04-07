import { create } from 'zustand';
import type { Agent, Message, WorkflowNode, WorkflowEdge, ToolCall } from '@/types';
import { initialAgents, initialNodes, initialEdges } from '../utils/mockData';

interface MasState {
  // 智能体
  agents: Agent[];
  updateAgentStatus: (id: string, status: Agent['status']) => void;

  // 消息
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateStreamingMessage: (content: string) => void;

  // 工作流
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  setActiveNode: (nodeId: string) => void;
  completeNode: (nodeId: string) => void;

  // 工具调用
  toolCalls: ToolCall[];
  addToolCall: (toolCall: Omit<ToolCall, 'id' | 'timestamp'>) => string;
  updateToolCallStatus: (id: string, status: ToolCall['status'], output?: string) => void;

  // 任务控制
  isRunning: boolean;
  startTask: () => void;
  stopTask: () => void;

  // 内部状态
  _idCounter: number;
  _generateId: () => string;
}

export const useMasStore = create<MasState>((set, get) => ({
  // 初始数据
  agents: initialAgents,
  nodes: initialNodes,
  edges: initialEdges,
  messages: [],
  toolCalls: [],
  isRunning: false,
  _idCounter: 0,

  // 生成唯一ID
  _generateId: () => {
    const state = get();
    const newId = `${Date.now()}-${state._idCounter}`;
    set({ _idCounter: state._idCounter + 1 });
    return newId;
  },

  // 智能体操作
  updateAgentStatus: (id, status) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, status } : a)),
    })),

  // 消息操作
  addMessage: (message) => {
    const id = get()._generateId();
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id,
          timestamp: new Date(),
        },
      ],
    }));
  },

  updateStreamingMessage: (content) =>
    set((state) => {
      const lastMsg = state.messages[state.messages.length - 1];
      if (!lastMsg?.isStreaming) return state;
      return {
        messages: [...state.messages.slice(0, -1), { ...lastMsg, content }],
      };
    }),

  // 工作流操作
  setActiveNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, status: 'active' } : n)),
    })),

  completeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, status: 'completed' } : n)),
    })),

  // 工具调用操作
  addToolCall: (toolCall) => {
    const id = get()._generateId();
    set((state) => ({
      toolCalls: [
        ...state.toolCalls,
        {
          ...toolCall,
          id,
          timestamp: new Date(),
        },
      ],
    }));
    return id;
  },

  updateToolCallStatus: (id, status, output) =>
    set((state) => ({
      toolCalls: state.toolCalls.map((t) =>
        t.id === id ? { ...t, status, output: output || t.output } : t
      ),
    })),

  // 任务控制（模拟执行）
  startTask: async () => {
    set({ isRunning: true });

    const {
      addMessage,
      setActiveNode,
      completeNode,
      updateAgentStatus,
      addToolCall,
      updateToolCallStatus,
    } = get();

    // 添加系统消息
    addMessage({
      role: 'system',
      type: 'system',
      content: '🚀 多智能体协作任务开始执行...',
    });

    // 模拟工作流执行
    const workflowSteps = [
      { nodeId: 'start', message: '📍 任务开始' },
      {
        nodeId: 'plan',
        agentId: 'supervisor' as const,
        message: '📋 正在制定任务计划...',
        delay: 2000,
      },
      {
        nodeId: 'search',
        agentId: 'researcher' as const,
        message: '🔍 搜索相关资料...',
        delay: 3000,
      },
      { nodeId: 'write', agentId: 'writer' as const, message: '✍️ 撰写内容...', delay: 2500 },
      {
        nodeId: 'review',
        agentId: 'reviewer' as const,
        message: '✅ 审核内容质量...',
        delay: 2000,
      },
      { nodeId: 'end', message: '🎉 任务完成！' },
    ];

    for (let i = 0; i < workflowSteps.length; i++) {
      const step = workflowSteps[i];

      // 设置当前节点为活跃状态
      setActiveNode(step.nodeId);

      // 添加步骤消息
      addMessage({
        role: step.agentId || 'system',
        type: step.agentId ? 'agent' : 'system',
        content: step.message,
      });

      // 如果有对应的智能体，更新其状态
      if (step.agentId) {
        updateAgentStatus(step.agentId, 'thinking');

        // 模拟工具调用
        setTimeout(() => {
          updateAgentStatus(step.agentId, 'working');
          const toolCallId = addToolCall({
            agentId: step.agentId!,
            toolName: 'process_task',
            input: `执行 ${step.message}`,
            output: '处理成功',
            status: 'calling',
          });

          // 更新工具调用状态
          setTimeout(() => {
            updateToolCallStatus(toolCallId, 'success', '任务处理完成');
          }, 1000);
        }, 500);
      }

      // 等待延迟
      if (step.delay) {
        await new Promise((resolve) => setTimeout(resolve, step.delay));
      }

      // 完成当前节点
      completeNode(step.nodeId);

      // 更新智能体状态为完成
      if (step.agentId) {
        updateAgentStatus(step.agentId, 'done');
      }
    }

    // 添加完成消息
    addMessage({
      role: 'system',
      type: 'system',
      content: '✨ 所有任务已成功完成！',
    });

    set({ isRunning: false });
  },

  stopTask: () => set({ isRunning: false }),
}));
