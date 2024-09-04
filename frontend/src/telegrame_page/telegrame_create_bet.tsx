
import React, { useEffect, useState } from 'react';
import {Col, Row} from "antd";
import {Content, Footer, Header } from 'antd/es/layout/layout';
import diffusion_art from '../art/diffusion.png';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import { motion } from 'framer-motion';
import LOL from "./telegrame_img/lol.jpeg";
import football from "./telegrame_img/world_cup.jpeg";
import nba from "./telegrame_img/nba.png";
import dota2 from "./telegrame_img/dota2.jpeg";
import diffusion_png from "../art/diffusion_black.png";
import cs from "./telegrame_img/CS.jpeg";
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { diffusion } from '../setting';
const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY':`${diffusion.x_api_key}`}
};
const NOW_Network = "testnet";
const  Tel_create_bet: React.FC = () => {
    const { account } =useWallet() ;
    const [user_profile,set_user_profile]=useState({
        name:'',icon:''
    })
    const [which , set_which ]= useState("");
    const fetch_data = async () =>{
        if (!account) return [];
        fetch(`https://aptos-${NOW_Network}.nodit.io/v1/accounts/${account.address}/resource/${diffusion.function.diffusion_account_tree()}`, options)
            .then(response => response.json())
            .then((response) => {
                if(response){
                    set_user_profile({
                        icon:response.data.save_1.icon,
                        name:response.data.save_1.name
                    })


                }
            });
    }
    useEffect(() => {
        fetch_data();
        console.log(`which : ${which}`)
    }, [which]);

    return (

            <>
                <div style={{
                    margin: 0,
                    padding: 0,
                    overflowX: "hidden",
                    overflowY: "hidden",
                }}>
                    <Header style={{backgroundColor:"#e1dcd6",height:"10vmax",padding:3}}>
                        <Row gutter={24} style={{display: "flex"}}>
                            <Col span={6}>
                                <img src={diffusion_art}
                                     alt={"diffusion logo"}
                                     style={{
                                         borderRadius: 20,
                                         position: "relative",
                                         textAlign: "center"
                                     }}/>
                            </Col>
                            <Col span={6}>
                                <h1 style={{fontSize:28,
                                    position:"relative",
                                    top:"10%",
                                    left:"-27%",
                                    textAlign: "center"
                                    }}>Diffusion</h1>
                            </Col>
                            <Col span={12}>
                                <div style={{
                                    position: "relative",
                                    top:"10%",
                                    left:"-5%",
                                }}>
                                    <WalletSelector />
                                </div>
                            </Col>
                        </Row>
                    </Header>

                    <Content style={{backgroundColor:"#6e78e4",height:"80vmax" }}>

                        <Row gutter={[24, 24]} style={{padding: 20}}>
                            <Col span={24}>
                                <div style={{
                                    height: "15vmax",
                                    width: "100%",
                                    backgroundColor: "#52d363",
                                    borderRadius: 5
                                }}>
                                    <img src={user_profile.icon} alt={"user_icon"}></img>

                                    {which == '' ? <>
                                        <p>{user_profile.name}</p>
                                    </> : <>
                                    <button onClick={() => {
                                            set_which('')
                                        }} className={"rainbow"} style={{position: "relative",transform:"translateX(100%) translateY(-150%)"}}>
                                            never
                                        </button>
                                    </>}
                                </div>
                            </Col>
                            {which == '' ? <>
                                <Col span={12}>
                                        <motion.div
                                            className={"box"}
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}
                                            onClick={()=>{set_which("LOL")}}
                                        >
                                            <div style={{height:"17vmax",width:"100%",backgroundColor:"#e46ebb",borderRadius:5}}>
                                                <img src={LOL} alt={"lol"}></img>
                                            </div>

                                        </motion.div>
                                    </Col>
                                    <Col span={12}>
                                        <motion.div
                                            className={"box"}
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}
                                            onClick={()=>{set_which("football")}}
                                        >
                                            <div style={{
                                                height: "17vmax",
                                                width: "100%",
                                                backgroundColor: "#e46ebb",
                                                borderRadius: 5
                                            }}>
                                                <img src={football} alt={"football"}></img>
                                            </div>
                                        </motion.div>
                                    </Col>
                                    <Col span={12}>
                                        <motion.div
                                            className={"box"}
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}
                                            onClick={()=>{set_which("nba")}}
                                        >
                                            <div style={{
                                                height: "17vmax",
                                                width: "100%",
                                                backgroundColor: "#e46ebb",
                                                borderRadius: 5
                                            }}>
                                                <img src={nba} alt={"nba"}></img>
                                            </div>
                                        </motion.div>
                                    </Col>
                                    <Col span={12}>
                                        <motion.div
                                            className={"box"}
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}
                                            onClick={()=>{set_which("dota2")}}

                                        >
                                            <div style={{
                                                height: "17vmax",
                                                width: "100%",
                                                backgroundColor: "#e46ebb",
                                                borderRadius: 5
                                            }}>
                                                <img src={dota2} alt={"dota2"}></img>
                                            </div>
                                        </motion.div>
                                    </Col>
                                    <Col span={12}>
                                        <motion.div
                                            className={"box"}
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}
                                            onClick={()=>{set_which("cs")}}
                                        >
                                            <div style={{
                                                height: "17vmax",
                                                width: "100%",
                                                backgroundColor: "#e46ebb",
                                                borderRadius: 5
                                            }}>
                                                <img src={cs} alt={"cs"}></img>
                                            </div>
                                        </motion.div>
                                    </Col>
                                    <Col span={12}>
                                        <motion.div
                                            className={"box"}
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}
                                            onClick={()=>{set_which("unexpected")}}
                                        >
                                            <div style={{
                                                height: "17vmax",
                                                width: "100%",
                                                backgroundColor: "#e46ebb",
                                                borderRadius: 5
                                            }}>
                                                <img src={diffusion_png} alt={"unexpected"}></img>
                                            </div>
                                        </motion.div>
                                    </Col>
                            </>
                                :
                                <>

                            </>}

                        </Row>


                    </Content>
                    <Footer style={{backgroundColor: "#6ee4c1", height: "10vmax",}}></Footer>
                </div>
            </>

    );
};

export default Tel_create_bet;
