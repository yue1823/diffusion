
import {Col, Collapse, Row, theme, Image, Card, Segmented, Button} from "antd";
import React, {ReactNode, useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import { ToastContainer, toast } from "react-toastify";
import {  Container } from "reactstrap"; // 假設你使用了 reactstrap
import {Content} from "antd/lib/layout/layout";
import APT_logo from "../logo/aptos-apt-logo.svg"
import '../css_/rainbow_button.css';
import { motion } from "framer-motion";
import {Box} from "@mui/material";
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
const Helper_upload_box:React.FC<{left_url:string,right_url:string,pair_name_left:string,pair_name_right:string }> = ({ left_url,right_url,pair_name_left,pair_name_right}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
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
                            <Col>

                            </Col>
                        </Row>
                    </Card>
                </motion.div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={box_style}>
                        <Row gutter={[18,36]}>
                            <Col span={18}>
                                <Card title={<span> <h1>{pair_name_left}     VS     {pair_name_right} </h1></span>} style={{height:320 ,backgroundColor:"#d5d2d2",borderRadius: 10}}>
                                    <Row>
                                        <Col span={10}>
                                            <Image src={left_url} alt={`left_img`} preview={false} style={{height:120,width:120,borderRadius: 10,position:"relative",top:-10}}> </Image>
                                        </Col>
                                    </Row>

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
                                    <button className={"rainbow"}>
                                        {pair_name_left}
                                    </button>
                                </motion.div>
                            </Col>
                            <Col span={8}>
                                <motion.div className={"box"}
                                            whileHovwe={{scale: 1.5}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}>
                                    <button className={"rainbow"}>
                                        Middle
                                    </button>
                                </motion.div>
                            </Col>
                            <Col span={8}>
                                <motion.div className={"box"}
                                            whileHovwe={{scale: 1.5}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}>
                                    <button className={"rainbow"}>
                                        {pair_name_right}
                                    </button>
                                </motion.div>
                            </Col>
                        </Row>

                    </Box>
                </Modal>
            </Col>
        </>
    );
};


export default Helper_upload_box;