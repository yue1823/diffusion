
import {Col, Collapse, Row, theme, Image, Card, Segmented, Button, Statistic, message} from "antd";
import React, {ReactNode, useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import {ToastContainer, toast, Bounce} from "react-toastify";
import {  Container } from "reactstrap"; // 假設你使用了 reactstrap
import {Content} from "antd/lib/layout/layout";
import APT_logo from "../logo/aptos-apt-logo.svg"

import '../css_/rainbow_button.css';
import "../css_/helper_vs_box_.css"
import { motion } from "framer-motion";
import {Box} from "@mui/material";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
const box_style = {
    position: 'absolute' as 'absolute',

    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    borderRadius: 10,
    backgroundColor:"#ffffff",
    height:450,
    boxShadow: 2,
    p: 4,
};
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

const module_address="0xd3d2a6b4340d87ea390368ddcab692cf4b330c86fb5daaa2609e1052c20ca873";
const Helper_upload_box:React.FC<{left_url:string,right_url:string,pair_name_left:string,pair_name_right:string ,pool:string,expired_time:string}> = ({ left_url,right_url,pair_name_left,pair_name_right,pool,expired_time}) => {
    const { account, signAndSubmitTransaction } =useWallet() ;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [which1,setwhich1]=useState('');
    const submit_transaction = async (key:string) => {
        setwhich1(key)
        const transaction: InputTransactionData = {
            data: {
                function: `${module_address}::helper::helper_upload_result`,
                functionArguments: [`${pair_name_left} vs ${pair_name_right}` ,which1,expired_time ]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;
            // message.success(
            //
            // )
            toast.success(<span>
                        hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                    </span>, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

        } catch (error: any) {
            console.log(error);
            message.error(`please try again`);
        } finally {

        }
    }

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
                        <Row>
                            <Col span={24}>
                                <Row>
                                    <Col span={10}>
                                        <Image src={left_url} alt={`left_img`} preview={false} style={{height:120,width:120,borderRadius: 10,position:"relative"}}> </Image>
                                    </Col>
                                    <Col offset={4} span={10} >
                                        <Image src={right_url} alt={`right_img`} preview={false} style={{height:120,width:120,borderRadius: 10,position:"relative"}}> </Image>
                                    </Col>
                                </Row>
                            </Col>
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
                        <Row gutter={[18,36]}>
                            <Col span={18}>
                                <Card title={<span> <h1>{pair_name_left}     VS     {pair_name_right} </h1></span>} style={{height:320 ,backgroundColor:"#d5d2d2",borderRadius: 10}} >
                                    <Row>
                                        <Col span={10}>
                                            <Image src={left_url} alt={`left_img`} preview={false} style={{height:120,width:120,borderRadius: 10,position:"relative",top:-10}}> </Image>
                                        </Col>
                                    </Row>
                                        <div className={"split-line"}></div>
                                    <Row>
                                        <Col offset={16} span={10} >
                                            <Image src={right_url} alt={`right_img`} preview={false} style={{height:120,width:120,borderRadius: 10,position:"relative",top:-10}}> </Image>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={24}>
                                        <Card style={{height:150 ,backgroundColor:"#d5d2d2",borderRadius: 10}}>
                                            <Row>
                                                <Col span={24}>
                                                    <div style={{
                                                        backgroundColor: "white",
                                                        height: 120,
                                                        width: 90,
                                                        position: "relative",
                                                        right: 10,
                                                        top: -10,
                                                        borderRadius: 10
                                                    }}>
                                                        <p style={{position: "relative", height: 20, width: 100,top:70,left:-4}}>
                                                            <h1>APT</h1></p>
                                                    </div>
                                                    <Statistic
                                                        value={pool}
                                                            precision={2}
                                                            valueStyle={{color:"#3f8600"}}
                                                            title={"Pool"}
                                                            style={{position:"relative",top:-120}}
                                                    ></Statistic>

                                                </Col>
                                            </Row>

                                        </Card>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col span={24}>
                                        <Card style={{height:150 ,backgroundColor:"#d5d2d2",borderRadius: 10}}>

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
                                            transition={{type: "spring", stiffness: 400, damping: 25}}>
                                    <button className={"rainbow"} onClick={() => submit_transaction("1")}>
                                        {pair_name_left}
                                    </button>
                                </motion.div>
                            </Col>
                            <Col span={8}>
                                <motion.div className={"box"}
                                            whileHovwe={{scale: 1.5}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}>
                                    <button className={"rainbow"} onClick={() => submit_transaction("2")}>
                                        Middle
                                    </button>
                                </motion.div>
                            </Col>
                            <Col span={8}>
                                <motion.div className={"box"}
                                            whileHovwe={{scale: 1.5}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}>
                                    <button className={"rainbow"} onClick={() => submit_transaction("3")}>
                                        {pair_name_right}
                                    </button>
                                </motion.div>
                            </Col>
                        </Row>
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
                    </Box>
                </Modal>
            </Col>
        </>
    );
};


export default Helper_upload_box;