import {Button, Card, Col, ProgressProps, Row, theme} from "antd";
import React, {useEffect, useState} from 'react';

import {Content, Header} from "antd/lib/layout/layout";
import {CopyOutlined} from "@ant-design/icons";
import {toast, ToastContainer} from "react-toastify";
import copy from "copy-to-clipboard";



const User_page:React.FC<{ }> = ({ }) => {
    const [value,setvalue]= useState<string>('0');
    const [user_address,set_user_address]=useState<string>("hello") ;
    const [user_balance,setuser_balance]=useState<string>('0');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const copy_address_button =() =>{
        copy(user_address);
        toast.success("Success Copy !", {
            position: "bottom-right"
        });
    }
    return (
        <>
            <Content style={{padding: '15px 30px'}}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                    <Col span={24}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 620,
                                minWidth: 1200,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={6}>
                                    <Card title={"User"} style={{height:580}}>

                                    </Card>
                                </Col>
                                <Col span={18}>
                                    <Card  style={{height:580}}>
                                        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 },{ xs: 8, sm: 16, md: 24, lg: 32 }]}>
                                            <Col span={16}>
                                                <Card style={{height:345,backgroundColor:"#f4f4f1"}}>
                                                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                      <Col span={8}>
                                                          <h3>APT of User</h3>
                                                          <h2>${value}</h2>
                                                      </Col>
                                                  </Row>
                                                </Card>
                                            </Col>
                                            <Col span={8}>
                                                <Card style={{height: 100, backgroundColor: "#f4f4f1"}}>
                                                        <Row style={{position:"relative",top:-10}}>
                                                            <Col span={21}>
                                                                User address:
                                                            </Col>
                                                            <Col span={3}>
                                                                <CopyOutlined  style={{fontSize:25}} onClick={copy_address_button}/>
                                                                <ToastContainer
                                                                    position="bottom-right"
                                                                    autoClose={5000}
                                                                    hideProgressBar={false}
                                                                    newestOnTop={false}
                                                                    closeOnClick
                                                                    rtl={false}
                                                                    pauseOnFocusLoss
                                                                    draggable
                                                                    pauseOnHover
                                                                    theme="light"
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row style={{position:"relative",top:-10}}>
                                                            <Col span={24}>
                                                                <Card style={{backgroundColor:"#60605b",color:"#f4f4f1",height:50}}>
                                                                    <Row>
                                                                        <div style={{position:"relative",top:-10}}>
                                                                            {user_address}
                                                                        </div>
                                                                    </Row>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                </Card>
                                                <br/>
                                                <Card style={{height: 100, backgroundColor: "#f4f4f1"}}>

                                                </Card>
                                                <br/>
                                                <Card style={{height: 100, backgroundColor: "#f4f4f1"}}>

                                                </Card>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col span={24}>
                                               <Card style={{height: 170, backgroundColor: "#f4f4f1"}}>
                                                   <></>

                                               </Card>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>

                            </Row>
                        </div>
                    </Col>
                </Row>
            </Content>
        </>
    );
}

export default User_page;