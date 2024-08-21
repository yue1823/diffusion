
import {Card, Col, Image, Input, List, message, Row, Statistic, Steps, theme} from "antd";
import React, {useEffect, useState} from 'react';
import { motion } from "framer-motion";
import Modal from "@mui/material/Modal";
import {Box} from "@mui/material";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
import "../css_/user_bet_box.css"
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
import Apt_logo from "../art/Aptos_mark_BLK.svg";
import {CheckCircleOutlined, LoadingOutlined, RedEnvelopeOutlined} from "@ant-design/icons";
const box_style = {
    position: 'absolute' as 'absolute',

    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    borderRadius: 10,
    backgroundColor:"#dfdace",
    height:"auto",
    boxShadow: 2,
    p: 4,
};

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);
const moduleAddress = '0xd3d2a6b4340d87ea390368ddcab692cf4b330c86fb5daaa2609e1052c20ca873'

const New_Bet_card:React.FC<{left_url:string,right_url:string,pair_name_left:string,pair_name_right:string ,balance:string ,left:string,middle:string,right :string,expired_time:string,type:string}> = ({left_url,right_url,pair_name_left,pair_name_right,balance,left,right,middle,expired_time ,type}) => {
    const { account, signAndSubmitTransaction } = useWallet();
    const [open, setOpen] = React.useState(false);
    const [input_value,set_input_value]=useState("0");
    const [amount_value,set_amount_value]=useState<string>('0');
    const [step_number,set_step_number]=useState(0);
    const [img_url,set_url]=useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => {setOpen(false);set_step_number(0);set_url('');}
    const max_button = () => {set_input_value(balance);set_step_number(1); const a =(parseFloat(balance)*0.1).toFixed(2);
        set_amount_value( a.toString())}
    const data = [
        {label: 'Diffusion fees charge 10%',value:amount_value},
        {label: 'Expected bet ',value:input_value},

    ];
    const deal_with_data = () =>{
        // console.log(type)
        if(type == "LOL"){
            set_url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0VpH-N1NOHdimdcSfEircXcQIMt7ehmpvSg&s");
        } else if(type == "football"){
            set_url("data:image/jpeg;base64,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")
        } else if(type == "basketball"){
            set_url("data:image/png;base64,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")
        }
    }

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
            message.error(`Only allow x.xx APT (3)`)
        }
    }
    useEffect(() => {
        deal_with_data()
    },[type]);
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
                    <Box sx={box_style} className={""} >
                        {/*{ing_url != '' &&(<Col style={{*/}
                        {/*    backgroundColor: "rgb(51,60,223)",*/}
                        {/*    left: -2,*/}
                        {/*    height: 30,*/}
                        {/*    position: "absolute",*/}
                        {/*    top: -5,*/}
                        {/*    width: 680,*/}
                        {/*    borderRadius: 4*/}
                        {/*}}>*/}
                        {/*    <img*/}
                        {/*        style={{position: "absolute", left: -1}}*/}
                        {/*        src={ing_url}></img>*/}
                        {/*    <img*/}
                        {/*        style={{position: "absolute", left: 80}}*/}
                        {/*        src={ing_url}></img>*/}
                        {/*    <img*/}
                        {/*        style={{position: "absolute", left: 160}}*/}
                        {/*        src={ing_url}></img>*/}
                        {/*    <img*/}
                        {/*        style={{position: "absolute", left: 240}}*/}
                        {/*        src={ing_url}></img>*/}
                        {/*    <img*/}
                        {/*        style={{position: "absolute", left: 320}}*/}
                        {/*        src={ing_url}></img>*/}
                        {/*    <img*/}
                        {/*        style={{position: "absolute", left: 400}}*/}
                        {/*        src={ing_url}></img>*/}
                        {/*    <img*/}
                        {/*        style={{position: "absolute", left: 480}}*/}
                        {/*        src={ing_url}></img>*/}
                        {/*    <img*/}
                        {/*        style={{position: "absolute", left: 575}}*/}
                        {/*        src={ing_url}></img>*/}
                        {/*</Col>)}*/}

                        <Row gutter={[24, 8]}>

                            <Col span={24}>
                                <Card style={{height: 50}}>
                                <Steps
                                        style={{position:"relative",top:-15}}
                                        current={step_number}
                                        items={[
                                            {
                                                title: 'Bet some apt',
                                                icon:<RedEnvelopeOutlined />,
                                            },
                                            {
                                                title: 'Pay',
                                                icon:<LoadingOutlined />,
                                            },
                                            {
                                                title: 'Done',
                                                icon:<CheckCircleOutlined />,
                                            },
                                        ]}
                                    />

                                </Card>
                            </Col>
                            <Col span={16}>
                                <Card  style={{borderRadius: 10,backgroundColor:"#f3f3f3" ,height:290,backgroundImage: `url(${img_url})`, // 设置背景图片
                                    backgroundSize: "cover", // 图片大小适应内容
                                    backgroundRepeat: "no-repeat", // 不重复显示图片
                                    backgroundPosition: "center", // 图片居中显示
                                    opacity: 0.9 }} >

                                    <Row>
                                        <Col span={10}>
                                            <Image src={left_url} alt={`left_img`} preview={false} style={{height:120,width:120,borderRadius: 10,position:"relative",top:-10,right:10}}> </Image>
                                        </Col>
                                    </Row>

                                        {/*<p style={{position:"absolute" ,left:290 ,top:15}}>{type}</p>*/}

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
                                        <Card style={{height: 40}}>
                                            <h3 style={{
                                                position: "relative",
                                                top: -15, right:5
                                            }}>{pair_name_left} VS {pair_name_right}</h3>
                                        </Card>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col span={24}>
                                        <Card style={{height: 50}}>
                                            <h3 style={{
                                                position: "relative",
                                                top: -15, right:5
                                            }}>{`${expired_time.slice(0,2)}/${expired_time.slice(2,4)}/${expired_time.slice(4,8)}`}</h3>
                                        </Card>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col span={24}>

                                        <Card style={{height: 70}} onClick={max_button}>
                                            <h3 style={{
                                                position: "relative",
                                                top: -20,
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
                                                    style={{position: "relative", top: -20, right: 5}}
                                                ></Statistic>
                                            </motion.div>

                                        </Card>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col span={24}>
                                        <Card style={{height: 80, position: "relative", top: -5}}>
                                            <h3 style={{position: "relative", right: 5,top:-15}}>APT Amount</h3>
                                            <Input placeholder="0.00" prefix={"$"} onChange={input=>{
                                                set_input_value(input.target.value);
                                                set_step_number(1);
                                                const a =parseFloat(input.target.value)*0.1
                                                set_amount_value( a.toString())
                                            }} style={{position: "relative",top:-10 , right: 5}} value={input_value}></Input>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <br/>
                        <Row gutter={[26,26]} style={{}}>
                            {step_number > 0 && (<>
                                <Col span={24}>
                                    <List
                                        size={"small"}

                                        header={<div>Fees (APT) <span style={{float: 'right' ,width:20,height:20}}><img alt={"apt_logo"} src={Apt_logo}></img></span></div>}
                                        footer={<div>Total cost: <span style={{float: 'right'}}>{(parseFloat(amount_value)+parseFloat(input_value)).toFixed(2).toString()}</span></div>}
                                        bordered
                                        dataSource={data}
                                        style={{backgroundColor:"white"}}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                    <span>{item.label}</span>
                                                    {item.value}
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </Col>
                            </>)}

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
                                    {/*{ing_url != '' &&(<Col style={{*/}
                                    {/*    backgroundColor: "rgb(51,60,223)",*/}
                                    {/*    left: -395,*/}
                                    {/*    height: 30,*/}
                                    {/*    position: "absolute",*/}
                                    {/*    top: 120,*/}
                                    {/*    width: 10000,*/}
                                    {/*    borderRadius: 4*/}
                                    {/*}}>*/}
                                    {/*    <img*/}
                                    {/*        style={{position: "absolute", left: -1}}*/}
                                    {/*        src={ing_url}></img>*/}
                                    {/*    <img*/}
                                    {/*        style={{position: "absolute", left: 80}}*/}
                                    {/*        src={ing_url}></img>*/}
                                    {/*    <img*/}
                                    {/*        style={{position: "absolute", left: 160}}*/}
                                    {/*        src={ing_url}></img>*/}
                                    {/*    <img*/}
                                    {/*        style={{position: "absolute", left: 240}}*/}
                                    {/*        src={ing_url}></img>*/}
                                    {/*    <img*/}
                                    {/*        style={{position: "absolute", left: 320}}*/}
                                    {/*        src={ing_url}></img>*/}
                                    {/*    <img*/}
                                    {/*        style={{position: "absolute", left: 400}}*/}
                                    {/*        src={ing_url}></img>*/}
                                    {/*    <img*/}
                                    {/*        style={{position: "absolute", left: 480}}*/}
                                    {/*        src={ing_url}></img>*/}
                                    {/*    <img*/}
                                    {/*        style={{position: "absolute", left: 575}}*/}
                                    {/*        src={ing_url}></img>*/}
                                    {/*</Col>)}*/}
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