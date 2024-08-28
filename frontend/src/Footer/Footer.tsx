import React from 'react';
import "../css_folder/heardbar.css"
import {Col, Row} from "antd";

import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { GithubOutlined} from "@ant-design/icons";


const Footer_bar:React.FC<{ }> = ({ }) => {
    return (
        <>
            <></>

                    <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                        <Col span={6}></Col>
                        <Col span={12}>
                            Diffusion ©{new Date().getFullYear()} Create by Yue
                        </Col>
                        <Col span={6}></Col>
                    </Row>
                    <br/>

                    <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                        <Col span={6}></Col>
                        <Col span={12}>
                            <a href="https://github.com/yue1823" target="_blank" rel="noopener noreferrer">
                                <GithubOutlined style={{fontSize: 30}}/>
                            </a>
                        </Col>
                        <Col span={6}></Col>
                    </Row>


        </>
    );
}

export default Footer_bar;