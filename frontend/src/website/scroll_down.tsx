import React, { useEffect, useState } from 'react';
import god1 from"./website_image/god1.PNG"
import moon1 from "./website_image/moon1.PNG";
import moon2 from "./website_image/moon2.PNG";
import cloud1 from "./website_image/cloud1.png";
import cloud2 from "./website_image/雲2.png";
import cloud3 from "./website_image/雲3.png";
import cloud4 from "../website/website_image/雲4.png";
import cloud5 from "./website_image/雲5.png";
import god2 from "./website_image/god2.png";
import many_cloud1 from "./website_image/多雲.png";
const Scroll_down_moon: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [linePosition,set_line_Position]=useState(0);
    const [topPosition, setTopPosition] = useState('10%');
    const handleScroll = () => {
        const position = window.scrollY;
        console.log(position)
        if (position < 400) {
            setScrollPosition(-position * 0.5);

        } else if (position >= 400 && position < 1000) {
            setScrollPosition((position -400  ) );
        } else if (position >= 1000 && position <= 1950) {
            const newTopPosition = ((position - 1000) / 500) * 50;
            setTopPosition(`${Math.min(-newTopPosition, 40)}%`); // 最大為 40%
        }
        set_line_Position(position * 0.5);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const many_cloud1_style = {
        position: 'fixed' as 'fixed',
        right: `${-1580 + scrollPosition * 0.1}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `${topPosition}`,
        transform: `translateX(${Math.min(-707+scrollPosition*1.15,980)}px)  translateY(440px)`,
        transition: 'transform 0.3s ease-out',
        zIndex:11,
        // display: 'flex',
        width:"52vmax",
        height:600,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    }
    const many_cloud2_style = {
        position: 'fixed' as 'fixed',
        right: `${1880 - scrollPosition * 0.1}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `${topPosition}`,
        transform: `translateX(${Math.min(1370-scrollPosition*1.15)}px)  translateY(440px) scaleX(-1)`,
        transition: 'transform 0.3s ease-out',
        zIndex:11,
        // display: 'flex',
        width:"52vmax",

        height:600,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    }
    const many_cloud3_style = {
        position: 'fixed' as 'fixed',
        right: `${1880 - scrollPosition * 0.1}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `${topPosition}`,
        transform: `translateX(${Math.min(-1118+scrollPosition*1.1)}px)  translateY(930px) rotate(90deg)`,
        transition: 'transform 0.3s ease-out',
        zIndex:10,
        // display: 'flex',
        width:"72vmax",

        height:600,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    }
    const many_cloud4_style = {
        position: 'fixed' as 'fixed',
        right: `${1880 - scrollPosition * 0.1}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `${topPosition}`,
        transform: `translateX(${Math.min(1503-scrollPosition*1.1)}px)  translateY(930px) rotate(270deg)`,
        transition: 'transform 0.3s ease-out',
        zIndex:10,
        // display: 'flex',
        width:"72vmax",

        height:600,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    }
    const fishinglink = {
        position: 'fixed' as 'fixed',
        top: topPosition,
        width: '3px',
        zIndex:10,
        right:930,
        // height: `${Math.min(-800+scrollPosition*1.4,5000)}px`,
        height: scrollPosition >= 500
            ? `${(linePosition-500 )}px`
            : '0px',
        transform: `translateY(348px)`,
        backgroundColor: 'white',
        borderColorder:'white',
        transition: 'height 0.1s ease-out',
    }
    const godStyle = {
        position: 'fixed' as 'fixed',
        right: `${1180 + scrollPosition * 0.1}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: topPosition,
        transform: `translateX(${Math.min(scrollPosition, 600)}px)`,
        transition: 'transform 0.3s ease-out',
        zIndex:10,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
        left:-750
    };

    const moon1Style = {
        position: 'fixed' as 'fixed',
        right: `${1180 + scrollPosition * 0.1+50}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 3%)`,
        transform: `translateX(${Math.min(scrollPosition, 600)}px)`,
        transition: 'transform 0.2s ease-out',
        zIndex:6,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
        left:-730,

    };
    const moon2Style = {
        position: 'fixed' as 'fixed',
        right: `${1180 + scrollPosition * 0.1+50}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 0.0%)`,
        transform: `translateX(${Math.min(scrollPosition, 600)}px)`,
        transition: 'transform 0.2s ease-out',
        zIndex:6,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

        left:-800
    };
    const cloud1style = {
        position: 'fixed' as 'fixed',
        right: `${1180 + scrollPosition * 0.1+50}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + -3.5%)`,
        transform: `translateX(${Math.min(scrollPosition, 600)}px)`,
        transition: 'transform 0.2s ease-out',
        zIndex:2,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

        left:-800
    };
    const cloud2style = {
        position: 'fixed' as 'fixed',
        right: `${1280 - scrollPosition * 0.25}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + -1.2% )`,
        transform: `translateX(${Math.min(scrollPosition, 600)}px)`,
        transition: 'transform 0.2s ease-out',
        zIndex:7,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    const cloud3style = {
        position: 'fixed' as 'fixed',
        right: `${Math.min(-400 + scrollPosition * 0.63)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 3.5% )`,
        transition: 'transform 0.2s ease-out',
        zIndex:3,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    const cloud4style = {
        position: 'fixed' as 'fixed',
        right: `${Math.min(-400 + scrollPosition * 0.5)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + -2.6% )`,
        transition: 'transform 0.2s ease-out',
        zIndex:2,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    const cloud5style = {
        position: 'fixed' as 'fixed',
        right: `${Math.min(-400 + scrollPosition * 0.67)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 3.0% )`,
        transition: 'transform 0.2s ease-out',
        zIndex:8,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    const god2style = {
        position: 'fixed' as 'fixed',
        right: `${Math.min(-400 + scrollPosition * 0.66)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 3.5% )`,
        transition: 'transform 0.2s ease-out',
        zIndex:7,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    return (
        <>
            <div id="god-container" style={{position: 'relative'}}>
                <img id="god1" src={god1} style={godStyle} alt="god1"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="moon1" src={moon1} style={moon1Style} alt="Moon1"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="moon2" src={moon2} style={moon2Style} alt="Moon2"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="cloud1" src={cloud1} style={cloud1style} alt="cloud1"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="cloud2" src={cloud2} style={cloud2style} alt="cloud2"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="cloud3" src={cloud3} style={cloud3style} alt="cloud3"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="cloud4" src={cloud4} style={cloud4style} alt="cloud4"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="cloud5" src={cloud5} style={cloud5style} alt="cloud5"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="god2" src={god2} style={god2style} alt="god2"/>
            </div>

            {scrollPosition <= 590 ? <></> : <>
                <div style={fishinglink}></div>
            </>}

            {/*<>*/}

            <div id="moon-container" style={{position: 'relative'}}>
                <img id="many_cloud1" src={many_cloud1} style={{...many_cloud1_style, left: -1}}
                     alt="many_cloud1"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="many_cloud2" src={many_cloud1} style={{...many_cloud2_style, left: -1}}
                     alt="many_cloud2"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="many_cloud3" src={many_cloud1} style={{...many_cloud3_style, left: -1}}
                     alt="many_cloud3"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <img id="many_cloud4" src={many_cloud1} style={{...many_cloud4_style, left: -1}}
                     alt="many_cloud4"/>
            </div>
            {/*<div id="moon-container" style={{position: 'relative'}}>*/}
            {/*    <img id="normal_cloud1" src={normal_cloud} style={{...normal_cloud_style, left: -780}}*/}
            {/*         alt="normal_cloud1"/>*/}
            {/*</div>*/}
            {/*<div id="moon-container" style={{position: 'relative'}}>*/}
            {/*    <img id="normal_cloud1" src={normal_cloud} style={{...normal_cloud_style, left: -715}}*/}
            {/*         alt="normal_cloud1"/>*/}
            {/*</div>*/}
            {/*<div id="moon-container" style={{position: 'relative'}}>*/}
            {/*    <img id="normal_cloud1" src={normal_cloud} style={{...normal_cloud_style, left: -650}}*/}
            {/*         alt="normal_cloud1"/>*/}
            {/*</div>*/}
            {/*<div id="moon-container" style={{position: 'relative'}}>*/}
            {/*    <img id="normal_cloud1" src={normal_cloud} style={{...normal_cloud_style, left: -585}}*/}
            {/*         alt="normal_cloud1"/>*/}
            {/*</div>*/}
            {/*<div id="moon-container" style={{position: 'relative'}}>*/}
            {/*    <img id="normal_cloud1" src={normal_cloud} style={{...normal_cloud_style, left: -520}}*/}
            {/*         alt="normal_cloud1"/>*/}
            {/*</div>*/}
            {/*<div id="moon-container" style={{position: 'relative'}}>*/}
            {/*    <img id="normal_cloud1" src={normal_cloud} style={{...normal_cloud_style, left: -455}}*/}
            {/*         alt="normal_cloud1"/>*/}
            {/*</div>*/}
            {/*<div id="moon-container" style={{position: 'relative'}}>*/}
            {/*    <img id="normal_cloud1" src={normal_cloud} style={{...normal_cloud_style, left: -390}}*/}
            {/*         alt="normal_cloud1"/>*/}
            {/*</div>*/}
            {/*    <div id="moon-container" style={{position: 'relative'}}>*/}
            {/*        <img id="normal_cloud1" src={normal_cloud} style={{...normal_cloud_style, left: -325}}*/}
            {/*             alt="normal_cloud1"/>*/}
            {/*    </div>*/}
            {/*    <div id="moon-container" style={{position: 'relative'}}>*/}
            {/*        <img id="normal_cloud1" src={normal_cloud} style={{...normal_cloud_style, left: -260}}*/}
            {/*             alt="normal_cloud1"/>*/}
            {/*    </div>*/}
            {/*    <div id="moon-container" style={{position: 'relative'}}>*/}
            {/*        <img id="normal_cloud1" src={normal_cloud} style={{...normal_cloud_style, left: -195}}*/}
            {/*             alt="normal_cloud1"/>*/}
            {/*    </div>*/}
            {/*    <div id="moon-container" style={{position: 'relative'}}>*/}
            {/*        <img id="normal_cloud1" src={normal_cloud} style={{...normal_cloud_style, left: -130}}*/}
            {/*             alt="normal_cloud1"/>*/}
            {/*    </div>*/}
            {/*</>*/}
        </>

    );
};

export default Scroll_down_moon;