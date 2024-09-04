import React, {useEffect, useState} from 'react';

import {Card, Col} from "antd";


import Modal from "@mui/material/Modal";
import {Box} from "@mui/material";
import { motion } from 'framer-motion';
import Flip_card_small from "./flip_card_small";
import Flip_card_big from "./flip_big_card";




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
const random_url = [
    "https://images.unsplash.com/photo-1486162928267-e6274cb3106f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1545436864-cd9bdd1ddebc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1486162928267-e6274cb3106f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.pexels.com/photos/1006121/pexels-photo-1006121.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1808329/pexels-photo-1808329.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1905054/pexels-photo-1905054.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1078981/pexels-photo-1078981.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2832046/pexels-photo-2832046.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1933320/pexels-photo-1933320.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/672036/pexels-photo-672036.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1252871/pexels-photo-1252871.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/240526/pexels-photo-240526.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/132428/pexels-photo-132428.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2088206/pexels-photo-2088206.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1032652/pexels-photo-1032652.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2896668/pexels-photo-2896668.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3227984/pexels-photo-3227984.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1819634/pexels-photo-1819634.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2310641/pexels-photo-2310641.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2873992/pexels-photo-2873992.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2670898/pexels-photo-2670898.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2674062/pexels-photo-2674062.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3934512/pexels-photo-3934512.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1105189/pexels-photo-1105189.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3389536/pexels-photo-3389536.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1261731/pexels-photo-1261731.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3551227/pexels-photo-3551227.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1459534/pexels-photo-1459534.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/572780/pexels-photo-572780.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4064432/pexels-photo-4064432.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2825343/pexels-photo-2825343.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2724664/pexels-photo-2724664.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/27756675/pexels-photo-27756675.jpeg?auto=compress&cs=tinysrgb&w=800"
];

//const new_url=["https://images.pexels.com/photos/1933320/pexels-photo-1933320.jpeg?auto=compress&cs=tinysrgb&w=800"];
const Claim_card_user_page:React.FC<{result_data:Result_Data,profile_data:Profile}> = ({result_data,profile_data}) =>{

    const [open, setOpen] = React.useState(false);
    const [input_url,set_input_url]=useState<string>('');
    const handleClose = () => setOpen(false);

    useEffect(() => {
        //console.log(`result data ${result_data.save_can_claim}`)
        const randomIndex = Math.floor(Math.random()*random_url.length);
        const input_to_flip_card = random_url[randomIndex];
        set_input_url(input_to_flip_card);
    },[profile_data,result_data])
    return(
        <>
            <Col span={4}>
                <motion.div
                    animate={{x: [null, 0, 0], y: [null, 0, 0]}}
                    whileHover={{scale: [null, 1, 1], zIndex: 1000, position: 'relative' ,originX: 0.5,originY: 0.7,scaleX:4,scaleY:5}}
                    transition={{duration: 0.2}}
                >
                    <Card style={{width:100,height:100,position:"relative",top:-20}} onClick={() => {setOpen(true)}}>
                        <Col span={24} style={{height:10,width:10,position:"relative",right:32,top:-20}}><Flip_card_small  result_data={result_data} profile_data={profile_data} random_url={input_url}/></Col>
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
                    <Box sx={{width:300,heigth:500,position:"absolute",left:"-5%"}}>
                        <Flip_card_big  result_data={result_data} profile_data={profile_data} random_url={input_url}/>
                    </Box>
                </Modal>
            </Col>
        </>
    );
}

export default Claim_card_user_page;