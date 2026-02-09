import React, { useState, useMemo, useEffect } from 'react'
import { Solar, Lunar } from 'lunar-javascript'
import styles from './clockPage.module.css'
import DateTimeSwitch from '@/components/dateTimeSwitch';

const ClockPage = () => {
    const [dateStr, setDateStr] = useState('');

    useEffect(() => {
        setInterval(() => {
            genDateStr();
        }, 1000);
        genDateStr();
    }, [])

    const lunaDateStr = useMemo(() => {
        const date = new Date(dateStr);
        if(date.toString() === 'Invalid Date') return ''
        const year = date.getFullYear(); // 2026
        const month = date.getMonth() + 1; // 月份从0开始，需+1 → 2
        const day = date.getDate(); // 5

        // 步骤2：公历转农历
        const solar = Solar.fromYmd(year, month, day); // 创建公历对象
        const lunar = solar.getLunar(); // 转为农历对象
        return lunar.toString()
    }, [dateStr])
    
    const genDateStr = () => {
        const curDate = new Date();
        const localISO = curDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        setDateStr(localISO)
    }

    return (
        <div className={styles.clockPage}>
            <div className="grid place-items-center h-screen">
                <div 
                    className="px-8 py-4 rounded-3xl  /* 更大的圆角，进一步弱化边缘 */
                    backdrop-blur-xl bg-white/10  /* 更高模糊+更低透明度，近乎“融”入背景 */
                    shadow-xs shadow-black/2       /* 极轻的阴影，仅防完全与背景粘连 */
                    sm:px-12 sm:py-6"
            >
                <div className="text-4xl sm:text-5xl md:text-6xl font-sans text-black">{dateStr}</div>
                </div>
                {/* <div className="text-4xl font-bold">{lunaDateStr}</div> */}
            </div>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <DateTimeSwitch />
            </div>
        </div>
    );
};

export default ClockPage;