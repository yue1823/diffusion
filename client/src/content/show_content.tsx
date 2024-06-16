import React, {useEffect, useState} from 'react';
import "../css_folder/heardbar.css"
import {Badge, Card, Col, ConfigProvider, Layout, Row, Space, theme} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import User_address_box from "./user_address_box";
import Resource_address_box from "./resource_address_box";


const Show_content:React.FC<{ address:string,index_of_address:number}> = ({ address,index_of_address:number}) =>  {
    const [user_address_box,setuser_address_box]=useState<boolean>(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    useEffect(() => {
        if(address != "User address"){setuser_address_box(true)}
    },[address]);
    return (
        <div
            style={{
                padding: 24,
                minHeight: 380,
                minWidth: 800,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
        >
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

            <Space direction="vertical" size="middle" style={{ width: '100%' }} >
                <Row gutter={[100,1024]}>
                    <Col >
                        {user_address_box && (
                         <User_address_box address={address}/>
                            )}
                    </Col>
                    <Col >
                        {user_address_box && (
                            <Resource_address_box address={address}/>
                        )}
                    </Col>
                </Row>
            </Space>

        </div>
    );
}

export default Show_content