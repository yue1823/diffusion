import Modal from "@mui/material/Modal";
import {Box} from "@mui/material";
import React, { useEffect, useState } from "react";
import {Col, Row } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import "../css_folder/App.css"
const Submit_wait_box:React.FC<{box_state1:boolean,box_state2:boolean}>=({box_state1,box_state2})=>{
    const [real_state ,set_real_state]=useState(false);
    const [animation,set_animation]=useState(false);
    const close =()=>{
       
        if(box_state2){
            set_real_state(false)
        }
    }
    useEffect(() => {
        set_real_state(box_state1)
    }, [box_state1]);
    useEffect(() => {
        if (box_state2) {
            set_animation(true)
            const timer = setTimeout(() => {
                set_real_state(false); // Close the box after 3 seconds
            }, 3000);
            return () => clearTimeout(timer); // Cleanup timeout if the component unmounts
        }
    }, [box_state2]);
    return(
        <>
            <Modal
                disableEnforceFocus
                disableAutoFocus
                open={real_state}
                onClose={close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                classes={""}
                sx={{
                    borderRadius: 60,
                    paddingTop: 3,
                    paddingRight: 3,
                    paddingLeft: 3,
                    border: "white",
                    '&:fouvu': {outline: 'none'},
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex"
                }}
            >
                <Box sx={{
                    width: "500px",
                    height: "520px",
                    backgroundColor: "#dfdfdf",
                    borderRadius: 5,
                    padding: 5,
                    paddingTop: 3,
                    border: "3mm ridge #CED4DA"
                }}>
                    <Row gutter={[24, 4]} style={{padding: 5, justifyContent: "center", alignItems: "center"}}>
                        <Col span={24} style={{height: "270px",backgroundColor:"",justifyContent: "center", alignItems: "center",display:"flex",paddingTop:10}}>
                            {animation ? <></> : <>
                                <RedoOutlined style={{ animation: 'spin 2s linear infinite'}}/>
                            </>}
                        </Col>
                        <Col span={24} style={{backgroundColor:"",height:170,paddingTop:10,border:"3mm inset"}}>
                            <p style={{fontSize:45,justifySelf:"center",alignSelf:"center"}}>Waiting Transaction !</p>
                        </Col>
                    </Row>
                </Box>
            </Modal>

        </>
    )
}

export {Submit_wait_box}