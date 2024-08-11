import {Button, Card, Col, ProgressProps, Row, Segmented, Statistic, theme} from "antd";
import React, {useEffect, useRef, useState} from 'react';
import APT_LOGO from '../logo/aptos-apt-logo.svg';
import My_logo from "../art/logo_of_yue.svg";
import {Content, Header} from "antd/lib/layout/layout";
import {
    AppstoreOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
    BarsOutlined,
    CopyOutlined, FallOutlined,
    RiseOutlined
} from "@ant-design/icons";
import {toast, ToastContainer} from "react-toastify";
import {Connection, PublicKey} from '@solana/web3.js'
import copy from "copy-to-clipboard";
import { PieChart } from '@mui/x-charts/PieChart';
import {
    PriceStatus,
    PythHttpClient,
    getPythClusterApiUrl,
    getPythProgramKeyForCluster,
    PythCluster,
    PythConnection, PriceType
} from "@pythnetwork/client";

import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY': 'nodit-demo'}
};
const NOW_Network = "testnet";
const resources_address = "0xfc33225e4f4155e79db5cb873c065e7de6f9cbe25302b0ec2928e5fea76c31ec::helper::Account_tree";

const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);

const pyth_apt_usd = 'https://hermes.pyth.network/v2/updates/price/stream?ids[]=0x03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5';
const PYTHNET_CLUSTER_NAME: PythCluster = 'pythnet'
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME))
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME)


const User_page:React.FC<{ }> = ({ }) => {
    const { account, signAndSubmitTransaction } = useWallet();
    const [right_of_segement,setright_of_segement]=useState<string>('List');
    const [helper_point,set_helper_point]=useState<string>('');
    const [wrong_time,set_wrong_time]=useState<string>('');
    const [value,set_value]= useState<string>('0');
    const [total_usd_value,set_total_usd_value]=useState('0');
    const [user_icon , set_user_icon]=useState('https://raw.githubusercontent.com/yue1823/diffusion/main/client/src/art/diffusion7.png');
    const [user_address,set_user_address]=useState<string>("hello") ;
    const [user_balance,setuser_balance]=useState<string>('0');
    const [user_name ,set_user_name]=useState<string>('User');
    const [user_gain,set_user_gain]=useState<string>('0');
    const [user_lost,set_user_lost]=useState<string>('0');
    const [pie_data,set_pie_data] = useState([
        { id: 0, value: 0, label: 'APT' },
        { id: 1, value: 0, label: 'zUSDC' },
        { id: 2, value: 0, label: 'wUSDC' },
        { id: 3, value: 0, label: 'zUSDT' },
        { id: 4, value: 0, label: 'wUSDT' },]);
    let [a,seta] =useState(0);
    let [b,setb]= useState(0);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const copy_address_button =() =>{
        copy(user_address);
        toast.success("Success Copy !", {
            position: "bottom-right"
        });
    }
    const fatch_account_from_aptos = () => {
        if (!account) return [];
        fetch(`https://aptos-${Network}.nodit.io/v1/accounts/${account.address}`, options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }
    const  fatch_account_resource_from_aptos = () =>{
        if (!account) return [];
             fetch(`https://aptos-${Network}.nodit.io/v1/accounts/${account.address}/resource/${resources_address}`, options)
            .then(response => response.json())
            .then(response => {
                const {name,icon} = response.save1;
                set_user_icon(icon);
                set_user_name(name);
                const { diffusion_loyalty, level,win,lose } = response.save_5;
                set_user_gain(win);
                set_user_lost(lose);
                const{badges} = response.save_4;

            })
            .catch(err => console.error(err));
            //const priceUpdates = await connection.getLatestVaas()
    }
    const devnet_fatch_pie_data = () =>{
        if (!account) return [];

        set_user_address(account.address)
        try{
            const promise = aptos.account.getAccountAPTAmount({accountAddress:account.address});
            promise.then(balance => {

                let real_balance = balance /100000000;
                const updata_pie_data = [...pie_data];
                updata_pie_data[0]={...updata_pie_data[0],value: real_balance}
                set_pie_data(updata_pie_data);
                const url = 'https://api.dexscreener.com/latest/dex/tokens/0x1::aptos_coin::AptosCoin';
                fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } })
                    .then(response => response.json())
                    .then(response => {
                        const  priceNative = response.pairs[0].priceNative;

                        const apt = real_balance*priceNative;
                        const wusdc = aptos.account.getAccountCoinAmount({accountAddress:account.address,coinType: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T" as `${string}::${string}::${string}`} );
                        const usdt = aptos.account.getAccountCoinAmount({accountAddress:account.address,coinType: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC" as `${string}::${string}::${string}`} );
                        wusdc.then(balance =>seta(balance))
                        usdt.then(balance =>setb(balance))
                        let amount =(a+b+apt).toFixed(2).toString();
                        set_value(amount);
                    })

            }).catch(error => {
                console.error('Error fetching balance:', error);
            });
        }catch (error:any){
            console.log(error);
        }
    }


    // const feeds = [new PublicKey('H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG')]
    // const pythConnection = new PythConnection(connection, pythPublicKey, 'confirmed', feeds)
    // pythConnection.onPriceChangeVerbose((productAccount, priceAccount) => {
    //     // The arguments to the callback include solana account information / the update slot if you need it.
    //
    //     const product = productAccount.accountInfo.data.product
    //     const price = priceAccount.accountInfo.data
    //
    //     // sample output:
    //     // SOL/USD: $14.627930000000001 ±$0.01551797
    //     if (price.price && price.confidence) {
    //         // tslint:disable-next-line:no-console
    //         console.log(`${product.symbol}: $${price.price} \xB1$${price.confidence}`)
    //     } else {
    //         // tslint:disable-next-line:no-console
    //         console.log(`${product.symbol}: price currently unavailable. status is ${PriceStatus[price.status]}`)
    //     }
    //     pythConnection.stop()
    //
    // })


    useEffect(() => {
        //pythConnection.start()

        devnet_fatch_pie_data()
    },[account]);
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
                                    <Card  style={{height:580}}>
                                        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 },{ xs: 8, sm: 16, md: 24, lg: 32 }]}>
                                            <Col span={24}>
                                                <Card style={{height: 260, backgroundColor: "#f4f4f1"}}>
                                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                        <Col span={24}>
                                                            <img
                                                                src={user_icon}
                                                                alt={"img1"}
                                                            style={{height:210,width:210, borderRadius: 20,backgroundColor:"white"}}>
                                                            </img>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                                <br/>
                                                <Card style={{height: 64, backgroundColor: "#f4f4f1"}}>
                                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                        <Col span={24}>
                                                            <Card style={{backgroundColor:"#60605b",color:"#f4f4f1",position:"relative",top:-18,height:50}}>
                                                                <h1 style={{position:"relative",top:-20}}>{user_name}</h1>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                                <br/>
                                                <Card style={{height: 168, backgroundColor: "#f4f4f1"}}>
                                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{position:"relative",top:-10}}>
                                                        <Col span={24}>
                                                            <Card style={{backgroundColor:"white",height:60}}>
                                                                <Statistic
                                                                    title="Gain"
                                                                    value={user_gain}
                                                                    precision={2}
                                                                    valueStyle={{ color: '#3f8600' }}
                                                                    prefix={<RiseOutlined />}
                                                                    suffix=" APT"
                                                                    style={{position:"relative",top:-25}}
                                                                />
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                    <br/>
                                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{position:"relative",top:-12}}>
                                                        <Col span={24}>
                                                            <Card style={{backgroundColor:"white",height:60}}>
                                                                <Statistic
                                                                    title="Lost"
                                                                    value={user_lost}
                                                                    precision={2}
                                                                    valueStyle={{ color: '#cf1322' }}
                                                                    prefix={<FallOutlined />}
                                                                    suffix=" APT"
                                                                    style={{position:"relative",top:-25}}
                                                                />
                                                            </Card>

                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={18}>
                                    <Card  style={{height:580}}>
                                        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 },{ xs: 8, sm: 16, md: 24, lg: 32 }]}>
                                            <Col span={16}>
                                                <Card style={{height:345,backgroundColor:"#f4f4f1"}}>
                                                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                      <Col span={8}>
                                                          <h3>Balance of User</h3>
                                                          <h2>${value}</h2>
                                                      </Col>
                                                  </Row>
                                                    <Row>
                                                        <Col span={24}>

                                                            <Card style={{height:250}}>
                                                                <Row>
                                                                    <Col span={24} >
                                                                        <PieChart
                                                                            series={[
                                                                                {
                                                                                    data: pie_data,
                                                                                    innerRadius: 60,
                                                                                    outerRadius: 90,
                                                                                    paddingAngle: 4,
                                                                                    cornerRadius: -2,
                                                                                    startAngle: 0,
                                                                                    endAngle: 360,
                                                                                    cx: 150,
                                                                                    cy: 95,
                                                                                }
                                                                            ]}
                                                                            height={200}
                                                                        />
                                                                        <img src={APT_LOGO} style={{height:80,width:80,position:"relative",top:-140,left:116}}></img>
                                                                    </Col>
                                                                </Row>
                                                            </Card>
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
                                                    <Row>
                                                        <Col span={24}>
                                                            <Card style={{height:80 ,position:"relative",top:-14}}>
                                                                <Statistic
                                                                    title="Helper Point"
                                                                    value={helper_point}
                                                                    precision={2}
                                                                    valueStyle={{ color: '#3f8600' }}
                                                                    prefix={<ArrowUpOutlined />}
                                                                    suffix=" pt"
                                                                    style={{position:"relative",top:-14}}
                                                                />
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                                <br/>
                                                <Card style={{height: 100, backgroundColor: "#f4f4f1"}}>
                                                    <Row>
                                                        <Col span={24}>
                                                            <Card style={{height:80 ,position:"relative",top:-14}}>
                                                                <Statistic
                                                                    title="Wrong Times"
                                                                    value={wrong_time}
                                                                    precision={2}
                                                                    valueStyle={{ color: '#cf1322' }}
                                                                    prefix={<ArrowDownOutlined />}
                                                                    suffix=" t"
                                                                    style={{position:"relative",top:-14}}
                                                                />
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col span={24}>
                                               <Card title={<span>{<Segmented options={segemat_options} onChange={check =>{setright_of_segement(check)}} />}</span>} style={{height: 170, backgroundColor: "#f4f4f1",padding:1}}>
                                                   <Segment_position right={right_of_segement} />
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

const Segment_position :React.FC<{ right:string}> = ({ right})=>{
    return(
        <>
            {(right=="List") &&
                <Row>
                    <Col span={24}>
                        <Card >

                        </Card>
                    </Col>
                </Row>
        }
            {(right=="Transaction") &&
            <Row>
                <Col span={24}>
                    <Card>

                    </Card>
                </Col>
            </Row>
        }
        </>
    )
}
const segemat_options = [
    { label: 'List',
        value: 'List',
        icon: <BarsOutlined /> },
    { label: 'Transaction',
        value: 'Transaction',
        icon: <AppstoreOutlined /> },
]

export default User_page;