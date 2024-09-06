
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
import Tel_create_bet_box from './telegrame_bet_box';

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
const  Tel_create_bet: React.FC = () => {
    const { account } =useWallet() ;
    const [user_profile,set_user_profile]=useState({
        name:'',icon:''
    })
    const [all_pair_Data,set_all_pairdata]=useState<Data>();
    const [which , set_which ]= useState("");
    const [aliveable_pairs,set_aliveable_pairs]=useState<SavePair[]>([]);
    const [select_pairs,set_select_pair]=useState<SavePair[]>([]);
    const fetch_data = async () =>{
        if (!account) return [];
            try{
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
            }catch(e:any){
                console.log(`profile :${e}`)
            }
            try{
                fetch('https://aptos-testnet.nodit.io/v1/accounts/0x8e1610bc1fe8556c7e839f6afc1d420db7fa50fd7251adfb0e11aeb8516bae77/resource/0x7776f4ac2f3a13f751b966220b0e68e0b5688682c31e4f93cbf12ce1cea4a7b9%3A%3Ahelper%3A%3ADiffusion_store_tree', options)
                    .then(response => response.json())
                    .then(response => {
                        //console.log(`response.data :${response.data}`)
                        set_all_pairdata(response.data);
                        let new_pairs=[]  as  SavePair[];
                        if(all_pair_Data){
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

                    }).catch(error => console.log(error))
            }catch (error:any){
                console.log(error)
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
    useEffect(() => {
        //console.log(`which : ${which}`)
        solve_which_pair(which)
    }, [which]);
    useEffect(() => {


    }, [all_pair_Data]);
    useEffect(() => {
        fetch_data();
        console.log(1)
    }, [account]);

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
                </div>
            </>

    );
};

export default Tel_create_bet;
