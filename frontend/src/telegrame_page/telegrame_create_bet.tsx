
import React, { useEffect, useState } from 'react';
import {Col, Result, Row, Typography,Image, Input, message} from "antd";
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
import {InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react';
import { diffusion } from '../setting';
import Tel_create_bet_box from './telegrame_bet_box';
import Modal from "@mui/material/Modal";
import {Box} from "@mui/material";


import {Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);
interface SavePair {
    can_bet:boolean;
    expired_time: string;
    left: string;
    left2: string;
    left_url: string;
    middle: string;
    middle2: string;
    pair_name: string;
    pair_type: string;
    right: string;
    right2: string;
    right_url: string;
}
interface Data {
    fee:any,
    save_Cylinder_Pairs:any,
    save_Helper_list:any,
    save_Pair_result_store:{
        save_admin_set_result:boolean[],
        save_can_claim:boolean[],
        save_chips:any,
        save_lost_pair:any,
        save_pair:SavePair[],
        save_result:any,
        save_user:any
    },
    save_badges_list:any,
    save_helper_chance:any
}
const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY':`${diffusion.x_api_key}`}
};
const NOW_Network = "testnet";
const { Paragraph, Text } = Typography;
const  Tel_create_bet: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {setOpen(false);}

    const { account, signAndSubmitTransaction } =useWallet() ;
    const [user_profile,set_user_profile]=useState({
        name:'User',icon:'https://pot-124.4everland.store/user_badges.png'
    })
    const [all_pair_Data,set_all_pairdata]=useState<Data>();
    const [which , set_which ]= useState("");
    const [aliveable_pairs,set_aliveable_pairs]=useState<SavePair[]>([]);
    const [select_pairs,set_select_pair]=useState<SavePair[]>([]);
    const submit_transaction = async () => {
        if (!account) return [];
        if (user_profile.name === '') {
            set_user_profile({name:'User',icon: user_profile.icon})
        }
        if (user_profile.icon === '') {
            set_user_profile({name:user_profile.name,icon:'https://pot-124.4everland.store/user_badges.png'})
        }
        const transaction: InputTransactionData = {
            data: {
                function: diffusion.function.create_account_tree(),
                typeArguments: [],
                functionArguments: [user_profile.name,user_profile.icon]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;


            message.success(
                <span>
                            hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                        </span>
            )
            setOpen(false)
        } catch (error: any) {
            message.error(`please try again`)
        }
    }
    const fetch_data = async () =>{
        if (!account) return [];
            try{
                await fetch(`https://aptos-${NOW_Network}.nodit.io/v1/accounts/${account.address}/resource/${diffusion.function.diffusion_account_tree()}`, options)
                    .then(response => response.json())
                    .then((response) => {
                        if(response){
                            set_user_profile({
                                icon:response.data.save_1.icon,
                                name:response.data.save_1.name
                            })
                        }
                    }).catch(error =>{
                        console.log(error)
                        setOpen(true)

                     });
            }catch(e:any){
                console.log(`profile :${e}`)
            }


    }
    const fetc_pair_from_aptos = async()=>{
        //console.log('2')
        try{
           await fetch('https://aptos-testnet.nodit.io/v1/accounts/0x8e1610bc1fe8556c7e839f6afc1d420db7fa50fd7251adfb0e11aeb8516bae77/resource/0x7776f4ac2f3a13f751b966220b0e68e0b5688682c31e4f93cbf12ce1cea4a7b9%3A%3Ahelper%3A%3ADiffusion_store_tree', options)
                .then(response => response.json())
                .then(response => {
                    console.log('response.data :', response);
                    set_all_pairdata(response.data)

                }).catch(error => console.log(error))
        }catch (error:any){
            console.log(error)
        }
    }
    const select_pair = () =>{

            console.log('all_pairdata :', all_pair_Data);
            let new_pairs=[]  as  SavePair[];
            if(all_pair_Data != undefined){
                if(all_pair_Data.save_Pair_result_store.save_pair != undefined){
                    for (let i =0 ; i < ( all_pair_Data).save_Pair_result_store.save_pair.length;i++){

                        if(all_pair_Data.save_Pair_result_store.save_pair[i].can_bet as boolean ==true){
                            new_pairs.push(all_pair_Data.save_Pair_result_store.save_pair[i])
                            console.log(all_pair_Data.save_Pair_result_store.save_pair[i])
                        }
                    }
                    set_aliveable_pairs(new_pairs);
                    console.log(`all_pair_Data.save_pair:${(all_pair_Data)}`)
                    // console.log(`new_pairs :${new_pairs}`)
                    // console.log(`aliveable :${aliveable_pairs}`)
                }
            }

    }
    const solve_which_pair  =(key:string)=>{
        let new_pairs = [] as SavePair[];
        for(let i = 0 ; i < aliveable_pairs.length ; i++ ){
            let [first_part,d] = aliveable_pairs[i].pair_name.split(" vs ");
            let [secondPart ,thirdPart]= d.split(" - ");
            // console.log(first_part)
            // console.log(secondPart)
            if(thirdPart == key){
                new_pairs.push(aliveable_pairs[i])
            }
        }
        console.log(`new_pairs :${new_pairs.length}`)
        set_select_pair(new_pairs)
       // console.log(`new_pairs :${new_pairs}`)
    }
    const fetchData = async () => {
        console.log(1);
        await fetch_data(); // 等待 fetch_data 完成
        console.log(2);
        await fetc_pair_from_aptos(); // 等待 fetc_pair_from_aptos 完成
        console.log(3);
        // 确保所有数据都设置好后再调用 select_pair
        select_pair();
    };

    useEffect(() => {
        //console.log(`which : ${which}`)
        solve_which_pair(which)
    }, [which]);
    useEffect(() => {

        if (all_pair_Data && Object.keys(all_pair_Data).length > 0) {
            select_pair();
        }
    }, [all_pair_Data]);
    useEffect(() => {

        fetchData(); // 执行异步操作
    }, []);
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

                    <Content style={{backgroundColor:"#4F4F4F",height:"80vmax" }}>

                        <Row gutter={[24, 24]} style={{padding: 20}}>
                            <Col span={24}>
                                <div style={{
                                    height: "15vmax",
                                    width: "100%",
                                    backgroundColor: "#4F4F4F",
                                    borderRadius: 5
                                }}>
                                    <img src={user_profile.icon} alt={"user_icon"}></img>
                                    <Col span={12} offset={10}>
                                        {which == '' ? <>
                                            <p>{user_profile.name}</p>
                                        </> : <>
                                        <button onClick={() => {
                                                set_which('')
                                            }} className={"rainbow"} style={{position: "relative",transform:"translateY(-150%)"}}>
                                                never
                                            </button>
                                        </>}
                                    </Col>
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
                                            onClick={()=>{set_which("basketball")}}
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
                                {select_pairs.map((pair) => {return (<>
                                    <Tel_create_bet_box save_pair={pair}/>
                                </>)})}

                            </>}

                        </Row>


                    </Content>
                    <Footer style={{backgroundColor: "#6ee4c1", height: "10vmax",}}></Footer>
                    <Modal
                        disableEnforceFocus
                        disableAutoFocus
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        classes={""}
                        sx={{borderRadius: 60,paddingTop:10,paddingRight:3,paddingLeft:2,border:"white",'&:fouvu':{outline:'none'}}}
                    >
                        <Box sx={{width: "43vmax", height: "70vmax", backgroundColor: "white"}} className={""}>
                            <Row>
                                <Col span={24} >
                                    <Result
                                        status="error"
                                        title="Create Account first"
                                        subTitle="We wont have your diffusion account."
                                        style={{position:"relative",top:-30}}
                                    >
                                        <div className="desc">
                                            <Paragraph>
                                                <Text
                                                    strong
                                                    style={{
                                                        fontSize: 16,
                                                    }}
                                                >
                                                    Tell us your name and icon {<br/>}
                                                    (Dont want to tell us , is ok XD)
                                                </Text>
                                            </Paragraph>
                                            <Paragraph style={{paddingLeft: 50, paddingRight: 50}}>
                                                <motion.div
                                                    className={"box"}
                                                    whileHover={{scale: 1.05}}
                                                    whileTap={{scale: 0.9}}
                                                    transition={{type: "spring", stiffness: 400, damping: 25}}
                                                    onClick={() => submit_transaction()}
                                                >
                                                    <Image src={user_profile.icon} preview={false} width={160}   fallback="data:image/png;base64,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"
                                                    ></Image>
                                                </motion.div>
                                            </Paragraph>
                                            <Paragraph>
                                                Icon
                                                <Input onChange={(value)=>{
                                                    set_user_profile({name:user_profile.name,icon:value.target.value})
                                                }}></Input>
                                            </Paragraph>
                                            <Paragraph>
                                                Name
                                                <Input onChange={(value)=>{
                                                    set_user_profile({name:value.target.value,icon:user_profile.icon})
                                                }}></Input>
                                            </Paragraph>
                                        </div>
                                    </Result>
                                </Col>
                            </Row>
                        </Box>
                    </Modal>
                </div>
            </>

    );
};

export default Tel_create_bet;
