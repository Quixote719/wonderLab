import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Solar, Lunar } from 'lunar-javascript';
import churchImg from '@/assets/church.jpg';
import lionImg from '@/assets/lion.jpg';
import styles from './clockPage.module.css';

// 常量抽离
const MOUSE_POS_BUFFER_RATIO = 1/3;
const MOUSE_POS_MIN_BUFFER = 100;
const DATE_UPDATE_INTERVAL = 5000;

const ClockPage = () => {
  // 初始化日期
  const initialDate = new Date();
  const [dateStr, setDateStr] = useState(
    initialDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  );
  const [dateTimestamp, setDateTimestamp] = useState(initialDate.getTime());
  const [mousePos, setMousePos] = useState('left');
  // 背景尺寸（不再用cover兜底，精准控制）
  const [bgSize, setBgSize] = useState('');

  const mousePosRef = useRef(mousePos);
  const windowMiddleXRef = useRef(0);
  const churchImgRef = useRef<HTMLImageElement | null>(null);
  const lionImgRef = useRef<HTMLImageElement | null>(null);

  // 同步mousePos到ref
  useEffect(() => {
    mousePosRef.current = mousePos;
  }, [mousePos]);

  // 日期更新函数
  const genDateStr = useCallback(() => {
    const curDate = new Date();
    setDateStr(
      curDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    );
    setDateTimestamp(curDate.getTime());
  }, []);

  // 核心：按你的比例规则计算背景尺寸
  const calculateBgSize = useCallback((imgSrc: string) => {
    const img = imgSrc === churchImg ? churchImgRef.current : lionImgRef.current;
    if (!img) {
      const newImg = new Image();
      newImg.src = imgSrc;
      newImg.onload = () => {
        // 缓存图片对象
        if (imgSrc === churchImg) {
          churchImgRef.current = newImg;
        } else {
          lionImgRef.current = newImg;
        }
        computeSize(newImg);
      };
    } else {
      computeSize(img);
    }

    // 关键：按你的规则计算size
    function computeSize(img: HTMLImageElement) {
      // 1. 图片原始宽高比（宽/高）
      const imgRatio = img.naturalWidth / img.naturalHeight;
      // 2. 窗口宽高比（宽/高）
      const windowRatio = window.innerWidth / window.innerHeight;

      // 你的规则：
      // 图片宽高比 > 窗口宽高比 → 竖直100%（auto 100%），水平裁剪
      // 反之 → 水平100%（100% auto），竖直裁剪
      if (imgRatio > windowRatio) {
        setBgSize('auto 100%');
      } else {
        setBgSize('100% auto');
      }
    }
  }, []);

  useEffect(() => {
    // 彻底重置html/body样式，消除任何留白
    const html = document.documentElement;
    html.style.margin = '0';
    html.style.padding = '0';
    html.style.boxSizing = 'border-box';
    html.style.overflow = 'hidden';

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.boxSizing = 'border-box';
    document.body.style.overflow = 'hidden';

    windowMiddleXRef.current = window.innerWidth / 2;

    // mousemove节流
    let moveTimer: number | null = null;
    const handleMouseMove = (event: MouseEvent) => {
      if (moveTimer) clearTimeout(moveTimer);
      moveTimer = window.setTimeout(() => {
        const mouseClientX = event.clientX;
        const middleX = windowMiddleXRef.current;
        const buffer = Math.max(middleX * MOUSE_POS_BUFFER_RATIO, MOUSE_POS_MIN_BUFFER);
        const leftThreshold = middleX - buffer;
        const rightThreshold = middleX + buffer;

        let positionDesc = 'left';
        if (mouseClientX < leftThreshold) {
          positionDesc = 'left';
        } else if (mouseClientX > rightThreshold) {
          positionDesc = 'right';
        } else {
          positionDesc = 'middle';
        }

        if (mousePosRef.current !== positionDesc && positionDesc !== 'middle') {
          setMousePos(positionDesc);
        }
      }, 16);
    };

    // 窗口缩放时重新计算背景尺寸（保证适配）
    const handleResize = () => {
      windowMiddleXRef.current = window.innerWidth / 2;
      calculateBgSize(mousePos === 'left' ? churchImg : lionImg);
    };

    // 绑定事件
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // 定时器
    const timer = setInterval(genDateStr, DATE_UPDATE_INTERVAL);

    // 初始化背景尺寸
    calculateBgSize(churchImg);

    // 清理副作用
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
      if (moveTimer) clearTimeout(moveTimer);
      // 恢复样式（可选）
      html.style = '';
      document.body.style = '';
    };
  }, [genDateStr, calculateBgSize, mousePos]);

  // 农历日期计算
  const lunarDateStr = useMemo(() => {
    const date = new Date(dateTimestamp);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    return lunar.toString();
  }, [dateTimestamp]);

  // 切换图片时重新计算尺寸
  useEffect(() => {
    calculateBgSize(mousePos === 'left' ? churchImg : lionImg);
  }, [mousePos, calculateBgSize]);

  return (
    // 容器强制占满视口，无任何留白
    <div 
      className={styles.clockPage} 
      style={{
        // 背景图片
        backgroundImage: `url(${mousePos === 'left' ? churchImg : lionImg})`,
        // 保留top center定位
        backgroundPosition: 'top center',
        // 不重复
        backgroundRepeat: 'no-repeat',
        // 按规则计算的尺寸（不拉伸）
        backgroundSize: bgSize,
        // 强制占满视口（核心：无白边）
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div className="grid place-items-center h-full w-full">
        <div 
          className="px-8 py-4 rounded-3xl
          backdrop-blur-xl bg-white/10
          shadow-xs shadow-black/2
          sm:px-12 sm:py-6"
        >
          <div className="text-4xl sm:text-5xl md:text-6xl font-sans text-black">{dateStr}</div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-sans text-black">{lunarDateStr}</div>
        </div>
      </div>
    </div>
  );
};

export default ClockPage;