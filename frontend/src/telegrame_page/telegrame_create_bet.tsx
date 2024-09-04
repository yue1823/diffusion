
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
                <Header style={{backgroundColor:"#ded9cd",height:"10vmax"}}>
                    <Row gutter={24} >
                        <Col span={6}>
                            <img src={diffusion_art}
                                 alt={"diffusion logo"}
                                 style={{
                                     borderRadius: 20,
                                     position: "relative",
                                     width:"30vmax",
                                     height:"9vmax",
                                     left:"-60%",
                                     top:"6%",
                                 }}/>
                        </Col>
                        <Col span={6}>
                            <h1 style={{fontSize:32,
                                position:"relative",
                                left:"-80%",
                                top:"14%",}}>Diffusion</h1>
                        </Col>
                        <Col span={12}>
                            <div style={{
                                position: "relative",
                                top:"16%"
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
