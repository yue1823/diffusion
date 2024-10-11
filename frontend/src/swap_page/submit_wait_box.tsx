import Modal from "@mui/material/Modal";
import {Box} from "@mui/material";
import React, { useEffect, useState , useRef} from "react";
import {Col, Row } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import lottie from 'lottie-web';
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
            }, 10000);
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
                    border: "3mm ridge #CED4DA",
                    overflow:"hidden"
                }}>
                    <Row gutter={[24, 4]} style={{padding: 5, justifyContent: "center", alignItems: "center"}}>
                        <Col span={24} style={{height: "270px",backgroundColor:"",justifyContent: "center", alignItems: "center",display:"flex",paddingTop:10}}>
                            {animation ? <><AnimationComponent/></> : <>
                                <RedoOutlined style={{ animation: 'spin 2s linear infinite'}}/>
                            </>}
                        </Col>
                        <Col span={24} style={{backgroundColor:"",height:170,paddingTop:10,border:"3mm inset"}}>
                            <p style={{fontSize:45,justifySelf:"center",alignSelf:"center"}}>{!animation ? "Waiting Transaction !":"Finished"}</p>
                        </Col>
                    </Row>
                </Box>
            </Modal>

        </>
    )
}

export {Submit_wait_box}

const AnimationComponent: React.FC = () => {
    const svgContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (svgContainerRef.current) {
            const animItem = lottie.loadAnimation({
                container: svgContainerRef.current,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                path: 'https://dev.anthonyfessy.com/check.json',
            });

            // Cleanup the animation when the component unmounts
            return () => animItem.destroy();
        }
    }, []);

    return (
        <div
            id="svgContainer"
            ref={svgContainerRef}
            style={{
                margin: 0,
                padding: 0,
                maxWidth: '100%',
                maxHeight: '100%',
                width:"500px",
                height:"500px",
                transform: 'scale(6) translateX(10)', // 使用 scale 放大
                transformOrigin: 'left', // 放大效果从中心开始
                position: 'absolute',
                top: 0,
                left: -40,
                right: 0,
                bottom: 0,
                textAlign: 'center',
                mixBlendMode: 'multiply', // 使白色透明
            }}
        ></div>
    );
};