// src/components/TimeDisplay.tsx
import React from 'react';

// 定义Props类型
interface TimeDisplayProps {
  type: 'solar' | 'lunar';
  date: string;
  time: string;
  zodiac?: string;
  isVisible: boolean;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  type,
  date,
  time,
  zodiac,
  isVisible,
}) => {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-500 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 blur-0'
          : 'opacity-0 translate-y-6 scale-95 blur-sm pointer-events-none'
      }`}
    >
      {/* 类型标题 */}
      <h3 className={`text-2xl font-bold mb-4 text-shadow-md ${
        type === 'solar' ? 'text-sky-100' : 'text-amber-100'
      }`}>
        {type === 'solar' ? '公历' : '农历'}
        {zodiac && type === 'lunar' && `（${zodiac}年）`}
      </h3>
      {/* 日期 */}
      <p className="text-xl md:text-2xl text-white/90 mb-3 font-light">
        {date}
      </p>
      {/* 时间（带数字跳动动画） */}
      <div className="text-3xl md:text-4xl font-semibold text-white animate-number-pulse">
        {time}
      </div>
    </div>
  );
};

export default TimeDisplay;