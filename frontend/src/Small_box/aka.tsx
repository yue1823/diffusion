import React from 'react';
import {useState} from "react";
import Small_box from "./small_box";
import "./small_box.css";
import VS_logo from "./vs_logo.jpg";
import {Card, Col, ConfigProvider, Drawer, Row, Statistic} from "antd";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
import APT_logo from "../art/Aptos_mark_BLK.svg";

const Aka:React.FC<{left_preview:string,right_preview:string,left:number,middle:number,right:number,left_name:string,right_name:string,disable:boolean}> = ({left_preview,right_preview,left,middle,right,left_name,right_name, disable}) => {
    const [drawer_open,setdrawer_open]=useState<boolean>(false);
    const click_to_open=()=>{
        setdrawer_open(true);
    }
    const click_to_close = () =>{
        setdrawer_open(false);
    }
    return (<>
        {(!disable)&&(
            <Card
                hoverable
                style={{width:450,height:240,backgroundColor:"#EBE5DF"}}
                className="clickable-card"
                onClick={click_to_open}
                aria-disabled={disable}
            >
                <div
                    style={{
                        position:"relative",
                        padding: 2,
                        minHeight: 150,
                        width: 400,
                        background: "#EBE5DF",
                        borderRadius: 40,
                        top:-15,

                    }}
                    onClick={click_to_open}
                >
                    <Row gutter={36} >
                        <Col span={8}>
                            <img src={left_preview} style={{width: 150, height: 150,padding:5,position:"relative",left:-10}}></img>
                        </Col>
                        <Col span={6}>

                            <img src={APT_logo} style={{
                                width: 70,
                                height: 70,
                                position: "relative",
                                top: 10,
                                left: 18,
                                background: "#EBE5DF"
                            }}></img>
                            <img src={VS_logo} style={{
                                width: 70,
                                height: 70,
                                padding: 0,
                                position: "relative",
                                top: 40,
                                left: 18,
                                background: "#EBE5DF"
                            }}></img>
                        </Col>
                        <Col span={8}>
                            <img src={right_preview} style={{width: 150, height: 150, padding:5}}></img>
                        </Col>
                    </Row>
                    {/*<Row >*/}
                    {/*        <span style={{textAlign:"center"}}>*/}
                    {/*            {`${left_name} VS ${right_name}`}*/}
                    {/*        </span>*/}

                    {/*</Row>*/}
                    <Row>
                        <Col span={12}>
                            <Card bordered={false} style={{height:70,width:140,right:7,textAlign:"center",position:"relative",top:-5}}>

                                {(left>right)&&( <Statistic
                                    title={left_name}
                                    value={left}
                                    precision={2}
                                    style={{position:"relative",top:-20}}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<ArrowUpOutlined />}
                                    suffix=""
                                />)}
                                {(left<right)&&( <Statistic
                                    title={left_name}
                                    value={left}
                                    precision={2}
                                    style={{position:"relative",top:-20}}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix={<ArrowDownOutlined />}
                                    suffix=""
                                />)}
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card bordered={false} style={{height:70,width:140,left:60,textAlign:"center",position:"relative",top:-5}}>
                                {(right<left)&&(<Statistic
                                    title={right_name}
                                    value={right}
                                    precision={2}
                                    style={{position:"relative",top:-20}}
                                    valueStyle={{ color: '#cf1322' }}

                                    prefix={<ArrowDownOutlined />}
                                    suffix=""
                                />)}
                                {(right>left)&&(<Statistic
                                    title={right_name}
                                    value={right}
                                    precision={2}
                                    style={{position:"relative",top:-20}}
                                    valueStyle={{ color: '#3f8600' }}

                                    prefix={<ArrowUpOutlined />}
                                    suffix=""
                                />)}

                            </Card>
                        </Col>
                    </Row>


                </div>
            </Card>
        )}

        <ConfigProvider
            theme={{
                components: {
                    Drawer: {
                        /* 这里是你的组件 token */
                    },
                },
            }}
        >
            <Drawer title={`${left_name} VS ${right_name}`} onClose={click_to_close} open={drawer_open}
                    key={"bottom"}
                    placement={"bottom"}

                    height={700}

                    rootStyle={{height:1000,width:1500,padding:5}}

            >
                <Small_box left_preview={left_preview} right_preview={right_preview} left={left} middle={middle} right={right} left_name={left_name} right_name={right_name}/>
            </Drawer>
        </ConfigProvider>

    </>)
}
export default Aka;