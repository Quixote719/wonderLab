import React from 'react';
import { useMasStore } from '../store/useMasStore';
import { clsx } from 'clsx';
import { Terminal, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronRight } from 'lucide-react';

export const ToolLogPanel = () => {
  const { toolCalls, agents } = useMasStore();
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const getAgentName = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    return agent?.name || 'Unknown Agent';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'calling':
        return <Loader2 size={14} className="text-yellow-500 animate-spin" />;
      case 'success':
        return <CheckCircle2 size={14} className="text-green-500" />;
      case 'error':
        return <XCircle size={14} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'calling':
        return 'bg-yellow-100 text-yellow-700';
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-10 border-b border-gray-200 flex items-center px-4">
        <Terminal size={16} className="mr-2 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">工具调用日志</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {toolCalls.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
            <Terminal size={32} className="mb-2 opacity-30" />
            <p className="text-xs">暂无工具调用记录</p>
          </div>
        ) : (
          toolCalls.map((call) => (
            <div
              key={call.id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
            >
              {/* 头部 */}
              <div
                className="px-3 py-2 bg-white border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === call.id ? null : call.id)}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(call.status)}
                  <span className="text-xs font-medium text-gray-700">
                    {getAgentName(call.agentId)}
                  </span>
                  <span className="text-xs text-gray-400">→</span>
                  <span className="text-xs font-mono text-blue-600">{call.toolName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                      getStatusBadgeColor(call.status)
                    )}
                  >
                    {call.status === 'calling'
                      ? '调用中'
                      : call.status === 'success'
                        ? '成功'
                        : '失败'}
                  </span>
                  {expandedId === call.id ? (
                    <ChevronDown size={14} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={14} className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* 展开内容 */}
              {expandedId === call.id && (
                <div className="p-3 space-y-2 text-xs">
                  <div>
                    <div className="text-gray-500 mb-1 font-medium">输入:</div>
                    <pre className="bg-white p-2 rounded border border-gray-200 text-gray-700 overflow-x-auto whitespace-pre-wrap">
                      {call.input}
                    </pre>
                  </div>
                  {call.output && (
                    <div>
                      <div className="text-gray-500 mb-1 font-medium">输出:</div>
                      <pre className="bg-white p-2 rounded border border-gray-200 text-gray-700 overflow-x-auto whitespace-pre-wrap">
                        {call.output}
                      </pre>
                    </div>
                  )}
                  <div className="text-gray-400 text-[10px] pt-1">
                    {call.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
