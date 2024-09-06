import {Col, Row} from 'antd';
import React, { useEffect, useState } from 'react';
import CountdownTimer from '../user/Count_time';
import { motion } from 'framer-motion';
import Modal from "@mui/material/Modal";
import {Box} from "@mui/material";
import { CloseOutlined } from '@ant-design/icons';
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
const  Tel_create_bet_box: React.FC <{save_pair:SavePair}> = ({save_pair}) => {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {setOpen(false);}
    const [pair_name,set_pair_name]= useState({
        left_name:'',
        right_name:'',
        pair_type:''
    });
    const solve_data = () =>{
        let [first_part,d] = save_pair.pair_name.split(" vs ");
        let [secondPart ,thirdPart]= d.split(" - ");
        set_pair_name({
            left_name:first_part,
            right_name:secondPart,
            pair_type:thirdPart
        })
    }


    useEffect(() => {
        solve_data()
       // console.log(save_pair.expired_time)
    }, []);
    return(
        <>
            <motion.div
                className={"box"}
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.9}}
                transition={{type: "spring", stiffness: 400, damping: 25}}
                onClick={()=>setOpen(true)}
            >
            <Col span={24}>
                <div style={{backgroundColor: "#6C6C6C", zIndex: 5, height: "17vmax", borderRadius: 20}}>
                    <Row style={{padding: 10}}>
                        <Col span={5}>
                            <Row gutter={[24, 10]}>
                                <Col span={24}>
                                    <img src={save_pair.left_url}
                                         style={{height: "7vmax", width: "7vmax", borderRadius: 10}}></img>
                                </Col>
                                <Col>
                                    <img src={save_pair.right_url}
                                         style={{height: "7vmax", width: "7vmax", borderRadius: 10}}></img>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={1}>
                            <div style={{border: "solid 1px", height: "15.2vmax", width: 1,borderColor:"#403f3f"}}></div>
                        </Col>
                        <Col span={16}>
                            <Row>
                                <Col span={22} offset={2}>
                                    <p style={{color: "#DFFFDF"}}>{pair_name.left_name} vs {pair_name.right_name}</p>
                                </Col>
                                <br/>
                                <br/>
                                <br/>
                                <Col span={22} offset={3}>
                                    <CountdownTimer expiredDate={save_pair.expired_time} yes_or_not={true}/>
                                </Col>
                            </Row>
                        </Col>

                    </Row>

                    <br/>

                </div>
            </Col>
            </motion.div>
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
                    <motion.div
                        className={"box"}
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.91}}
                        transition={{type: "spring", stiffness: 100, damping: 50}}
                        onClick={() => setOpen(true)}
                    >
                        <CloseOutlined style={{fontSize: 30}}/>
                    </motion.div>
                    <Row>
                        <Col span={4}>
                            aaa
                        </Col>
                    </Row>

                </Box>
            </Modal>
        </>
    )
}

export default Tel_create_bet_box;