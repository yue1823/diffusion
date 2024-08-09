
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
const Helper_upload_box:React.FC<{left_url:string,right_url:string }> = ({ left_url,right_url}) => {
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
                        <Row gutter={[26,26]} style={{position:"relative",right:10}}>
                            <Col span={8}>
                                <motion.div className={"box"}
                                            whileHovwe={{scale: 1.5}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}>
                                    <button className={"rainbow"}>
                                        Display toast
                                    </button>
                                </motion.div>
                            </Col>
                            <Col span={8}>
                                <motion.div className={"box"}
                                            whileHovwe={{scale: 1.5}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}>
                                    <button className={"rainbow"}>
                                        Display toast
                                    </button>
                                </motion.div>
                            </Col>
                            <Col span={8}>
                                <motion.div className={"box"}
                                            whileHovwe={{scale: 1.5}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}>
                                    <button className={"rainbow"}>
                                        Display toast
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