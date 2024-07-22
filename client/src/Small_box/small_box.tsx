import React, {useEffect} from 'react';
import {useState} from "react";
import {Card, Col, Input, Progress, ProgressProps, Row, Statistic, Tooltip} from "antd";
import VS_logo from "./vs_logo.jpg";
import "./small_box.css"

function ArrowUpOutlined() {
    return null;
}

const Small_box:React.FC<{left_preview:string,right_preview:string,left:number,middle:number,right:number,left_name:string,right_name:string }> = ({left_preview,right_preview,left,middle,right,left_name,right_name }) => {
    const [preview_link_1,setpreview_link_1]=useState<string>("https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/rockcms/2024-07/240713-donald-trump-secret-service-rally-wm-323p-6d65b1.jpg");
    const [preview_link_2,setpreview_link_2]=useState<string>("data:image/jpeg;base64,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");
    const [button_drawer_open,setbutton_drawer_open] =useState()
    const [bet_value,set_bet_value]=useState<string>('0');
    const [wallet_balance,set_wallet_balance]=useState<string>('0.00');
    const threeColors: ProgressProps['strokeColor'] = {
        '0%': '#e91010',
        '30%': '#e91010',
        '31%': '#ffffff',
        '70%': '#ffffff',
        '71%': '#1b2de8',
        '100%':'#1b2de8',
    };
    const submit_transation =() =>{
        console.log('Transaction submitted');
    }
    const set_bet_value_toinput=()=>{
        set_bet_value(wallet_balance);
    }
    const suffix = (

        <span onClick={set_bet_value_toinput} style={{ cursor: 'pointer' }}>
      {wallet_balance}
    </span>
    );


    useEffect(() => {
        // Set the image link when the component mounts
        setpreview_link_1(left_preview);
        setpreview_link_2(right_preview);
    }, []);
    return (
        <>
            <div
                style={{
                    padding: 25,
                    minHeight: 380,
                    width:700,
                    background: "#EBE5DF",
                    borderRadius: 40,

                }}
            >
                <Row gutter={24}>
                    <Col span={8}>
                        <div style={{padding: 10}}>
                            <img src={preview_link_1} alt={"left_preview"}
                                 style={{width: 200, height: 200, borderRadius: 20}}></img>
                        </div>
                    </Col>
                    <Col span={8} style={{textAlign:"center"}}>
                        <div style={{padding: 5}}>
                            <img src={VS_logo}
                                 style={{width: 120, height: 120, borderRadius: 20, background: "#EBE5DF"}}></img>
                        </div>
                        <Card size="small" title="Bet"  style={{ width: 230,height:85 }}>
                            <Input  placeholder={bet_value.toString()}
                                    suffix={suffix}
                                    style={{ textAlign: 'right' }} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <div style={{padding: 10}}>
                            <img src={preview_link_2} alt={"left_preview"}
                                 style={{width: 200, height: 200, borderRadius: 20}}></img>
                        </div>
                    </Col>

                </Row>
                <Row>
                    <Tooltip title={"30% trump/40% middle/30% biden"}>
                        <Progress percent={100} strokeColor={threeColors} percentPosition={{align: 'center', type: 'inner'}}/>
                    </Tooltip>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Card style={{}}
                              hoverable
                              className="clickable-card"
                              onClick={submit_transation}>
                            <Statistic
                                title={left_name}
                                value={left}
                                precision={2}
                                style={{height:50,width:80}}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix=""
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{}}
                              hoverable
                              className="clickable-card"
                              onClick={submit_transation}>
                            <Statistic
                                title="Draw"
                                value={middle}
                                precision={2}
                                style={{height:50,width:80}}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix=""
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{}}
                              hoverable
                              className="clickable-card"
                              onClick={submit_transation}>
                            <Statistic
                                title={right_name}
                                value={right}
                                precision={2}
                                style={{height:50,width:80}}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix=""
                            />
                        </Card>
                    </Col>
                </Row>


            </div>
        </>
    );
}

export default Small_box;