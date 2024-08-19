
import {Card, Col, Image, Input, message, Row, Statistic, theme} from "antd";
import React, {useEffect, useState} from 'react';
import { motion } from "framer-motion";
import Modal from "@mui/material/Modal";
import {Box} from "@mui/material";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
import "../css_/user_bet_box.css"
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
const box_style = {
    position: 'absolute' as 'absolute',

    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    borderRadius: 10,
    backgroundColor:"#dfdace",
    height:470,
    boxShadow: 2,
    p: 4,
};
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);
const moduleAddress = '0xd3d2a6b4340d87ea390368ddcab692cf4b330c86fb5daaa2609e1052c20ca873'

const New_Bet_card:React.FC<{left_url:string,right_url:string,pair_name_left:string,pair_name_right:string ,balance:string ,left:string,middle:string,right :string,expired_time:string}> = ({left_url,right_url,pair_name_left,pair_name_right,balance,left,right,middle,expired_time }) => {
    const { account, signAndSubmitTransaction } = useWallet();
    const [open, setOpen] = React.useState(false);
    const [input_value,set_input_value]=useState("0");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const max_button = () => set_input_value(balance);
    const check_before_submit = (key:string)=>{

        const a = parseFloat(input_value);
        try{
            if( a == 0){
                return message.error(`please enter input amount`)
            }
            console.log(a)
        }catch (error:any){
            console.log(error)
        }

        submit_transaction(key).then(r => console.log(r));
    }
    const submit_transaction = async (key:string) => {
        if (!account) return [];
        const regex = /^\d+(\.\d{1,2})?$/;
        if(regex.test(input_value)){

            let result = `${pair_name_left} vs ${pair_name_right}`;
            const now =new Date();
            const day = String(now.getDate()).padStart(2,'0');
            const month = String(now.getMonth()+1).padStart(2,'0');
            const year = String(now.getFullYear());

            const transaction:InputTransactionData = {
                data: {
                    function:`${moduleAddress}::helper::create_bet_card`,
                    typeArguments:[],
                    functionArguments:[parseFloat(input_value)*100000000,`${day}${month}${year}`,key,result,expired_time]
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

            } catch (error: any) {
                message.error(`please try again`)
            }
        }else{
            message.error(`please input right number`)
        }
    }
    useEffect(() => {

    },[]);
    return (
        <>
            <Col span={8}>
                <motion.div
                    animate={{x: [null, 100, 0], y: [null, 100, 0]}}
                    whileHover={{scale: [null, 1.5, 1.4], zIndex: 1000, position: 'relative'}}
                    transition={{duration: 0.3}}
                >
                    <Card style={{height: 180}} onClick={value => {
                        setOpen(true)
                    }}>
                        <Row style={{position:"relative",top:-10}}>
                            <Col span={10} offset={2}>
                                <Image preview={false} src={left_url} style={{height:100,width:100,borderRadius: 10}}></Image>
                            </Col>
                            <Col span={10} offset={2}>
                                    <Image preview={false} src={right_url} style={{height:100,width:100,borderRadius: 10}}></Image>
                            </Col>
                        </Row>
                        <div ></div>
                        <Row gutter={[24,24]}>
                            <Col span={8}><div style={{backgroundColor:"black",width:80,height:45,color:"white",borderRadius: 10,}}><div style={{position:"relative",backgroundColor:"white",height:35,width:65,borderRadius: 7,color:"blue",top:5,left:7}}><span style={{position:"relative",fontSize:25,left:10,top:-1}}>{left}</span></div></div></Col>
                            <Col span={8}><div style={{backgroundColor:"black",width:80,height:45,color:"white",borderRadius: 10,}}><div style={{position:"relative",backgroundColor:"white",height:35,width:65,borderRadius: 7,color:"green",top:5,left:7}}><span style={{position:"relative",fontSize:25,left:10,top:-1}}>{middle}</span></div></div></Col>
                            <Col span={8}><div style={{backgroundColor:"black",width:80,height:45,color:"white",borderRadius: 10,}}><div style={{position:"relative",backgroundColor:"white",height:35,width:65,borderRadius: 7,color:"red",top:5,left:7}}><span style={{position:"relative",fontSize:25,left:10,top:-1}}>{right}</span></div></div></Col>
                        </Row>
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
                    <Box sx={box_style} className={"warm-card"}>
                        <Row gutter={[24,8]}>
                            <Col span={16}>
                                <Card  style={{borderRadius: 10,backgroundColor:"#f3f3f3" ,height:290}} >
                                    <Row>
                                        <Col span={10}>
                                            <Image src={left_url} alt={`left_img`} preview={false} style={{height:120,width:120,borderRadius: 10,position:"relative",top:-10,right:10}}> </Image>
                                        </Col>
                                    </Row>
                                    <div className={"split-line_user_box"}></div>
                                    <Row>
                                        <Col offset={16} span={10} >
                                            <Image src={right_url} alt={`right_img`} preview={false} style={{height:120,width:120,borderRadius: 10,position:"relative",top:10,right:10}}> </Image>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col span={24}>
                                        <Card style={{height: 60}}>
                                            <h3 style={{
                                                position: "relative",
                                                top: -10, right:5
                                            }}>{pair_name_left} VS {pair_name_right}</h3>
                                        </Card>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col span={24}>

                                        <Card style={{height: 90}} onClick={max_button}>
                                            <h3 style={{
                                                position: "relative",
                                                top: -15,
                                                right: 5
                                            }}>Balance :</h3>
                                            <motion.div className={"box"}
                                                        whileHovwe={{scale: 1.5}}
                                                        whileTap={{scale: 0.9}}
                                                        transition={{type: "spring", stiffness: 400, damping: 25}}>
                                                <Statistic
                                                    value={balance}
                                                    precision={2}
                                                    valueStyle={{color: "#3f8600"}}
                                                    style={{position: "relative", top: -10, right: 5}}
                                                ></Statistic>
                                            </motion.div>

                                        </Card>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col span={24}>
                                        <Card style={{height: 110, position: "relative", top: -5}}>
                                            <h3 style={{position: "relative", right: 5}}>APT Amount</h3>
                                            <Input placeholder="0.00" prefix={"$"} onChange={input=>{
                                                set_input_value(input.target.value);
                                            }} style={{position: "relative",top:10 , right: 5}} value={input_value}></Input>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <br/>
                        <Row gutter={[26,26]} style={{}}>
                            <Col span={8}>
                                <motion.div className={"box"}
                                            whileHovwe={{scale: 1.5}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}
                                            >
                                    <button className={"rainbow"} style={{height:100}} onClick={() =>check_before_submit("1")}>
                                        <Row>
                                            <Col offset={2} span={20}><p style={{fontSize:20}}>{pair_name_left}</p></Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>   <div style={{backgroundColor:"white",height:40,borderRadius: 10,color:"blue"}}>
                                                    <p style={{fontSize:20}}><h3>{left}</h3></p>
                                            </div>
                                            </Col>
                                        </Row>

                                    </button>
                                </motion.div>
                            </Col>
                            <Col span={8}>
                                <motion.div className={"box"}
                                            whileHovwe={{scale: 1.5}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}

                                >
                                    <button className={"rainbow"} style={{height:100}} onClick={() =>check_before_submit("2")}>
                                        <Row>
                                            <Col offset={2} span={20}><p style={{fontSize:20}}>Middle</p></Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>   <div style={{backgroundColor:"white",height:40,borderRadius: 10,color:"green"}}>
                                                <p style={{fontSize:20}}><h3>{middle}</h3></p>
                                            </div>
                                            </Col>
                                        </Row>
                                    </button>
                                </motion.div>
                            </Col>
                            <Col span={8}>
                                <motion.div className={"box"}
                                            whileHovwe={{scale: 1.5}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}
                                            >
                                    <button className={"rainbow"} style={{height:100}}  onClick={() =>check_before_submit("3")}>

                                        <Row>
                                            <Col offset={2} span={20}><p style={{fontSize:20}}>{pair_name_right}</p></Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>   <div style={{backgroundColor:"white",height:40,borderRadius: 10,color:"red"}}>
                                                <p style={{fontSize:20}}><h3>{right}</h3></p>
                                            </div>
                                            </Col>
                                        </Row>
                                    </button>
                                </motion.div>
                            </Col>
                        </Row>
                    </Box>
                </Modal>
            </Col>
        </>
    );
}

export default New_Bet_card;