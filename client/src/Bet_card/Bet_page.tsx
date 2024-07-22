import React, {useState} from 'react';
import {Content} from "antd/lib/layout/layout";
import Swap_box from "../swap_page/swap_box";
import {Router} from "react-router-dom";
import {Col, Row} from "antd";
import Aka from "../Small_box/aka";
const Bet_page:React.FC<{}> = ({}) =>{





    return(
        <>
            <Content style={{padding: '15px 30px'}}>
                    <div
                        style={{
                            padding: 20,
                            minHeight: 600,
                            minWidth: 600,
                            background: "#ffffff",
                            borderRadius: 10,
                        }}
                    >

                        <Row>
                            <Col span={4}>
                                <div
                                    style={{
                                        padding: 0,
                                        height: 600,
                                        width: 170,
                                        background: "#EBE5DF",
                                        borderRadius: 10,
                                        textAlign: 'center',
                                    }}
                                ></div>
                            </Col>
                            <Col span={18}>
                                <div
                                    style={{
                                        padding: 0,
                                        height: 600,
                                        width: 960,
                                        background: "#EBE5DF",
                                        borderRadius: 10,
                                        textAlign: 'center',
                                    }}
                                >
                                    <Row gutter={24}>
                                        <Col span={1}></Col>
                                        <Col span={11}>
                                            <Aka
                                                left_preview={"https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/640px-Donald_Trump_official_portrait.jpg"}
                                                right_preview={"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/800px-Joe_Biden_presidential_portrait.jpg"}
                                                left={2} middle={8} right={3} left_name={"Trump"} right_name={"Biden"}/>
                                        </Col>
                                        <Col span={11}>
                                            <Aka
                                                left_preview={"https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/640px-Donald_Trump_official_portrait.jpg"}
                                                right_preview={"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/800px-Joe_Biden_presidential_portrait.jpg"}
                                                left={2} middle={8} right={3} left_name={"Trump"} right_name={"Biden"}/>
                                        </Col>

                                    </Row>

                                </div>
                            </Col>


                        </Row>


                    </div>
            </Content>

        </>
    );
}
export default Bet_page;