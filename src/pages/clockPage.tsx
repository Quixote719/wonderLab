import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Solar } from 'lunar-javascript';
import churchImg from '@/assets/images/church.jpg';
import lionImg from '@/assets/images/lion.jpg';

// 常量抽离
const MOUSE_POS_BUFFER_RATIO = 1 / 5;
const MOUSE_POS_MIN_BUFFER = 100;
const DATE_UPDATE_INTERVAL = 5000;

// 优化1：定义类型，分别管理两张图的尺寸
interface BgSizes {
  church: string;
  lion: string;
}

const ClockPage = () => {
  // 初始化日期
  const initialDate = new Date();
  const [dateStr, setDateStr] = useState(
    initialDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  );
  const [dateTimestamp, setDateTimestamp] = useState(initialDate.getTime());
  const [mousePos, setMousePos] = useState<'left' | 'right'>('left');

  // 优化2：使用对象分别存储两张图的尺寸，不再共用
  const [bgSizes, setBgSizes] = useState<BgSizes>({
    church: 'cover', // 初始兜底
    lion: 'cover',
  });

  // Refs
  const mousePosRef = useRef(mousePos);
  const windowMiddleXRef = useRef(0);
  // 优化3：Ref 只存原始图片对象，不参与渲染逻辑
  const imagesMetaRef = useRef<{
    church?: HTMLImageElement;
    lion?: HTMLImageElement;
  }>({});

  // 同步 mousePos 到 ref (用于闭包陷阱)
  useEffect(() => {
    mousePosRef.current = mousePos;
  }, [mousePos]);

  // 优化4：抽离纯计算逻辑，不依赖 state
  const computeSize = useCallback((img: HTMLImageElement): string => {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const windowRatio = window.innerWidth / window.innerHeight;
    return imgRatio > windowRatio ? 'auto 100%' : '100% auto';
  }, []);

  // 优化5：预加载并计算单张图片尺寸的通用函数
  const loadAndComputeImage = useCallback(
    (src: string, key: keyof BgSizes) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesMetaRef.current[key] = img;
        const size = computeSize(img);
        setBgSizes((prev) => ({ ...prev, [key]: size }));
      };
    },
    [computeSize]
  );

  // 日期更新函数
  const genDateStr = useCallback(() => {
    const curDate = new Date();
    setDateStr(
      curDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
    setDateTimestamp(curDate.getTime());
  }, [setDateStr, setDateTimestamp]);

  // --- 逻辑拆分：1. 初始化与全局样式 ---
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // 保存原始样式以便恢复
    const originalHtmlStyle = html.style.cssText;
    const originalBodyStyle = body.style.cssText;

    html.style.margin = '0';
    html.style.padding = '0';
    html.style.boxSizing = 'border-box';
    html.style.overflow = 'hidden';
    body.style.margin = '0';
    body.style.padding = '0';
    body.style.boxSizing = 'border-box';
    body.style.overflow = 'hidden';

    windowMiddleXRef.current = window.innerWidth / 2;

    // 初始化：同时加载两张图，不再只加载当前图
    loadAndComputeImage(churchImg, 'church');
    loadAndComputeImage(lionImg, 'lion');

    return () => {
      html.style.cssText = originalHtmlStyle;
      body.style.cssText = originalBodyStyle;
    };
  }, [loadAndComputeImage]); // 依赖极稳定，只挂载时执行一次

  // --- 逻辑拆分：2. 鼠标移动监听 (不依赖 mousePos，避免反复绑定) ---
  useEffect(() => {
    let moveTimer: number | null = null;

    const handleMouseMove = (event: MouseEvent) => {
      if (moveTimer) clearTimeout(moveTimer);
      moveTimer = window.setTimeout(() => {
        const mouseClientX = event.clientX;
        const middleX = windowMiddleXRef.current;
        const buffer = Math.max(middleX * MOUSE_POS_BUFFER_RATIO, MOUSE_POS_MIN_BUFFER);
        const leftThreshold = middleX - buffer;
        const rightThreshold = middleX + buffer;

        // 直接在回调里判断，减少对外部 state 的依赖
        let newPos: 'left' | 'right' = mousePosRef.current;
        if (mouseClientX < leftThreshold) {
          newPos = 'left';
        } else if (mouseClientX > rightThreshold) {
          newPos = 'right';
        }

        if (mousePosRef.current !== newPos) {
          setMousePos(newPos);
        }
      }, 16);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (moveTimer) clearTimeout(moveTimer);
    };
  }, []); // 空依赖，只挂载一次

  // --- 逻辑拆分：3. 窗口 resize 监听 ---
  useEffect(() => {
    const handleResize = () => {
      windowMiddleXRef.current = window.innerWidth / 2;

      // 优化6：窗口变化时，重新计算两张图的尺寸（如果已加载）
      const newSizes: Partial<BgSizes> = {};
      if (imagesMetaRef.current.church) {
        newSizes.church = computeSize(imagesMetaRef.current.church);
      }
      if (imagesMetaRef.current.lion) {
        newSizes.lion = computeSize(imagesMetaRef.current.lion);
      }
      if (Object.keys(newSizes).length > 0) {
        setBgSizes((prev) => ({ ...prev, ...newSizes }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 逻辑拆分：4. 日期定时器 ---
  useEffect(() => {
    const timer = setInterval(genDateStr, DATE_UPDATE_INTERVAL);
    return () => clearInterval(timer);
  }, [genDateStr]);

  // 农历日期计算
  const lunarDateStr = useMemo(() => {
    const date = new Date(dateTimestamp);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();

    // 获取天干地支年
    const ganZhiYear = lunar.getYearInGanZhi();
    // 获取农历月份
    const lunarMonth = lunar.getMonthInChinese();
    // 获取农历日期
    const lunarDay = lunar.getDayInChinese();

    return `${ganZhiYear}年${lunarMonth}月${lunarDay}`;
  }, [dateTimestamp]);

  // 优化7：移除了切换时才计算尺寸的 useEffect，因为我们已经预加载好了

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      {/* 背景层 1：Church */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          mousePos === 'left' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundImage: `url(${churchImg})`,
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: bgSizes.church, // 使用独立的尺寸
        }}
      />

      {/* 背景层 2：Lion */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          mousePos === 'right' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundImage: `url(${lionImg})`,
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: bgSizes.lion, // 使用独立的尺寸
        }}
      />

      {/* 内容层 */}
      <div className="grid place-items-center h-full w-full relative z-10">
        <div
          className="px-8 py-4 rounded-3xl
          backdrop-blur-xl bg-white/10
          shadow-xs shadow-black/2
          sm:px-12 sm:py-6"
        >
          {mousePos === 'left' && (
            <div
              className="text-xl sm:text-5xl md:text-7xl font-sans text-black font-light"
              style={{ fontFamily: "'Montserrat'" }}
            >
              {dateStr}
            </div>
          )}
          {mousePos === 'right' && (
            <div
              className="text-4xl sm:text-5xl md:text-7xl text-black [writing-mode:vertical-rl] font-light"
              style={{ fontFamily: "'Long Cang', 'Kaiti SC', 'STKaiti', serif" }}
            >
              {lunarDateStr}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClockPage;
