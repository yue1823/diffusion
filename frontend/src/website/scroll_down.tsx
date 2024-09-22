import React, { useEffect, useRef, useState } from 'react';
import god1 from"./website_image/god1.PNG"
import moon1 from "./website_image/moon1.PNG";
import moon2 from "./website_image/moon2.PNG";
import cloud1 from "./website_image/cloud1.png";
import cloud2 from "./website_image/雲2.png";
import cloud3 from "./website_image/雲3.png";
import cloud4 from "../website/website_image/雲4.png";
import cloud5 from "./website_image/雲5.png";
import cloud6 from "./website_image/雲6.png";
import god2 from "./website_image/god2.png";
import many_cloud1 from "./website_image/多雲.png";
import  Star  from './star';
// import tree1 from "./website_image/樹1.png";
import tree2 from "./website_image/樹2.png";
import tree3 from "./website_image/樹3.png";
import many_tree from "./website_image/樹木.png";
import APT_LABS_logo from "../art/aptos_labs_logo.jpeg";
import Mizu_wallet_logo from "../art/mizu wallet.jpeg";
import Nodit_logo from "../art/nodit_logo.jpeg";
import Last_tree_on_website from './last_tree_on_website';


const Scroll_down_moon: React.FC <{}> = ({}) => {
    const [total_position,set_total_position]=useState(0);
    const [textOpacity, setTextOpacity] = useState(0);
    const [text2Opacity, setText2Opacity] = useState(0);
    const [text3Opacity, setText3Opacity] = useState(0);
    const [text4Opacity, setText4Opacity] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [linePosition,set_line_Position]=useState(0);
    const [treePosition,set_tree_Position]=useState(0);
    const [topPosition, setTopPosition] = useState('10%');
    const [SecobdtopPosition, setSecondTopPosition] = useState('60%');
    const [wood_backgroung_opacity,set_wood_background_opacity]=useState(0.0);
    const [wood_logo ,set_wood_logo]=useState(0.0);
    const [diffusion_information_position,set_diffusion_information_position]=useState(0);
    const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void => {
        let timeout: NodeJS.Timeout | null;

        return (...args: Parameters<T>) => {
            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };
    const handleScroll = debounce(() => {

            const position = window.scrollY;
            // 只更新必要的状态
            //console.log('8500 position ',Math.max((8500 - position)*0.1 ,-70))
             console.log(position);
            set_total_position(position)

            if (position < 400) {
                setScrollPosition(-position * 0.5);
            } else if (position >= 400 && position < 1000) {
                setScrollPosition((position - 400));
            } else if (position >= 1000 && position <= 1950) {
                const newTopPosition = ((position - 1000) / 500) * 50;
                setTopPosition(`${Math.min(-newTopPosition, 40)}%`);
            }
            set_line_Position(position * 0.5);

            if (position > 7300 && position < 7500) {
                const opacity = Math.min((position - 7300) / 300, 1);
                set_diffusion_information_position(opacity);
            } else if (position > 7500 && position < 7900) {
                const opacity = Math.min((position + 7300) / 300, 1);
                set_diffusion_information_position(opacity);
            } else {
                set_diffusion_information_position(0);
            }

            if (position > 500 && position < 1000) {
                const opacity = Math.min((position - 700) / 300, 1);
                setTextOpacity(opacity);
            } else if (position > 1000 && position < 1500) {
                const opacity = Math.min((position + 700) / 300, 1);
                setTextOpacity(opacity);
            } else {
                setTextOpacity(0);
            }
            if (position > 2500 && position < 5000) {
                const opacity = Math.min((position - 2600) / 100, 1);
                setText2Opacity(opacity);

            }  else {
                setText2Opacity(0);
            }
            if (position > 3000 && position < 5000) {
                const opacity = Math.min((position - 3000) / 100,1);
                setText3Opacity(opacity);

            }  else {
                setText3Opacity(0);
            }
            if(position >= 3300){
                const newTopPosition = ((position - 3000) / 500) * 50;
                //console.log(`${Math.min(-newTopPosition)}%`)
                setSecondTopPosition(`${Math.min(-newTopPosition)}%`)
            }
        if (position > 4400 && position < 4700) {
            const opacity = Math.min((position - 4000) / 100, 1);
            setText4Opacity(opacity);
        }else if (position > 4700 && position < 5000) {
            const opacity = Math.min((position + 4000) / 100, 1);
            setText4Opacity(opacity);
        } else {
            setText4Opacity(0);
        }
        if (position > 5000) {
            set_tree_Position((position-5000) * 0.1);
        } else if (position >= 5100 && position < 7000) {
            set_tree_Position(((position-5000) * 0.1));
        } else( set_tree_Position(0));


        if (position >= 5200 && position <= 5850) {
            const opacityValue = Math.min((position - 5200) / (5850 - 5200), 0.9);
            set_wood_background_opacity(opacityValue);
        } else if (position < 5200) {
            set_wood_background_opacity(0); // 滾動小於起始值時設置透明度為 0
        } else if (position > 5850) {
            set_wood_background_opacity(0.9); // 滾動超過結束值時設置透明度為 0.9
        }
        if (position >= 5850 && position <= 6500) {
            const opacityValue = Math.min((position - 5850) / (6500 - 5850), 1);
            set_wood_logo(opacityValue);
        } else if (position < 5850) {
            set_wood_logo(0); // 滾動小於起始值時設置透明度為 0
        } else if (position >6500) {
            set_wood_logo(1); // 滾動超過結束值時設置透明度為 0.9
        }
    },1);

    useEffect(() => {
        const handleScrollThrottled = () => {
            requestAnimationFrame(handleScroll);
        };
        window.addEventListener('scroll', handleScrollThrottled);
        return () => {
            window.removeEventListener('scroll', handleScrollThrottled);
        };
    }, []);
    const many_cloud1_style = {
        position: 'fixed' as 'fixed',
        right: `${-1580 + scrollPosition * 0.1}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `${topPosition}`,
        transform: `translateX(${Math.min(-823+scrollPosition*1.28,1000)}px)  translateY(440px)`,
        transition: 'transform 0.3s ease-out',
        zIndex:11,
        // display: 'flex',
        width:"54vmax",
        height:600,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    }
    const many_cloud2_style = {
        position: 'fixed' as 'fixed',
        right: `${1880 - scrollPosition * 0.1}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `${topPosition}`,
        transform: `translateX(${Math.min(1510-scrollPosition*1.28)}px)  translateY(440px) scaleX(-1)`,
        transition: 'transform 0.3s ease-out',
        zIndex:11,
        // display: 'flex',
        width:"54vmax",

        height:600,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    }
    const many_cloud3_style = {
        position: 'fixed' as 'fixed',
        right: `${1880 - scrollPosition * 0.1}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: linePosition <=1700 ? `${topPosition}`: `${SecobdtopPosition} `,
        transform: linePosition <=1700 ? `translateX(${Math.min(-1167+scrollPosition*1.1)}px)  translateY(980px) rotate(90deg)`:`translateX(${Math.min(-1170+scrollPosition*1.1)}px)  translateY(420px) rotate(90deg)`,

        zIndex:10,
        // display: 'flex',
        width:"72vmax",

        height:600,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    }
    const many_cloud4_style = {
        position: 'fixed' as 'fixed',
        right: `${1880 - scrollPosition * 0.1}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: linePosition <=1700 ? `${topPosition}`: `${SecobdtopPosition}`,
        transform: linePosition <=1700 ?`translateX(${Math.min(1589-scrollPosition*1.1)}px)  translateY(980px) rotate(270deg)`:`translateX(${Math.min(1589-scrollPosition*1.1)}px)  translateY(420px) rotate(270deg)`,

        zIndex:10,
        // display: 'flex',
        width:"72vmax",

        height:600,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    }
    const many_cloud5_style = {
        position: 'fixed' as 'fixed',
        right: `50%`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `${SecobdtopPosition}`,
        transform: `translateX(${Math.min(230-scrollPosition*1.1)}px)  translateY(930px) rotate(0deg)`,
        transition: 'transform 0.3s ease-out',
        zIndex:10,
        // display: 'flex',
        width:"85vmax",
        height:600,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    }
    const many_cloud6_style = {
        position: 'fixed' as 'fixed',
        right: `50%`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `${SecobdtopPosition}`,
        transform: `translateX(${-Math.min(-78-scrollPosition*1.1)}px)  translateY(930px) rotate(0deg)`,
        transition: 'transform 0.3s ease-out',
        zIndex:10,
        // display: 'flex',
        width:"60vmax",
        height:600,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    }
    const fishinglink = {
        position: 'fixed' as 'fixed',
        top: linePosition <=1700 ?`${topPosition}`:`${SecobdtopPosition}`,
        width: '3px',
        zIndex:10,
        right:`${(983 + scrollPosition * 0.1+415)}px`,
        height: scrollPosition >= 500
            ? `${Math.min(linePosition-500 ,1080)}px`
            : '0px',
        transform: linePosition <=1700 ?`translateY(345px) translateX(${Math.min(scrollPosition, 365)}px)`:`translateY(-100px) translateX(${Math.min(scrollPosition, 365)}px)`,
        backgroundColor: '#bfbfbf',
        borderColorder:'white',
        transition: 'height 0.3s ease-out',
        borderRadius:5,
        
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
        transition: 'transform 0.3s ease-out',
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
        transition: 'transform 0.3s ease-out',
        zIndex:6,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

        left:-800
    };
    const cloud1style = {
        position: 'fixed' as 'fixed',
        right: `${Math.min(-425 + scrollPosition * 0.68)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 2.2% )`,
        transition: 'transform 0.3s ease-out',
        zIndex:5,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const cloud2style = {
        position: 'fixed' as 'fixed',
        right: `${1205 - scrollPosition * 0.68}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + -37% )`,
        transform: `translateX(${Math.min(scrollPosition, 390)}px)`,
        transition: 'transform 0.3s ease-out',
        zIndex:4,
        width:"100vmax",
        height:"100vmax",
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    const cloud3style = {
        position: 'fixed' as 'fixed',
        right: `${Math.min(-400 + scrollPosition * 0.63)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 3.5% )`,
        transition: 'transform 0.3s ease-out',
        zIndex:3,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    const cloud4style = {
        position: 'fixed' as 'fixed',
        right: `${Math.min(-400 + scrollPosition * 0.55)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 18% )`,
        transform: `rotate(-22deg)`,
        transition: 'transform 0.3s ease-out',
        zIndex:6,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    const cloud5style = {
        position: 'fixed' as 'fixed',
        right: `${Math.min(-400 + scrollPosition * 0.67)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 3.0% )`,
        transition: 'transform 0.3s ease-out',
        zIndex:8,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    const cloud6style = {
        position: 'fixed' as 'fixed',
        right: `${Math.min(-400 + scrollPosition * 0.67)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 2.2% )`,
        transition: 'transform 0.3s ease-out',
        zIndex:9,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    const god2style = {
        position: 'fixed' as 'fixed',
        right: `${Math.min(-400 + scrollPosition * 0.66)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 3.5% )`,
        transition: 'transform 0.3s ease-out',
        zIndex:7,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    const tree1style = {
        position:  'fixed' as 'fixed',
         // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`39.5%`,
        transform:total_position <= 6500 ? ` rotate(4deg) translateX(${Math.min(-1050 + treePosition *6, -615)}px) `:`rotate(4deg) translateX(${Math.min(-1050 + treePosition *6, -615)}px) translateY(-${(total_position -6500 )*1}px)`,
        zIndex:5,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const tree2style = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`-11%`,
        transform:total_position <= 6500 ? ` rotate(4deg) translateX(${Math.min(-1050 + treePosition *6, -555)}px) `:` rotate(4deg) translateX(${Math.min(-1050 + treePosition *6, -555)}px) translateY(-${(total_position -6500 )*1}px)`,
        zIndex:5,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const tree4style = {
        position: 'fixed' as 'fixed',
        top: `-8%`,
        transition: ' transform 0.2s ease-out ',
        transform:total_position <= 6500 ?`rotate(-4deg) scaleX(-1) translateX(${Math.min(-1500 + treePosition *6, -1030)}px)`:`rotate(-4deg) scaleX(-1) translateX(${Math.min(-1500 + treePosition *6, -1030)}px) translateY(-${(total_position -6500 )*1}px)`,
        zIndex:5,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    const tree5style = {
        position: 'fixed' as 'fixed',
        top: `42.5%`,
        transition: ' transform 0.2s ease-out ',
        transform:total_position <= 6500 ?`rotate(-4deg) scaleX(-1) translateX(${Math.min(-1500 + treePosition *6, -1150)}px)`:`rotate(-4deg) scaleX(-1) translateX(${Math.min(-1500 + treePosition *6, -1150)}px) translateY(-${(total_position -6500 )*1}px)`,
        zIndex:5,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',

    };
    const tree3style = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`-18.5%`,
        transform:total_position <= 6500 ?` rotate(5deg) translateX(${Math.min(-800 + treePosition *6, -380)}px) `:` rotate(5deg) translateX(${Math.min(-800 + treePosition *6, -380)}px) translateY(-${(total_position -6500 )*1}px)`,
        zIndex:4,
        width:800,
        height:800,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const tree6style = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`-15%`,
        transform:total_position <= 6500 ?` scaleX(-1) translateX(${Math.min(-1500 + treePosition *6, -1090)}px) `:` scaleX(-1) translateX(${Math.min(-1500 + treePosition *6, -1090)}px) translateY(-${(total_position -6500 )*1}px) `,
        zIndex:4,
        width:800,
        height:800,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const manytree1style = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`-20%`,
        transform:total_position <= 6500 ?` rotate(-2deg) translateX(${Math.min(-1060 + treePosition *15, 250)}px) `:` rotate(-2deg) translateX(${Math.min(-1060 + treePosition *15, 250)}px) translateY(-${(total_position -6500 )*1}px) `,
        zIndex:2,
        width:"70vmax",
        height:800,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const manytree2style = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`28.5%`,
        transform:total_position <= 6500 ?` rotate(-2deg) translateX(${Math.min(-1060 + treePosition *15, 200)}px) `:` rotate(-2deg) translateX(${Math.min(-1060 + treePosition *15, 200)}px) translateY(-${(total_position -6500 )*1}px) `,
        zIndex:2,
        width:"70vmax",
        height:800,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const woodbackgroundstyle = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`14%`,
        left:"0%",
        transform:total_position <= 6500 ?` `:`translateY(-${(total_position -6500 )*1}px)`,
        zIndex:1,
        width:"100%",
        height:"50%",
        opacity:wood_backgroung_opacity
        // filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const partner_logo1style = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
         transition: 'transform 0.2s ease-out ',
        top:`25%`,
        left:"14%",
        transform:total_position <= 6500 ?` `:`translateY(-${(total_position -6500 )*1}px)`,
        zIndex:2,
        width:"23%",
        height:"23%",
        opacity:wood_logo
        // filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const partner_logo2style = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`25%`,
        left:"39.5%",
        transform:total_position <= 6500 ?` `:`translateY(-${(total_position -6500 )*1}px)`,
        zIndex:2,
        width:"23%",
        height:"23%",
        opacity:wood_logo
        // filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const partner_logo3style = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
             transition: 'transform 0.2s ease-out ',
            top:`25%`,
            left:"65%",
            transform:total_position <= 6500 ?` `:`translateY(-${(total_position -6500 )*1}px)`,
            zIndex:2,
            width:"23%",
            height:"23%",
            opacity:wood_logo
            // filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
        };
        return (
            <>
            {total_position <= 8500 && <>


                <div id="god-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={god1} style={godStyle} alt="god1"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={moon1} style={moon1Style} alt="Moon1"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={moon2} style={moon2Style} alt="Moon2"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={cloud1} style={cloud1style} alt="cloud1"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={cloud2} style={cloud2style} alt="cloud2"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={cloud3} style={cloud3style} alt="cloud3"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={cloud4} style={cloud4style} alt="cloud4"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={cloud5} style={cloud5style} alt="cloud5"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={cloud6} style={cloud6style} alt="cloud6"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={god2} style={god2style} alt="god2"/>
                </div>

                {scrollPosition <= 590 ? <></> : <>
                    <div style={fishinglink}></div>
                </>}
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={many_cloud1} style={{...many_cloud1_style, left: -1}}
                                   alt="many_cloud1"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={many_cloud1} style={{...many_cloud2_style, left: -1}}
                                   alt="many_cloud2"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={many_cloud1} style={{...many_cloud3_style, left: -1}}
                                   alt="many_cloud3"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={many_cloud1} style={{...many_cloud4_style, left: -1}}
                                   alt="many_cloud4"/>
                </div>
                <div style={{position: 'relative'}}>
                    <p style={{

                        opacity: textOpacity,
                        transition: 'opacity 0.5s ease-in-out', // 使透明度变化更平滑
                        position: 'fixed', // 让文字固定在某个位置
                        top: '50%', // 调整为合适的位置
                        left: '50%',
                        zIndex: 27,
                        transform: 'translate(-50%, -50%)',
                        fontSize: '24px',
                        color: 'white',
                    }}>
                        Diffusion Roadmap
                    </p>
                </div>
                {scrollPosition >= 590 ? < >
                    <Star position1={2200} position2={4500} position3={3400} position4={'50%'}
                          text={" XueDao  hackthon champion       2024.07.20"} secondtop={SecobdtopPosition}
                          line_position={linePosition}/>

                </> : <></>}
                {linePosition >= 1150 ?
                    <div style={{
                        width: '50px',      // 设置线条的宽度
                        height: '5px',       // 设置线条的高度
                        borderStyle: 'solid', // 设置线条样式
                        borderWidth: '0 0 1px 0', // 指定下边框的宽度
                        borderColor: '#f1eff6', // 设置线条颜色
                        backgroundColor: "white",
                        zIndex: 28,          // 控制线条的z-index
                        position: 'fixed',
                        top: linePosition <= 1700 ? '13%' : `calc(12% + 45.7%)`, // 调整为合适的位置
                        transform: linePosition <= 1700 ? 'translate(850%,1950%)' : `translateX(850%) translateY(calc(${SecobdtopPosition} * 140))`,
                    }}></div>
                    : <></>}
                {linePosition >= 1300 ? <>
                    <p style={{

                        opacity: text2Opacity,
                        transition: 'opacity 0.5s ease-in-out', // 使透明度变化更平滑
                        position: 'fixed', // 让文字固定在某个位置
                        top: linePosition <= 1700 ? '50%' : `calc(50% + 36.7%)`, // 调整为合适的位置
                        left: '58%',
                        zIndex: 27,
                        transform: linePosition <= 1700 ? 'translate(-50%, -50%)' : `translateY(calc(${SecobdtopPosition} * 18)) translateX(-50%)`,
                        fontSize: '30px',
                        color: '#7B7B7B',
                    }}>
                        Aptos code Collision 2024.10.30
                    </p>
                </> : <></>}
                {linePosition >= 1400 ? <>

                    <p style={{

                        opacity: text3Opacity,
                        transition: 'opacity 0.5s ease-in-out', // 使透明度变化更平滑
                        position: 'fixed', // 让文字固定在某个位置
                        top: linePosition <= 1700 ? '75%' : `calc(75% + 36.7%)`, // 调整为合适的位置
                        left: '57%',
                        zIndex: 27,
                        transform: linePosition <= 1700 ? `translateY(-50%) translateX(-50%)` : `translateY(calc(${SecobdtopPosition} * 18)) translateX(-50%)`,
                        fontSize: '30px',
                        color: '#7B7B7B',
                    }}>
                        Lanuch on Mainnet Q1/2025
                    </p>
                </> : <></>}
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={many_cloud1} style={{...many_cloud5_style, left: -1}}
                                   alt="many_cloud5"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={many_cloud1} style={{...many_cloud6_style, left: -1}}
                                   alt="many_cloud5"/>
                </div>
                <div style={{position: 'relative'}}>
                    <p style={{

                        opacity: text4Opacity,
                        transition: 'opacity 0.5s ease-in-out', // 使透明度变化更平滑
                        position: 'fixed', // 让文字固定在某个位置
                        top: '50%', // 调整为合适的位置
                        left: '50%',
                        zIndex: 27,
                        transform: 'translate(-50%, -50%)',
                        fontSize: '24px',
                        color: 'white',
                    }}>
                        Diffusion Partner
                    </p>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={tree2} style={{...tree1style}} alt="tree1"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={tree2} style={{...tree2style}} alt="tree2"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={tree3} style={{...tree3style}} alt="tree3"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={tree2} style={{...tree4style}} alt="tree4"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={tree2} style={{...tree5style}} alt="tree5"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={tree3} style={{...tree6style}} alt="tree3"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={many_tree} style={{...manytree1style}} alt="manytree1"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage src={many_tree} style={{...manytree2style}} alt="manytree2"/>
                </div>

                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage
                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSHg8XWSDgcK5KCNsqEIQRRE7zQ7t4IUFs-A&s"}
                        style={{...woodbackgroundstyle}} alt="wood,backgroung"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage
                        src={APT_LABS_logo}
                        style={{...partner_logo1style}} alt="partner logo 1"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage
                        src={Mizu_wallet_logo}
                        style={{...partner_logo2style}} alt="partner logo 2"/>
                </div>
                <div id="moon-container" style={{position: 'relative'}}>
                    <LazyLoadImage
                        src={Nodit_logo}
                        style={{...partner_logo3style}} alt="partner logo 3"/>
                </div>
                <div style={{position: 'relative'}}>
                    <p style={{

                        opacity: diffusion_information_position,
                        transition: 'opacity 0.5s ease-in-out', // 使透明度变化更平滑
                        position: 'fixed', // 让文字固定在某个位置
                        top: '50%', // 调整为合适的位置
                        left: '50%',
                        zIndex: 27,
                        transform: 'translate(-50%, -50%)',
                        fontSize: '24px',
                        color: 'white',
                    }}>
                        Diffusion Information
                    </p>
                </div>
            </>}
            <Last_tree_on_website scrollPosition={total_position}/>

        </>

    );
};

export default Scroll_down_moon;

const LazyLoadImage = ({src, alt, style}: { src: string; alt: string; style: React.CSSProperties }) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect(); // 加载完毕后断开观察
                    }
                });
            },
            { threshold: 0.1 } // 当图片可见性达到 10% 时加载
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    return (
        <img ref={imgRef} src={isVisible ? src : "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="} alt={alt} style={style} />
    );
};