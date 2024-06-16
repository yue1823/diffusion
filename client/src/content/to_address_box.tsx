import React, {useEffect, useState} from 'react';
import "../css_folder/heardbar.css"
import {Badge, Card, Col, ConfigProvider, Layout, Row, Space, theme} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {UserOutlined} from "@ant-design/icons";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
import {useWallet} from "@aptos-labs/wallet-adapter-react";

const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);

const To_address_box:React.FC<{ address:string}> = ({ address}) =>  {

    useEffect(() => {

    },[address]);
    return (
        <div>
            <Space direction="vertical" size="middle" style={{ width: '100%' }} >
                <Badge.Ribbon text="User Address">
                    <Card title={<><UserOutlined /> User</>} size="small" style={{minWidth:170}}>
                        APT : {}
                    </Card>
                </Badge.Ribbon>
            </Space>
        </div>
    );
}

export default To_address_box