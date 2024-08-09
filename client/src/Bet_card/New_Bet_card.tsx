
import {Card, Col, Image, Row, Statistic, theme} from "antd";
import React, {useEffect, useState} from 'react';
import { motion } from "framer-motion";
import Modal from "@mui/material/Modal";
import {Box} from "@mui/material";
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


const New_Bet_page:React.FC<{left_url:string,right_url:string,pair_name_left:string,pair_name_right:string ,balance:string }> = ({left_url,right_url,pair_name_left,pair_name_right,balance }) => {
    const [open, setOpen] = React.useState(false);
    const [inpu_value,set_input_value]=useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const max_button = () => set_input_value(balance);
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
                    <Box sx={box_style} className={""}>
                        <Row gutter={[24,8]}>
                            <Col span={16}>
                                <Card  style={{borderRadius: 10,backgroundColor:"#f3f3f3" ,height:290}}>
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

                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Box>
                </Modal>
            </Col>
        </>
    );
}

export default New_Bet_page;