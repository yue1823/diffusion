
import React, { useEffect } from 'react';
import {Col, Row} from "antd";
import {Content, Footer, Header } from 'antd/es/layout/layout';
import diffusion_art from '../art/diffusion.png';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import { motion } from 'framer-motion';
const  Tel_create_bet: React.FC = () => {

    useEffect(() => {
        console.log("enter tele create bet card")
    }, []);

    return (

            <>
                <div style={{
                    margin: 0,
                    padding: 0,
                    overflowX: "hidden",
                    overflowY: "hidden",
                }}>
                    <Header style={{backgroundColor:"#e1dcd6",height:"10vmax",padding:3}}>
                        <Row gutter={24} style={{display: "flex"}}>
                            <Col span={6}>
                                <img src={diffusion_art}
                                     alt={"diffusion logo"}
                                     style={{
                                         borderRadius: 20,
                                         position: "relative",
                                         textAlign: "center"
                                     }}/>
                            </Col>
                            <Col span={6}>
                                <h1 style={{fontSize:28,
                                    position:"relative",
                                    top:"10%",
                                    left:"-27%",
                                    textAlign: "center"
                                    }}>Diffusion</h1>
                            </Col>
                            <Col span={12}>
                                <div style={{
                                    position: "relative",
                                    top:"10%",
                                    left:"-5%",
                                }}>
                                    <WalletSelector />
                                </div>
                            </Col>
                        </Row>
                    </Header>
                    <Content style={{backgroundColor:"#6e78e4",height:"80vmax", }}>
                        <Row gutter={[24,24]} style={{padding:20}}>
                            <Col span={12}>
                                <motion.div
                                    className={"box"}
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.9}}
                                    transition={{type: "spring", stiffness: 400, damping: 25}}
                                >


                                </motion.div>
                            </Col>
                            <Col span={12}>
                                bb
                            </Col>
                        </Row>


                    </Content>
                    <Footer style={{backgroundColor: "#6ee4c1", height: "10vmax",}}></Footer>
                </div>
            </>

    );
};

export default Tel_create_bet;
