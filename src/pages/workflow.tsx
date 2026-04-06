import React from 'react';
import { WorkflowCanvas } from '@/components/workflowCanvas';
import { MessageList } from '@/components/messageList';
import { AgentPanel } from '@/components/agentPanel';
import { ToolLogPanel } from '@/components/toolLogPanel';
import { useMasStore } from '@/store/useMasStore';
import { Play, Square } from 'lucide-react';

const App = () => {
  const { isRunning, startTask, stopTask } = useMasStore();

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">
      {/* 顶部栏 */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <h1 className="text-lg font-semibold text-gray-800">MAS 多智能体协作系统</h1>
        </div>
        <div className="flex items-center gap-3">
          {!isRunning ? (
            <button
              onClick={startTask}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play size={18} />
              开始任务
            </button>
          ) : (
            <button
              onClick={stopTask}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Square size={18} />
              停止任务
            </button>
          )}
        </div>
      </header>

      {/* 主体内容 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 左侧：工作流图 */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="h-full flex flex-col">
            <div className="h-10 bg-white border-b border-gray-200 flex items-center px-4">
              <span className="text-sm font-medium text-gray-700">LangGraph 工作流</span>
            </div>
            <div className="flex-1">
              <WorkflowCanvas />
            </div>
          </div>
        </div>

        {/* 中间：对话区 */}
        <div className="flex-1 flex flex-col">
          <div className="h-10 bg-white border-b border-gray-200 flex items-center px-4">
            <span className="text-sm font-medium text-gray-700">协作对话</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <MessageList />
          </div>
        </div>

        {/* 右侧：智能体 + 工具日志 */}
        <div className="w-1/4 border-l border-gray-200 flex flex-col">
          <div className="h-1/2 border-b border-gray-200">
            <AgentPanel />
          </div>
          <div className="h-1/2">
            <ToolLogPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
