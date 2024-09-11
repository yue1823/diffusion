import {Col, Image, Input, Row, message,} from 'antd';
import React, { useEffect, useState } from 'react';
import CountdownTimer from '../user/Count_time';
import { motion } from 'framer-motion';
import Modal from "@mui/material/Modal";
import {Box} from "@mui/material";
import { CloseOutlined } from '@ant-design/icons';
import {InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react';
import {Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import APT_logo from "../art/Aptos_mark_BLK.svg";
import { diffusion } from '../setting';
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
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

const   Is_telegrame_web_app_bet_box: React.FC <{save_pair:SavePair}> = ({save_pair}) => {
    const { account, signAndSubmitTransaction } =useWallet() ;
    const [open, setOpen] = React.useState(false);
    const [transactiom_data,set_transactiom_data]=useState({
        choose:'',
        amount:0,
    })
    const handleClose = () => {setOpen(false);
        set_transactiom_data(
            {choose:'',
                amount:0
            })}
    const [balance , set_balance]=useState('0');
    const [pair_name,set_pair_name]= useState({
        left_name:'',
        right_name:'',
        pair_type:''
    });
    const submit_transaction = async() =>{
        let key= 0 ;
        if(transactiom_data.choose === ''){
            message.error("Choose one")
            return
        }
        if(transactiom_data.amount === 0){
            message.error("Don't enter 0 APT")
            return
        }

        if(transactiom_data.choose === pair_name.left_name){
            key = 1 ;
        }else if (transactiom_data.choose === pair_name.right_name){
            key = 3;
        }else if (transactiom_data.choose === "middle"){
            key = 2;
        }
        const regex =  /^-?\d+(\.\d{1,3})?$/;
        if(regex.test(transactiom_data.amount.toString())){}else{
            message.error("Only allow 0.xxx APT")
            return
        }
        const now =new Date();
        const day = String(now.getDate()).padStart(2,'0');
        const month = String(now.getMonth()+1).padStart(2,'0');
        const year = String(now.getFullYear());

        const transaction:InputTransactionData = {
            data: {
                function:diffusion.function.create_bet_card(),
                typeArguments:[],
                functionArguments:[transactiom_data.amount*100000000,`${day}${month}${year}`,key,save_pair.pair_name,save_pair.expired_time]
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
    }
    const get_account_balance = async() => {
        if (!account) return [];
        const new_balance = await aptos.account.getAccountAPTAmount({accountAddress:account.address})
        if(new_balance != null || new_balance != undefined){
            set_balance((new_balance/100000000).toFixed(2).toString())
        }
    }
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
        get_account_balance()
        // console.log(save_pair.expired_time)
    }, [save_pair]);
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
                    <div style={{backgroundColor: "#6C6C6C", zIndex: 5, height: "17vmax",width:"72vmax", borderRadius: 20}}>
                        <Row style={{padding:7,paddingLeft:10}}>
                            <Col span={5}>
                                <Row gutter={[24, 5]}>
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
                                <div style={{border: "solid 1px", height: "15.2vmax", width: 1,borderColor:"#403f3f",position:"relative",right:20}}></div>
                            </Col>
                            <Col span={16}>
                                <Row>
                                    <Col span={22} offset={2}>
                                        <p style={{color: "#DFFFDF"}}>{pair_name.left_name} vs {pair_name.right_name}</p>
                                    </Col>
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
                sx={{borderRadius: 60,paddingTop:3,paddingRight:3,paddingLeft:3,border:"white",'&:fouvu':{outline:'none'}}}
            >
                <Box sx={{width: "67vmax", height: "93vmax", backgroundColor: "#dffff6",borderRadius:5}} className={""}>
                    <motion.div
                        className={"box"}
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.91}}
                        transition={{type: "spring", stiffness: 100, damping: 50}}
                        onClick={() => handleClose()}
                    >
                        <CloseOutlined style={{fontSize: 30,position:"relative",left:"1vmax",top:"1vmax"}}/>
                    </motion.div>
                    <p style={{position:"absolute",left:"35vmax",top:"5.4vmax" ,fontSize:23 ,color:"rgba(100,98,98,0.8)"}}>Balance : {balance} APT</p>
                    <div style={{border:"solid 1px",width:"64vmax",height:1,position:"relative",left:"1.5vmax",top:"1.5vmax",borderColor:"rgba(100,98,98,0.3)"}}></div>
                    <br/>
                    <Row>
                        <Col span={8} offset={4} >
                            <img src={save_pair.left_url} style={{width:"18vmax",height:"15vmax"}}></img>
                        </Col>
                        <Col span={8} offset={1}>
                            <img src={save_pair.right_url} style={{width:"18vmax",height:"15vmax"}}></img>
                        </Col>
                    </Row>
                    <br/>
                    <Row gutter={[24,24]} style={{position:"relative",right:"0.4vmax",paddingLeft:10}}>
                        <Col span={8} offset={0}>
                            <button className={"rainbow"} style={{width: "19vmax", height: "15vmax"}} onClick={()=>{
                                set_transactiom_data({
                                    choose: pair_name.left_name,
                                    amount:transactiom_data.amount
                                })
                            }}>
                                <Row gutter={[24,12]}>
                                    <Col span={24}>
                                        <p  style={{
                                            fontSize: 30,
                                            textAlign: "center",
                                            position: "relative",
                                            right: 16
                                        }}>{pair_name.left_name}</p>
                                    </Col>
                                    <Col span={24} style={{position:"relative",right:"3.1vmax",top:-13}}>
                                        <div style={{
                                            backgroundColor: "#e0e6e3",
                                            height: "7vmax",
                                            width: "16vmax",
                                            borderRadius: 5
                                        }}>
                                            <p style={{fontSize: 20 , color:"#646262"}}>{parseFloat(save_pair.left)/parseFloat(save_pair.left2)}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </button>
                        </Col>
                        <Col span={7} offset={0}>
                            <button className={"rainbow"} style={{width: "19vmax", height: "15vmax"}} onClick={()=>{
                                set_transactiom_data({
                                    choose: 'middle',
                                    amount:transactiom_data.amount
                                })
                            }}>
                                <Row gutter={[24, 12]}>
                                    <Col span={24}>
                                        <p style={{fontSize: 30}}>-</p>
                                    </Col>
                                    <Col span={24} style={{position: "relative",right:"3.1vmax",top:-13}}>
                                        <div style={{
                                            backgroundColor: "#e0e6e3",
                                            height: "7vmax",
                                            width: "16vmax",
                                            borderRadius: 5
                                        }}>
                                            <p style={{
                                                fontSize: 20,
                                                color: "#646262"
                                            }}>{parseFloat(save_pair.middle) / parseFloat(save_pair.middle2)}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </button>
                        </Col>
                        <Col span={6} offset={1}>
                            <button className={"rainbow"} style={{width: "19vmax", height: "15vmax"}} onClick={()=>{
                                set_transactiom_data({
                                    choose: pair_name.right_name,
                                    amount:transactiom_data.amount
                                })
                            }}>
                                <Row gutter={[24, 12]}>
                                    <Col span={24}>
                                        <p style={{
                                            fontSize: 30,
                                            textAlign: "center",
                                            position: "relative",
                                            right: 17
                                        }}>{pair_name.right_name}</p>
                                    </Col>
                                    <Col span={24} style={{position: "relative",right:"3.1vmax",top:-13}}>
                                        <div style={{
                                            backgroundColor: "#e0e6e3",
                                            height: "7vmax",
                                            width: "16vmax",
                                            borderRadius: 5
                                        }}>
                                            <p style={{
                                                fontSize: 20,
                                                color: "#646262"
                                            }}>{parseFloat(save_pair.right) / parseFloat(save_pair.right2)}</p>
                                        </div>
                                    </Col>
                                </Row>

                            </button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22} offset={1}>
                            <Input disabled={transactiom_data.choose == '' ? true :false} size={"large"} placeholder={"0.00"} addonAfter={<><img src={APT_logo} style={{width:"2vmax",height:"2vmax",position:"relative",left:"0.5vmax"}}></img>APT</>} onChange={(value) => {
                                const regex = /^-?\d+(\.\d+)?$/;
                                if(regex.test(value.target.value)){
                                    set_transactiom_data({
                                        choose: transactiom_data.choose,
                                        amount:parseFloat(value.target.value)
                                    })
                                }else{
                                    set_transactiom_data({
                                        choose: transactiom_data.choose,
                                        amount:0
                                    })
                                }
                            }}></Input>
                        </Col>
                    </Row>
                    <br/>
                    <Row style={{position:"relative", top:-15}}>
                        <Col span={22} offset={1}>
                            <div style={{border:"solid 0.5px",borderRadius:5,height:"27vmax",backgroundColor:"rgb(100,98,98)",color:"rgb(237,237,237)"}}>
                                <Row gutter={[24,8]} style={{paddingTop:5,paddingLeft:15}}>
                                    <Col span={24}>
                                        <p>Bet Card</p>
                                    </Col>
                                    <Col span={24} style={{top:-10,position:"relative"}}>
                                        <p style={{textAlign: "left", fontSize: 15}}>Choose
                                            : {transactiom_data.choose}</p>
                                        <div style={{
                                            border: "solid 1px",
                                            width: "20vmax",
                                            height: 1,
                                            position: "relative",
                                            left: "0vmax",
                                            top: "0.5vmax",
                                            borderColor: "rgba(159,158,158,0.63)"
                                        }}></div>
                                    </Col>
                                    <Col span={24} style={{top:-10,position:"relative"}}>
                                        <p style={{textAlign: "left", fontSize: 15}}>Amount
                                            : {transactiom_data.amount}</p>
                                        <div style={{
                                            border: "solid 1px",
                                            width: "20vmax",
                                            height: 1,
                                            position: "relative",
                                            left: "0vmax",
                                            top: "0.5vmax",
                                            borderColor: "rgba(159,158,158,0.63)"
                                        }}></div>
                                    </Col>
                                    <Col span={24} style={{top:-10,position:"relative"}}>
                                        <p style={{textAlign: "left", fontSize: 15}}>Fee (10%) : {(transactiom_data.amount*0.1).toFixed(2)}</p>
                                        <div style={{
                                            border: "solid 1px",
                                            width: "20vmax",
                                            height: 1,
                                            position: "relative",
                                            left: "0vmax",
                                            top: "0.5vmax",
                                            borderColor: "rgba(159,158,158,0.63)"
                                        }}></div>
                                    </Col>
                                    <Col span={24} style={{top:-10,position:"relative"}}>
                                        <p style={{textAlign: "left", fontSize: 15}}>Expired Date : {save_pair.expired_time.length == 7 ?
                                            `0${save_pair.expired_time.slice(0,1)}/${save_pair.expired_time.slice(1,3)}/${save_pair.expired_time.slice(3,7)}`:`${save_pair.expired_time.slice(0,2)}/${save_pair.expired_time.slice(2,4)}/${save_pair.expired_time.slice(4,8)}`}</p>
                                        <div style={{
                                            border: "solid 1px",
                                            width: "20vmax",
                                            height: 1,
                                            position: "relative",
                                            left: "0vmax",
                                            top: "0.5vmax",
                                            borderColor: "rgba(159,158,158,0.63)"
                                        }}></div>
                                    </Col>
                                    {transactiom_data.choose == pair_name.left_name && (
                                        <Image   preview={false}  style={{width:"19.5vmax",height:"19.5vmax", position:"relative",left:"38.6vmax",top:"-21.5vmax"}} src={save_pair.left_url} fallback="data:image/png;base64,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"
                                        ></Image>
                                    )}
                                    {transactiom_data.choose == pair_name.right_name&& (
                                        <Image preview={false}  style={{width:"19.5vmax",height:"19.5vmax", position:"relative",left:"38.6vmax",top:"-21.5vmax"}} src={save_pair.right_url} fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                                        ></Image>
                                    )}
                                    {transactiom_data.choose == "middle" && (
                                        <Image   preview={false}  style={{width:"19.5vmax",height:"19.5vmax", position:"relative",left:"38.6vmax",top:"-21.5vmax"}} src={"data:image/png;base64,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"} fallback="data:image/png;base64,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"
                                        ></Image>
                                    )}
                                </Row>


                            </div>
                        </Col>
                    </Row>
                    <Row style={{position:"relative",top:-15}}>
                        <Col span={24} style={{paddingLeft:17,paddingTop:10}}>
                            <button className={"rainbow"} style={{width:"61vmax"}} onClick={() =>{
                                submit_transaction()
                            }}>
                                Create
                            </button>
                        </Col>
                    </Row>
                </Box>
            </Modal>
        </>
    )
}

export default Is_telegrame_web_app_bet_box;