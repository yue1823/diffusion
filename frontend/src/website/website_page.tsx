import {Col, Image, Row} from "antd";
import React, { useEffect,  useState }  from "react";
import anime from 'animejs';
import Logo_1 from "../art/diffusion_black.png";
import Logo_2 from "../art/diffusion_fix.png";
import "../css_/website_sky_css.css";
import "../css_/firefly_button.css";

import KinetComponent from "./firefly";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import Scroll_down_moon from "./scroll_down";
interface StarrySkyState {
    num: number;
    vw: number;
    vh: number;
}

class StarrySky extends React.Component<{}, StarrySkyState> {
    state: StarrySkyState = {
        num: 60,
        vw: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        vh: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    };

    starryNight = () => {
        anime({
            targets: ["#sky .star"],
            opacity: [
                {
                    duration: 700,
                    value: "0"
                },
                {
                    duration: 700,
                    value: "1"
                }
            ],
            easing: "linear",
            loop: true,
            delay: (_el: any, i: number) => 50 * i
        });
    };

    shootingStars = () => {
        anime({
            targets: ["#shootingstars .wish"],
            easing: "linear",
            loop: true,
            delay: (_el: any, i: number) => 2000 * i,
            opacity: [
                {
                    duration: 700,
                    value: "1"
                }
            ],
            width: [
                {
                    value: "150px"
                },
                {
                    value: "0px"
                }
            ],
            translateX: 350
        });
    };

    randomRadius = (): number => {
        return Math.random() * 0.7 + 0.6;
    };

    getRandomX = (): string => {
        return Math.floor(Math.random() * Math.floor(this.state.vw)).toString();
    };

    getRandomY = (): string => {
        return Math.floor(Math.random() * Math.floor(this.state.vh)).toString();
    };

    componentDidMount() {
        this.starryNight();
        this.shootingStars();
    }

    render() {
        const { num } = this.state;
        return (

            <div >


                <Row>
                    <Col span={24}>
                        <svg id="sky">
                            {[...Array(num)].map((_, y) => (
                                <circle
                                    cx={this.getRandomX()}
                                    cy={this.getRandomY()}
                                    r={this.randomRadius()}
                                    stroke="none"
                                    strokeWidth="0"
                                    fill="white"
                                    key={y}
                                    className="star"
                                />
                            ))}


                        </svg>
                        <div id="shootingstars">
                            {[...Array(60)].map((_, y) => (
                                <div
                                    key={y}
                                    className="wish"
                                    style={{
                                        left: `${this.getRandomY()}px`,
                                        top: `${this.getRandomX()}px`,
                                    }}
                                />
                            ))}
                        </div>
                    </Col>

                </Row>
            </div>
        );
    }
}

const Website_page: React.FC = () => {
    const text = "Our Goal \n\nBring something fresh to the Aptos community \n\n\nWhat's Aptos need , we build it            -            Diffusion";
    const [letters, setLetters] = useState<string[]>([]);

    const anime_play = () => {
        let a =text.split('')
        setLetters(a); // 更新 letters 状态
    }
    useEffect(() => {
        // 这个 useEffect 只会在 letters 更新后运行
        anime.timeline({ loop: false })
            .add({
                targets: '.letter',
                opacity: [0, 1],
                easing: "easeInOutQuad",
                duration: 2250,
                delay: (_el, i) => 80 * (i + 1)
            }).add({
            targets: '.letter',
            opacity: 1,  // 确保最终状态的透明度为1
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000
        });
    }, [letters]);
    useEffect(() => {
        anime_play()

        const handleScroll = () => {
            requestAnimationFrame(() => {
                // 处理滚动动画的代码
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const formatText = (text: string) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line.split('').map((char, i) => (
                    <span
                        key={i}
                        className="letter"
                        style={{
                            color: "white",
                            zIndex: 10,
                            display: 'inline-block',
                            opacity: 0, // 初始透明度
                            transition: 'opacity 0.5s ease-in-out',
                            fontSize: 25
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char} {/* 处理空格 */}
                    </span>
                ))}
                <br /> {/* 添加换行 */}
            </React.Fragment>
        ));
    };
    return (

        <Row gutter={{xs: 16, sm: 24, md: 32, lg: 40}} style={{height:9000}}>
            <Col span={24} >

                {/*<div id="circle" className="circle bg-yellow-500"></div>*/}
                <div style={{position: 'absolute',
                    top:160,
                    left:200,
                    width:700,
                }}>
                    {formatText(text)}
                </div>
                <StarrySky/>

                <Col span={8} offset={16}>
                    <Swiper
                        pagination={{
                            dynamicBullets: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                        style={{
                            left: 900,
                            width: 450,
                            height: 350,
                            top: 150,
                            borderRadius: 20,
                            position: "absolute",
                            transform:`translateX(-25%)`
                    }}
                    >
                        <SwiperSlide><Image src={Logo_1} style={{position: "relative", top: -10}}></Image></SwiperSlide>
                        <SwiperSlide><Image src={Logo_2} style={{position: "relative", top: -40}}></Image></SwiperSlide>
                    </Swiper>
                    {/*<KinetComponent/>*/}
                </Col>
                <Scroll_down_moon/>
                <Row style={{height: 1000, position: 'absolute', zIndex: 2 ,top:"0%"}}>
                    <Col span={16} offset={16}>
                        {/*<a className={"button-wrapper"} >*/}
                        {/*    <div style={{position: "absolute", top: 130,left:400}}>*/}
                        {/*        <span className="dot dot-1"></span>*/}
                        {/*        <span className="dot dot-2"></span>*/}
                        {/*        <span className="dot dot-3"></span>*/}
                        {/*    </div>*/}

                        {/*    <span className="dot dot-4"></span>*/}
                        {/*    <span className="dot dot-5"></span>*/}
                        {/*    <span className="dot dot-6"></span>*/}
                        {/*    <span className="dot dot-7"></span>*/}
                        {/*    <span className={"card_slid"}>*/}

                        {/*        </span>*/}
                        {/*</a>*/}
                    </Col>
                    <Col span={24} >
                        aa
                    </Col>
                </Row>
                <Row style={{ height: 3000, position: 'relative', top: 100, left:100, width: '100%', zIndex: 2 }}>
                    <Col span={24}>
                        <p>a</p>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default Website_page;
// const AnimatedText: React.FC = () => {
//     const [letters, setLetters] = useState<string[]>([]);
//     const animationRef = useRef<boolean>(false); // 用于标记动画是否已经运行过
//
//     useEffect(() => {
//
//
//             const text = "Your Text Here";
//             setLetters(text.split(''));
//
//             anime.timeline({ loop: false })
//                 .add({
//                     targets: '.letter',
//                     opacity: [0, 1],
//                     easing: "easeInOutQuad",
//                     duration: 2250,
//                     delay: (_el, i) => 150 * (i + 1)
//                 }).add({
//                 targets: '.letter',
//                 opacity: 1,  // 确保最终状态的透明度为1
//                 duration: 1000,
//                 easing: "easeOutExpo",
//                 delay: 1000
//             });
//
//             animationRef.current = true; // 标记动画已经运行
//
//     }, []);
//
//     return (
//         <div style={{position: 'relative'}}>
//             {letters.map((letter, index) => (
//                 <span
//                     key={index}
//                     className="letter"
//                     style={{
//                         color: "white",
//                         zIndex: 10,
//                         display: 'inline-block',
//                         opacity: 0, // 初始透明度
//                         transition: 'opacity 0.5s ease-in-out',
//                     }}
//                 >
//                     {letter === ' ' ? '\u00A0' : letter} {/* 处理空格 */}
//                 </span>
//             ))}
//         </div>
//     );
// };
