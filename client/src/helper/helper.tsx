
import {Col, Collapse, Row, theme, Image, Card, Segmented} from "antd";
import React, {useEffect, useState} from 'react';
import Prove_of_helper from "../art/Prove of Helper.png";
import {Content} from "antd/lib/layout/layout";
import APT_logo from "../logo/aptos-apt-logo.svg"
import Helper_upload_box from "./upload_box_helper";
import { motion } from "framer-motion";
import  "../css_/rainbow_button.css";
const text1 = `
  If you are our diffusion helper , you can help us to upload correct result.
`;

const Helper_page:React.FC<{ }> = ({ }) => {
    const [pair_can_upload,set_pair_can_upload]=useState<string[]>([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();


    return (
        <>
            <Content style={{padding: '15px 30px'}}>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >

                    <Col span={24}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 600,

                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                                <Col span={4}>
                                    <Card title={"Helper"} style={{height: 500, backgroundColor: "#f4f4f1"}}>
                                        <Row>
                                            <Col span={24}>
                                                <Card>
                                                    <img src={APT_logo} alt={"logo1"}></img>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <motion.div
                                                    animate={{x: [null, 100, 0], y: [null, 100, 0]}}
                                                    whileHover={{
                                                        scale: [null, 1.5, 1.4],
                                                        zIndex: 1000,
                                                        position: 'relative'
                                                    }}
                                                    transition={{duration: 0.3}}
                                                >
                                                    <Card>

                                                    </Card>
                                                </motion.div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <motion.div
                                                    animate={{x: [null, 100, 0], y: [null, 100, 0]}}
                                                    whileHover={{
                                                        scale: [null, 1.5, 1.4],
                                                        zIndex: 1000,
                                                        position: 'relative'
                                                    }}
                                                    transition={{duration: 0.3}}
                                                >
                                                    <Card>

                                                    </Card>
                                                </motion.div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={20}>
                                    <Card title={<span>
                                    <Segmented<string>
                                        options={['Game', 'Sport', 'Unexpected']}
                                        onChange={(value) => {
                                            console.log(value); // string
                                        }}
                                    />
                                </span>} style={{height: 500, backgroundColor: "#f4f4f1"}}>
                                        <Row gutter={[24, 16]}>
                                            <Helper_upload_box left_url={""} right_url={""}/>
                                            <Helper_upload_box left_url={""} right_url={""}/>
                                            <Helper_upload_box left_url={""} right_url={""}/>
                                            <Helper_upload_box left_url={""} right_url={""}/>
                                            <Helper_upload_box left_url={""} right_url={""}/>
                                            <Helper_upload_box left_url={""} right_url={""}/>
                                        </Row>

                                    </Card>
                                </Col>
                            </Row>
                            <br/>


                            <Collpse_this_page/>
                        </div>
                    </Col>
                </Row>
            </Content>
        </>
    );
}

const Collpse_this_page = () =>{

    return(
        <>
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 },{ xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={24}>
                    <Collapse
                        size="small"
                        items={[{ key: '1', label: 'This is small size panel header', children: <p>{text1}</p> }]}
                    />
                </Col>
                <Col  span={24}>
                    <Collapse
                        size="small"
                        items={[{ key: '1', label: 'This is small size panel header', children: <p>{text1}
                                <Collapse  items={[{
                                    key: '1', label: 'How it work', children: <p>
                                        <Image  src={Prove_of_helper}/>
                                    </p> }]}
                                />
                            </p>}]}
                    />
                </Col>
            </Row>
        </>
    );
}

export default Helper_page;