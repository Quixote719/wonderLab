// src/components/DateTimeSwitcher.tsx
import { useState, useEffect, useRef } from 'react';
import { Solar, Lunar } from 'lunar-javascript';
import TimeDisplay from '@/components/TimeDisplay';

const DateTimeSwitch: React.FC = () => {
  // 核心状态
  const [showType, setShowType] = useState<'solar' | 'lunar'>('solar');
  const [currentTime, setCurrentTime] = useState(new Date());
  // 定时器Ref（用于手动切换后重置自动切换）
  const autoSwitchTimer = useRef<NodeJS.Timeout | null>(null);

  // 1. 实时更新时间（每秒刷新）
  useEffect(() => {
    const timeTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeTimer);
  }, []);

  // 2. 5秒自动切换逻辑（支持重置）
  const startAutoSwitch = () => {
    // 先清除旧定时器，避免叠加
    if (autoSwitchTimer.current) clearInterval(autoSwitchTimer.current);
    // 5秒自动切换
    autoSwitchTimer.current = setInterval(() => {
      toggleShowType();
    }, 5000);
  };

  // 初始化自动切换
  useEffect(() => {
    startAutoSwitch();
    // 组件卸载清除定时器
    return () => {
      if (autoSwitchTimer.current) clearInterval(autoSwitchTimer.current);
    };
  }, []);

  // 3. 手动切换+重置自动切换倒计时
  const toggleShowType = () => {
    setShowType(prev => prev === 'solar' ? 'lunar' : 'solar');
    // 切换后重置自动切换（从5秒重新开始）
    startAutoSwitch();
  };

  // 4. 解析阳历/阴历数据
  const parseDateTime = () => {
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1;
    const day = currentTime.getDate();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}:${seconds}`;

    // 阳历数据
    const solar = {
      date: `${year}年${month}月${day}日`,
      time: timeStr,
    };

    // 阴历数据
    const lunarObj = Solar.fromYmd(year, month, day).getLunar();
    const lunar = {
      date: `${lunarObj.getYearInChinese()}${lunarObj.getMonthInChinese()}${lunarObj.getDayInChinese()}`,
      time: timeStr,
      zodiac: lunarObj.getYearShengXiao(),
    };

    return { solar, lunar };
  };

  const { solar, lunar } = parseDateTime();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 bg-size-200 animate-gradient-shift">
      {/* 核心卡片：磨砂玻璃+多层阴影+圆角 */}
      <div className="relative w-full max-w-md h-[300px] bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* 手动切换按钮：悬浮动画+层级置顶 */}
        <button
          onClick={toggleShowType}
          className="absolute top-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium hover:bg-white/20 active:scale-95 transition-all duration-300 z-10"
        >
          切换{showType === 'solar' ? '农历' : '公历'}
        </button>

        {/* 阳历显示组件 */}
        <TimeDisplay
          type="solar"
          date={solar.date}
          time={solar.time}
          isVisible={showType === 'solar'}
        />

        {/* 阴历显示组件 */}
        <TimeDisplay
          type="lunar"
          date={lunar.date}
          time={lunar.time}
          zodiac={lunar.zodiac}
          isVisible={showType === 'lunar'}
        />

        {/* 装饰元素：底部渐变条（提升设计感） */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-purple-400 to-amber-400"></div>
      </div>
    </div>
  );
};

export default DateTimeSwitch;