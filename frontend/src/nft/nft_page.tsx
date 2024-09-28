
import {Col, Row, theme} from "antd";
import React, { useEffect } from 'react';
import { Carousel,Image } from "antd";
import {Content} from "antd/lib/layout/layout";
import { motion } from "framer-motion";


const contentStyle: React.CSSProperties = {
    height: '580px',
    color: '#fff',
    lineHeight: '300px',
    textAlign: 'center',
    background: '#dfdfdf',
    borderRadius:5
};

interface Badges{
    name : string;
    url : string;
}

const NFT_page:React.FC<{ badges_vector:Badges[]}> = ({badges_vector }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const text_style = {
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '2px 4px 6px rgba(0, 0, 0, 0.3)', // 陰影效果
        transform: 'translateY(-2px)', // 上升一點點的效果
        transition: 'transform 0.2s ease', // 增加平滑過渡效果
    };

    const change_page = (key:string) =>{
        if(key  == "My Badges"){

        }else if(key == "Mint"){

        }
    }

    useEffect(() => {
        console.log(badges_vector.length)
    }, [badges_vector]);

    return (
        <>
            <Content style={{padding: '15px ',paddingLeft:"3.5%"}}>
                <Row >
                    <Col span={21}>
                    <div
                        style={{

                            minHeight: 580,

                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Row gutter={[24,12]} style={{padding:"1%"}}>
                            <Col span={24} style={{paddingLeft:"2%"}}>
                                <p>Badges</p>
                                <div style={{border:"solid 1px",borderColor:"#dfdfdf",width:"98%"}}></div>
                            </Col>
                            <Col span={6} style={{paddingLeft:"3%"}}>
                                <Row gutter={[24,24]} style={{backgroundColor:"#dfdfdf",borderRadius:5,width:"100%",height :580,paddingTop:"5%"}}>
                                    <Col span={24} >
                                        <p style={{...text_style}}>My Badges</p>
                                        <div style={{border: "solid 1px", borderColor: "#ededed", width: "98%"}}></div>
                                    </Col>
                                    <Col span={24}>
                                        <motion.div
                                            animate={{x: [null, 100, 0], y: [null, 100, 0]}}
                                            whileHover={{scale: [null, 1.1, 1.1], zIndex: 1000, position: 'relative'}}
                                            transition={{duration: 0.3}}
                                        >
                                            <motion.div className={"box"}
                                                        whileHover={{scale: 1.03}}
                                                        whileTap={{scale: 0.95}}
                                                        transition={{type: "spring", stiffness: 400, damping: 25}}
                                                        onClick={() => change_page("My Badges")}
                                            >
                                                <p style={{...text_style}}>My Badges</p>
                                            </motion.div>
                                        </motion.div>
                                    </Col>
                                    <Col span={24}>
                                        <motion.div
                                            animate={{x: [null, 100, 0], y: [null, 100, 0]}}
                                            whileHover={{scale: [null, 1.1, 1.1], zIndex: 1000, position: 'relative'}}
                                            transition={{duration: 0.3}}
                                        >
                                            <motion.div className={"box"}
                                                        whileHover={{scale: 1.03}}
                                                        whileTap={{scale: 0.95}}
                                                        transition={{type: "spring", stiffness: 400, damping: 25}}
                                                        onClick={() => change_page("Mint")}
                                            >
                                                <p style={{...text_style}}>Mint</p>
                                            </motion.div>
                                        </motion.div>
                                    </Col>
                                </Row>


                            </Col>
                            <Col span={18} style={{height: 580, paddingRight: "3%"}}>
                                <Carousel autoplay style={{height: 580}} draggable={true}>
                                <div>
                                        {badges_vector.length != 0 &&
                                            <h3 style={contentStyle}>
                                                <Image
                                                    fallback="data:image/png;base64,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"
                                                    src={badges_vector[0].url}></Image>
                                            </h3>
                                        }
                                    </div>
                                </Carousel>
                            </Col>
                        </Row>

                    </div>
                    </Col>
                </Row>
            </Content>
        </>
    );
}

export default NFT_page;