import React, {useEffect} from 'react';
import {useState} from "react";
import Small_box from "./small_box";
import "./small_box.css";
import VS_logo from "./vs_logo.jpg";
import {Card, Col, ConfigProvider, Drawer, Row} from "antd";

const Aka:React.FC<{left_preview:string,right_preview:string,left:number,middle:number,right:number,left_name:string,right_name:string}> = ({left_preview,right_preview,left,middle,right,left_name,right_name }) => {
    const [drawer_open,setdrawer_open]=useState<boolean>(false);
    const click_to_open=()=>{
        setdrawer_open(true);
    }
    const click_to_close = () =>{
        setdrawer_open(false);
    }
    return (<>
        <Card
            hoverable
            style={{width:450,height:240,backgroundColor:"#EBE5DF"}}
            className="clickable-card"
            onClick={click_to_open}
        >
            <div
                style={{
                    padding: 25,
                    minHeight: 150,
                    width: 400,
                    background: "#EBE5DF",
                    borderRadius: 40,


                }}
                onClick={click_to_open}
            >
                <Row gutter={36}>
                    <Col span={8}>
                        <img src={left_preview} style={{width: 130, height: 130,padding:5}}></img>
                    </Col>
                    <Col span={6}>
                        <img src={VS_logo} style={{width:90,height:90,padding:5}}></img>
                    </Col>
                    <Col span={8}>
                        <img src={right_preview} style={{width: 130, height: 130,padding:5}}></img>
                    </Col>
                </Row>
                {/*<Row >*/}
                {/*        <span style={{textAlign:"center"}}>*/}
                {/*            {`${left_name} VS ${right_name}`}*/}
                {/*        </span>*/}

                {/*</Row>*/}

            </div>
        </Card>
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