
import {Button, Col, Drawer, Row, theme} from "antd";
import React, {useEffect, useState} from 'react';

import {Content} from "antd/lib/layout/layout";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
import {AccountInfo, useWallet} from "@aptos-labs/wallet-adapter-react";
import Apt_logo from "../art/Aptos_mark_BLK.svg";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

const module_address="0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa";
const resources_type ="0x1::account::Account";
const https_required = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY': 'nodit-demo_aptos_resources'}
};
const Admin_page:React.FC<{ }> = ({ }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { account, signAndSubmitTransaction } =useWallet() ;
    return (
        <>
            <Content style={{padding: '15px 30px'}}>
                <Row gutter={[12,12]}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 600,
                            minWidth: 1200,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Col span={12}>
                            <Create_pair_button account={account}/>
                        </Col>
                        <br/>
                        <Col span={12}>
                            <Upload_result_button account={account}/>
                        </Col>


                    </div>
                </Row>
            </Content>
        </>
    );
}

const  Create_pair_button:React.FC<{ account: AccountInfo | null }> = ({ account}) => {
    const [open , set_open] = useState<boolean>(false);
    const button_click = () =>{
        set_open(true)
    }
    const button_close = () =>{
        set_open(false)
    }
    useEffect(() => {
        const fetch_pair_resources = () =>{
            const https = `https://aptos-mainnet.nodit.io/v1/accounts/${module_address}/resource/${resources_type}`
            try{
                //fetch(https,https_required).then(respone => respone.json());
            }catch (e:any){
                console.log(e);
            }
        }

        fetch_pair_resources()
        },[account])
    return (
        <>
            <Button title={"Create_pair"} style={{height:70,width:200}} onClick={button_click}>
                Create pair
            </Button>

            <Drawer open={open} onClose={button_close} style={{width:1000}} title={"Create_pair"}>

            </Drawer>
        </>
    );
}

const  Upload_result_button:React.FC<{ account: AccountInfo | null}> = ({ account}) => {
    const [open , set_open] = useState<boolean>(false);
    const button_click = () =>{
        set_open(true)
    }
    const button_close = () =>{
        set_open(false)
    }
    useEffect(() => {
        const fetch_pair_resources = () =>{
            const https = `https://aptos-mainnet.nodit.io/v1/accounts/${module_address}/resource/${resources_type}`
            try{
                //fetch(https,https_required).then(respone => respone.json());
            }catch (e:any){
                console.log(e);
            }
        }

        fetch_pair_resources()
    },[account])
    return (
        <>
            <Button title={"Upload_result"} style={{height:70,width:200}} onClick={button_click}>
                Upload_result
            </Button>

            <Drawer open={open} onClose={button_close} style={{width:1000}} title={"Upload_result"}>

            </Drawer>
        </>
    );
}
export default Admin_page;