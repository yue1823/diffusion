import React, { useEffect, useState } from 'react';
import god1 from"./website_image/god1.PNG"
import moon1 from "./website_image/moon1.PNG";
import moon2 from "./website_image/moon2.PNG";
const Scroll_down_moon: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [topPosition, setTopPosition] = useState('10%');
    const handleScroll = () => {
        const position = window.scrollY;
        console.log(position)
        if(position < 400 && position > 0){
            setScrollPosition(-position);
        };
        if(position < 1000 && position > 400){
            setScrollPosition(position);
        };
        if (position > 1001 && position <= 1500) {
            const newTopPosition = ((position - 1001) / 500) * 50; // 计算 top 百分比
            setTopPosition(`${Math.min(-newTopPosition, 40)}%`); // 最大为 40%
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const godStyle = {
        position: 'fixed' as 'fixed',
        right: `${1180 + scrollPosition * 0.1}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: topPosition,
        transform: `translateX(${Math.min(scrollPosition, 600)}px)`,
        transition: 'transform 0.3s ease-out',
        zIndex:10,
        width:1200,
        height:1200,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
        left:-750
    };

    const moon1Style = {
        position: 'fixed' as 'fixed',
        right: `${1180 + scrollPosition * 0.1+50}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 3%)`,
        transform: `translateX(${Math.min(scrollPosition, 600)}px)`,
        transition: 'transform 0.2s ease-out',
        zIndex:4,
        width:1200,
        height:1200,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
        left:-730,

    };
    const moon2Style = {
        position: 'fixed' as 'fixed',
        right: `${1180 + scrollPosition * 0.1+50}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + -3.5%)`,
        transform: `translateX(${Math.min(scrollPosition, 600)}px)`,
        transition: 'transform 0.2s ease-out',
        zIndex:4,
        width:1200,
        height:1200,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

        left:-800
    };
    return (
        <>
            <div id="god-container" style={{position: 'relative'}}>
                <img id="moon" src={god1} style={godStyle} alt="Moon"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="moon" src={moon1} style={moon1Style} alt="Moon"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="moon" src={moon2} style={moon2Style} alt="Moon"/>
            </div>
        </>

    );
};

export default Scroll_down_moon;
