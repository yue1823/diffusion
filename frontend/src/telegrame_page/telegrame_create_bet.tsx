
import React, { useEffect } from 'react';
import {Col, Row} from "antd";
import {Content, Footer, Header } from 'antd/es/layout/layout';
import diffusion_art from '../art/diffusion.png';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
const  Tel_create_bet: React.FC = () => {

    useEffect(() => {
        console.log("enter tele create bet card")
    }, []);

    return (

            <>
                <Header style={{backgroundColor:"#6eb0e4",height:"10vmax" ,padding:5}}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <img src={diffusion_art}
                                 alt={"diffusion logo"}
                                 style={{
                                     borderRadius: 20,
                                     position: "relative",
                                     height:"9vmax",
                                     width:"9vmax",
                                 }}/>
                        </Col>
                        <Col span={4}>
                            <p>aaa</p>
                        </Col>
                        <Col span={12}>
                            <div style={{
                                position: "relative",
                                height:"9vmax",
                                width:"9vmax",
                                top:10
                            }}>
                                <WalletSelector />
                            </div>
                        </Col>
                    </Row>
                </Header>
                <Content style={{backgroundColor:"#6e78e4",height:"80vmax"}}></Content>
                <Footer style={{backgroundColor:"#6ee4c1",height:"10vmax"}}></Footer>

            </>

    );
};

export default Tel_create_bet;
