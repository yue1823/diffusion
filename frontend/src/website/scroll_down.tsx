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
const Scroll_down_moon: React.FC <{}> = ({}) => {

    const [textOpacity, setTextOpacity] = useState(0);
    const [text2Opacity, setText2Opacity] = useState(0);
    const [text3Opacity, setText3Opacity] = useState(0);
    const [text4Opacity, setText4Opacity] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [linePosition,set_line_Position]=useState(0);
    const [treePosition,set_tree_Position]=useState(0);
    const [topPosition, setTopPosition] = useState('10%');
    const [SecobdtopPosition, setSecondTopPosition] = useState('60%');
    const handleScroll = () => {

            const position = window.scrollY;
            // 只更新必要的状态

            console.log(position);

            if (position < 400) {
                setScrollPosition(-position * 0.5);
            } else if (position >= 400 && position < 1000) {
                setScrollPosition((position - 400));
            } else if (position >= 1000 && position <= 1950) {
                const newTopPosition = ((position - 1000) / 500) * 50;
                setTopPosition(`${Math.min(-newTopPosition, 40)}%`);
            }
            set_line_Position(position * 0.5);

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
                console.log(`${Math.min(-newTopPosition)}%`)
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
    };

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
        top: linePosition <=1700 ? `${topPosition}`: `${SecobdtopPosition} `,
        transform: linePosition <=1700 ? `translateX(${Math.min(-1118+scrollPosition*1.1)}px)  translateY(930px) rotate(90deg)`:`translateX(${Math.min(-1118+scrollPosition*1.1)}px)  translateY(440px) rotate(90deg)`,

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
        transform: linePosition <=1700 ?`translateX(${Math.min(1503-scrollPosition*1.1)}px)  translateY(930px) rotate(270deg)`:`translateX(${Math.min(1503-scrollPosition*1.1)}px)  translateY(440px) rotate(270deg)`,

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
        right:`${(823 + scrollPosition * 0.1+415)}px`,
        height: scrollPosition >= 500
            ? `${Math.min(linePosition-500 ,1080)}px`
            : '0px',
        transform: linePosition <=1700 ?`translateY(348px) translateX(${Math.min(scrollPosition, 365)}px)`:`translateY(-100px) translateX(${Math.min(scrollPosition, 365)}px)`,
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
        right: `${Math.min(-425 + scrollPosition * 0.68)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 2.2% )`,
        transition: 'transform 0.2s ease-out',
        zIndex:5,
        width:1000,
        height:1000,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const cloud2style = {
        position: 'fixed' as 'fixed',
        right: `${1165 - scrollPosition * 0.68}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + -27% )`,
        transform: `translateX(${Math.min(scrollPosition, 390)}px)`,
        transition: 'transform 0.2s ease-out',
        zIndex:7,
        width:"100vmax",
        height:"100vmax",
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
        right: `${Math.min(-400 + scrollPosition * 0.55)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 18% )`,
        transform: `rotate(-22deg)`,
        transition: 'transform 0.2s ease-out',
        zIndex:6,
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
    const cloud6style = {
        position: 'fixed' as 'fixed',
        right: `${Math.min(-400 + scrollPosition * 0.67)}px`, // 控制月亮的水平位置，隨著滾動向右移動
        top: `calc(${topPosition} + 2.2% )`,
        transition: 'transform 0.2s ease-out',
        zIndex:9,
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
    const tree1style = {
        position:  'fixed' as 'fixed',
         // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`49.5%`,
        transform:` rotate(4deg) translateX(${Math.min(-800 + treePosition *6, -315)}px) `,
        zIndex:5,
        width:700,
        height:700,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const tree2style = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`-2.5%`,
        transform:` rotate(4deg) translateX(${Math.min(-800 + treePosition *6, -315)}px) `,
        zIndex:5,
        width:700,
        height:700,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const tree3style = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`-3.5%`,
        transform:` rotate(1deg) translateX(${Math.min(-800 + treePosition *6, -310)}px) `,
        zIndex:4,
        width:700,
        height:700,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const manytree1style = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`-16.5%`,
        transform:` rotate(-2deg) translateX(${Math.min(-800 + treePosition *10, 150)}px) `,
        zIndex:2,
        width:700,
        height:700,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    const manytree2style = {
        position:  'fixed' as 'fixed',
        // 控制月亮的水平位置，隨著滾動向右移動
        transition: 'transform 0.2s ease-out ',
        top:`30.5%`,
        transform:` rotate(-2deg) translateX(${Math.min(-960 + treePosition *15, 120)}px) `,
        zIndex:4,
        width:"70vmax",
        height:800,
        filter: 'drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))',
    };
    return (
        <>
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
                <LazyLoadImage src={many_tree} style={{...manytree1style}} alt="manytree1"/>
            </div>
            <div id="moon-container" style={{position: 'relative'}}>
                <LazyLoadImage src={many_tree} style={{...manytree2style}} alt="manytree2"/>
            </div>
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
        <img ref={imgRef} src={isVisible ? src : undefined} alt={alt} style={style} />
    );
};