import React from 'react';
import { useMasStore } from '../store/useMasStore';
import { clsx } from 'clsx';
import { Circle, CheckCircle2, Loader2, Zap } from 'lucide-react';

export const AgentPanel = () => {
  const { agents } = useMasStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'thinking':
        return <Loader2 size={16} className="text-yellow-500 animate-spin" />;
      case 'working':
        return <Zap size={16} className="text-blue-500 animate-pulse" />;
      case 'done':
        return <CheckCircle2 size={16} className="text-green-500" />;
      default:
        return <Circle size={16} className="text-gray-300" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'thinking':
        return '思考中';
      case 'working':
        return '工作中';
      case 'done':
        return '已完成';
      default:
        return '待命';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thinking':
        return 'border-yellow-200 bg-yellow-50';
      case 'working':
        return 'border-blue-200 bg-blue-50';
      case 'done':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-10 border-b border-gray-200 flex items-center px-4">
        <span className="text-sm font-medium text-gray-700">智能体团队</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={clsx(
              'p-3 rounded-lg border-2 transition-all duration-200',
              getStatusColor(agent.status)
            )}
          >
            <div className="flex items-center gap-3">
              {/* 头像 */}
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl shadow-sm">
                {agent.avatar}
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-gray-800 truncate">{agent.name}</h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{agent.description}</p>
              </div>

              {/* 状态 */}
              <div className="flex items-center gap-1.5">
                {getStatusIcon(agent.status)}
                <span className="text-xs font-medium text-gray-600">
                  {getStatusText(agent.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
