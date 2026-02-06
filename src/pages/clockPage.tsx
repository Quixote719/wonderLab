import React, { useState, useMemo, useEffect } from 'react'
import { Solar, Lunar } from 'lunar-javascript'
import { Button } from "@/components/ui/button"

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
        console.log(date)
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
        const localISO = curDate.toISOString().replace('T', ' ').substring(0, 19);
        setDateStr(localISO)
    }

    return (
        <div>
            <div className="grid place-items-center h-screen">
                <div className="text-4xl font-bold">{dateStr}</div>
                <div className="text-4xl font-bold">{lunaDateStr}</div>
            </div>
        </div>
    );
};

export default ClockPage;