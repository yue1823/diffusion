import React, { useEffect, useState } from 'react';
import Logo from "../art/yue_logo.jpeg";
const Scroll_down: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = () => {
        const position = -window.scrollY;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const moonStyle = {
        position: 'fixed' as 'fixed',
        right: `${-680 + scrollPosition * 0.1}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: '20%',
        transform: `translateX(${Math.min(scrollPosition, 500)}px)`,
        transition: 'transform 0.1s ease-out',
        zIndex:2,
        width:100,
        height:100,
    };

    return (
        <div id="moon-container" style={{ position: 'relative' }}>
            <img id="moon" src={Logo} style={moonStyle} alt="Moon" />
        </div>
    );
};

export default Scroll_down;
