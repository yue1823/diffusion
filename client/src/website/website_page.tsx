import {Col, Image, Row} from "antd";
import React from "react";
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
            delay: (el: any, i: number) => 50 * i
        });
    };

    shootingStars = () => {
        anime({
            targets: ["#shootingstars .wish"],
            easing: "linear",
            loop: true,
            delay: (el: any, i: number) => 2000 * i,
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

                <svg id="sky" >
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
                <KinetComponent/>

            </div>
        );
    }
}

const Website_page: React.FC = () => {
    return (
        <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
            <Col span={24}>

                {/*<div id="circle" className="circle bg-yellow-500"></div>*/}
                <StarrySky/>

                <Row style={{ height: 1000, position: 'absolute', top: 100, left:100, width: '100%', zIndex: 2 }}>
                    <Col span={24}>
                        <Swiper
                            pagination={{
                                dynamicBullets: true,
                            }}
                            modules={[Pagination]}
                            className="mySwiper"
                            style={{position:"absolute",left:1000,width:450,height:350,top:150}}
                        >
                            <SwiperSlide><Image src={Logo_1} style={{position:"relative",top:-10}}></Image></SwiperSlide>
                            <SwiperSlide><Image src={Logo_2} style={{position:"relative",top:-40}}></Image></SwiperSlide>

                        </Swiper>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default Website_page;
// import {Col, Row, theme} from "antd";
// import React, {useEffect, useState} from 'react';
// const anime = require('animejs');
// import {Content} from "antd/lib/layout/layout";
// interface StarrySkyState {
//     num: number;
//     vw: number;
//     vh: number;
// }
//
// class StarrySky extends React.Component<{}, StarrySkyState> {
//     state : StarrySkyState = {
//         num: 60,
//         vw: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
//         vh: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
//     };
//     starryNight = () => {
//         anime({
//             targets: ["#sky .star"],
//             opacity: [
//                 {
//                     duration: 700,
//                     value: "0"
//                 },
//                 {
//                     duration: 700,
//                     value: "1"
//                 }
//             ],
//             easing: "linear",
//             loop: true,
//             delay: (el: any, i: number) => 50 * i
//         });
//     };
//     shootingStars = () => {
//         anime({
//             targets: ["#shootingstars .wish"],
//             easing: "linear",
//             loop: true,
//             delay: (el: any, i: number) => 2000 * i,
//             opacity: [
//                 {
//                     duration: 700,
//                     value: "1"
//                 }
//             ],
//             width: [
//                 {
//                     value: "150px"
//                 },
//                 {
//                     value: "0px"
//                 }
//             ],
//             translateX: 350
//         });
//     };
//     randomRadius = () => {
//         return Math.random() * 0.7 + 0.6;
//     };
//     getRandomX = () => {
//         return Math.floor(Math.random() * Math.floor(this.state.vw)).toString();
//     };
//     getRandomY = () => {
//         return Math.floor(Math.random() * Math.floor(this.state.vh)).toString();
//     };
//
//     componentDidMount() {
//         this.starryNight();
//         this.shootingStars();
//     }
// }
// const Website_page:React.FC<{ }> = ({ }) => {
//     const { num } = this.state;
//     return (
//         <>
//             <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
//                 <Col span={24} >
//                     <svg id="sky">
//                         {[...Array(num)].map((_, y) => (
//                             <circle
//                                 cx={this.getRandomX()}
//                                 cy={this.getRandomY()}
//                                 r={this.randomRadius()}
//                                 stroke="none"
//                                 strokeWidth="0"
//                                 fill="white"
//                                 key={y}
//                                 className="star"
//                             />
//                         ))}
//                     </svg>
//                     <div id="shootingstars">
//                         {[...Array(60)].map((_, y) => (
//                             <div
//                                 key={y}
//                                 className="wish"
//                                 style={{
//                                     left: `${this.getRandomY()}px`,
//                                     top: `${this.getRandomX()}px`,
//                                 }}
//                             />
//                         ))}
//                     </div>
//                 </Col>
//             </Row>
//         </>
//     );
// };
// export default Website_page
//
