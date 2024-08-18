import React, {useEffect, useState} from 'react';
import {Content} from "antd/lib/layout/layout";
import Swap_box from "../swap_page/swap_box";
import {Router} from "react-router-dom";
import {Card, Col, ConfigProvider, Row ,Tree} from "antd";
import Aka from "../Small_box/aka";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
import type { TreeDataNode } from 'antd';
import Modal from "@mui/material/Modal";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {Box} from "@mui/material";
import { motion } from 'framer-motion';
import Flip_card_small from "./flip_card_small";

const diffusion_address = "0x3ec4c1b27a5466be2c45f3a9b134634d9e394979b3d157c60e385e714267e0ca";
const NOW_Network = "testnet";
const aptosConfig = new AptosConfig({ network: Network.TESTNET});
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
interface Bet_card_data{
    a_win:string;
    b_win:string;
    c_win:string;
    bet:string;
    expired_time:string;
    pair:SavePair;
    time:string;
    which:string;
}
interface Result_Data{
    save_data1:Bet_card_data;
    save_can_claim:boolean;
    save_result:string;
}
interface Bet_card_data{
    a_win:string;
    b_win:string;
    c_win:string;
    bet:string;
    expired_time:string;
    pair:SavePair;
    time:string;
    which:string;
}
interface Badges{
    name : string;
    url : string;
}
interface Profile{
    save_icon:{
        icon:string;
        name:string;
    };
    save_bet_card:Bet_card_data[];
    save_badges:Badges[];
    save_level:{
        diffusion_point:string;
        level:string;
        lose:string;
        win:string;
    }

}
const Claim_card_user_page:React.FC<{result_data:Result_Data,profile_data:Profile}> = ({result_data,profile_data}) =>{
    const { account, signAndSubmitTransaction } = useWallet();
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);

    useEffect(() => {


    },[])
    return(
        <>
            <Col span={4}>
                <motion.div
                    animate={{x: [null, 0, 0], y: [null, 0, 0]}}
                    whileHover={{scale: [null, 1, 1], zIndex: 1000, position: 'relative' ,originX: 0.5,originY: 0.7,scaleX:4,scaleY:5}}
                    transition={{duration: 0.2}}
                >
                    <Card style={{width:100,height:100,position:"relative",top:-20}} onClick={value => {setOpen(true)}}>
                        <Col span={24} style={{height:10,width:10,position:"relative",right:32,top:-20}}><Flip_card_small  result_data={result_data} profile_data={profile_data}/></Col>
                    </Card>
                </motion.div>
                <Modal
                    disableEnforceFocus
                    disableAutoFocus
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    classes={""}
                    sx={{borderRadius: 60,p:4,border:"white",'&:fouvu':{outline:'none'}}}
                >
                    <Box>

                    </Box>
                </Modal>
            </Col>
        </>
    );
}

export default Claim_card_user_page;