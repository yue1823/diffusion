import React, {useEffect, useState} from 'react';
import "../css_folder/heardbar.css"
import {Badge, Card, Col, ConfigProvider, Layout, Row, Space, theme} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {TeamOutlined, UserOutlined} from "@ant-design/icons";
import diffusion_logo from "../art/diffusion7.png"
import "../css_folder/resources_address_box.css"
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
import {useWallet} from "@aptos-labs/wallet-adapter-react";

const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);

const Resource_address_box:React.FC<{ address:string}> = ({ address}) =>  {

    useEffect(() => {

    },[address]);
    return (
        <div>

                <Badge.Ribbon text="Diffusion" color="red">
                    <Card title={<><TeamOutlined /> Diffusion</>} size="small" style={{width:180}}>
                        <div className={""}>
                            <img src={diffusion_logo} alt={"diffusion logo"} className={"diffusion_logo_resource_address_box"}></img>
                        </div>
                    </Card>
                </Badge.Ribbon>

        </div>
    );
}

export default Resource_address_box