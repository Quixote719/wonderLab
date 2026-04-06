import React, { useEffect, useRef } from 'react';
import { useMasStore } from '../store/useMasStore';
import { clsx } from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot, Cog } from 'lucide-react';

export const MessageList = () => {
  const { messages, agents } = useMasStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getAgentAvatar = (role: string) => {
    const agent = agents.find((a) => a.role === role);
    return agent?.avatar || '🤖';
  };

  const getAgentName = (role: string) => {
    const agent = agents.find((a) => a.role === role);
    return agent?.name || 'AI Agent';
  };

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto bg-white p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <Bot size={64} className="mb-4 opacity-50" />
          <p className="text-lg">点击「开始任务」启动多智能体协作</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              'flex gap-3 max-w-4xl',
              msg.type === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            )}
          >
            {/* 头像 */}
            <div
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg',
                msg.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'
              )}
            >
              {msg.type === 'user' ? (
                <User size={20} className="text-blue-600" />
              ) : msg.type === 'system' ? (
                <Cog size={20} className="text-gray-500" />
              ) : (
                getAgentAvatar(msg.role)
              )}
            </div>

            {/* 消息内容 */}
            <div
              className={clsx(
                'px-4 py-3 rounded-2xl',
                msg.type === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              )}
            >
              {/* 发送者名称（非用户消息显示） */}
              {msg.type !== 'user' && (
                <div className="text-xs font-medium mb-1 opacity-70">
                  {msg.type === 'system' ? '系统' : getAgentName(msg.role)}
                </div>
              )}

              {/* 消息正文 */}
              <div className="text-sm leading-relaxed">
                {msg.type === 'user' ? (
                  msg.content
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                )}
                {msg.isStreaming && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse align-middle" />
                )}
              </div>

              {/* 时间戳 */}
              <div className="text-xs mt-1 opacity-50">{msg.timestamp.toLocaleTimeString()}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
