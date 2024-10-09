import { DoubleRightOutlined, ExclamationCircleTwoTone } from "@ant-design/icons";
import {Col, Divider, Input, Row, Select, message ,Radio,Image, Skeleton} from "antd";
import React, {useEffect, useState } from "react";
import {option_coin_address} from "./coin_address";
import {Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Modal from "@mui/material/Modal";
import {Box} from "@mui/material";
import { motion } from "framer-motion";

const aptosConfig = new AptosConfig({ network: Network.TESTNET});
const aptos = new Aptos(aptosConfig);
interface Coin_data{
    name:string,
    symbol:string,
    balacne:number,
    coin_url:string,
    decimals:number,
    stander:string,
    coin_address:string
}
const New_swap_page:React.FC<{}>=({})=>{
    const { account, signAndSubmitTransaction } =useWallet() ;
    const [items, setItems] = useState(option_coin_address.option);
    const [enter_address,set_enter_address]=useState('');
    const [coin_data,set_coin_data]=useState<Coin_data>({name:'test',symbol:'T',balacne:0,coin_url:'asd',decimals:1,stander:"v2",coin_address:""})

    const add_items = () =>{
        if(enter_address == '')return
        console.log('add item 1')
        option_coin_address.option.map((label,index) => {
            if(label.address == enter_address){return}
            if(index == option_coin_address.option.length -1 ){
                console.log('set item')
                setItems([...items, {
                    value:coin_data.symbol,
                    label:coin_data.symbol,
                    address:enter_address,
                    coin_url:coin_data.coin_url,
                } ]);
            }
        })



    }
    useEffect(() => {
        const fetch_coin_data = async() =>{
            if(enter_address == '')return
            const  regex= /^0x[a-fA-F0-9]{64}$/;
            const regex2=/^0x[a-fA-F0-9]{64}(::[a-zA-Z0-9_]+){1,2}$/;
            console.log('enter address',enter_address)
            console.log('test1',regex.test(enter_address))
            console.log('test2',regex2.test(enter_address))
            try{
                if(regex2.test(enter_address)){
                    let name1 = await aptos.view({payload:{
                            function:option_coin_address.function.view_v1_coin_name(),
                            typeArguments:[enter_address],
                            functionArguments:[]
                        }})
                    let symbol1 = await aptos.view({payload:{
                            function:option_coin_address.function.view_v1_coin_symbol(),
                            typeArguments:[enter_address],
                            functionArguments:[]
                        }})
                    let balance1 = account ? await aptos.view({payload:{
                            function:option_coin_address.function.view_v1_coin_balance(),
                            typeArguments:[enter_address],
                            functionArguments:[account.address]
                        }}) : 0;
                    let decimals1 = await aptos.view({payload:{
                            function:option_coin_address.function.view_v1_coin_decimals(),
                            typeArguments:[enter_address],
                            functionArguments:[]
                        }})

                    set_coin_data({
                        name:name1[0] as string,
                        symbol:symbol1[0] as string,
                        balacne: typeof  balance1 === "number" ?  balance1 : balance1[0] as number,
                        coin_url:'',
                        decimals:decimals1[0] as number,
                        stander:"v1",
                        coin_address:enter_address
                    })
                    console.log('v1 coin data',{
                        name:name1[0] as string,
                        symbol:symbol1[0] as string,
                        balacne:typeof  balance1 === "number" ?  balance1 : balance1[0] as number,
                        coin_url:'',
                        decimals:decimals1[0] as number
                    })
                    // setItems([...items, {
                    //     value:symbol1[0] as string,
                    //     label:symbol1[0] as string,
                    //     address:enter_address,
                    //     coin_url:'',
                    // } ]);
                }else if(regex.test(enter_address)){
                    let name1 = await aptos.view({payload:{
                            function:option_coin_address.function.view_v2_coin_name(),
                            typeArguments:[option_coin_address.coin_meta_date],
                            functionArguments:[enter_address]
                        }})
                    // let name1 = 'test';
                    let symbol1 = await aptos.view({payload:{
                            function:option_coin_address.function.view_v2_coin_symbol(),
                            typeArguments:[option_coin_address.coin_meta_date],
                            functionArguments:[enter_address]
                        }})
                    let balance1 = account ? await aptos.view({payload:{
                            function:option_coin_address.function.view_v2_coin_balance(),
                            typeArguments:[option_coin_address.coin_meta_date],
                            functionArguments:[account.address,enter_address]
                        }}) : 0;
                    let decimals1 = await aptos.view({payload:{
                            function:option_coin_address.function.view_v2_coin_decimals(),
                            typeArguments:[option_coin_address.coin_meta_date],
                            functionArguments:[enter_address]
                        }})
                    let coin_url = await aptos.view({payload:{
                            function:option_coin_address.function.view_v2_coin_icon_url(),
                            typeArguments:[option_coin_address.coin_meta_date],
                            functionArguments:[enter_address]
                        }})
                    // console.log('name ',name1)
                    // console.log('symbol1 ', symbol1)
                    // console.log('balance1 ', balance1)
                    // console.log('decimals1 ', decimals1)
                    // console.log('coin_url ', coin_url)
                    set_coin_data({
                        name:name1[0] as string,
                        symbol:symbol1[0] as string,
                        balacne: typeof  balance1 === "number" ?  balance1 : balance1[0] as number,
                        coin_url:coin_url[0] as string,
                        decimals:decimals1[0] as number,
                        stander:"v2",
                        coin_address:enter_address
                    })
                    console.log('v2 coin data',{
                        name:name1[0] as string,
                        symbol:symbol1[0] as string,
                        balacne:typeof  balance1 === "number" ?  balance1 : balance1[0] as number,
                        coin_url:coin_url[0] as string,
                        decimals:decimals1[0] as number
                    })
                    // setItems([...items, {
                    //     value:symbol1[0] as string,
                    //     label:symbol1[0] as string,
                    //     address:enter_address,
                    //     coin_url:coin_url[0] as string,
                    // } ]);
                }


            }catch (e:any){console.log(e)}

        }
        fetch_coin_data()

    }, [enter_address]);
    return (
        <>
            <Row gutter={[24,6]} style={{minHeight:"490px",backgroundColor:"#b60d0d",paddingTop:10,}}>

                <Col span={6}></Col>
                <Col span={12}>
                    <div style={{height:"470px",width:"inhereit",justifyContent:"center"}}>
                        <Row gutter={[24,5]} style={{width:"inherit",height:"inherit",backgroundColor:"blue",padding:10,}}>
                            <Col span={24} style={{height:"100px",backgroundColor:"green",display:"inline-block",paddingTop:10,paddingLeft:10}}>
                               <div style={{justifyContent:"left",alignItems: "center",width:"350px",backgroundColor:"#dfdfdf",height:"80px"}}></div>
                            </Col>
                            <Col span={24} style={{height:"200px",backgroundColor:"gold",display:"inline-block",padding:10,paddingLeft:15}}>
                                <Row gutter={[24,6]}>
                                    <Col span={11} style={{height:"180px",display:"inline-block",paddingLeft:15}}>
                                        <div style={{height:"180px",backgroundColor:"white",display:"inline-block",width:"330px"}}>
                                            <div style={{border:"1.5mm ridge #CED4DA",height:"50px",position:"relative",padding:1,backgroundColor:"#dfdfdf"}}>
                                                <Select
                                                    showSearch
                                                    placeholder="Select a person"
                                                    optionFilterProp="label"
                                                    onChange={(value) =>{
                                                        console.log(value)

                                                    }}
                                                    onSearch={(value) =>{
                                                        //console.log(value)
                                                        option_coin_address.option.map((label,index) =>{

                                                            if(label.address == value){return}
                                                            if(index == option_coin_address.option.length -1 ){
                                                                set_enter_address(value)
                                                                // const  regex= /^0x[a-fA-F0-9]{64}$/;
                                                                // const regex2=/^0x[a-fA-F0-9]{64}(::[a-zA-Z0-9_]::[a-zA-Z0-9_])$/;
                                                                // if(regex.test(value) || regex2.test(value)){
                                                                //
                                                                // }else{
                                                                //     message.error('please enter correct address')
                                                                // }
                                                            }
                                                        })

                                                    }}
                                                    options={items}
                                                    dropdownRender={(menu) => (
                                                        <>
                                                            {menu}
                                                            {/*<div style={{border:"0.1px solid",width:"inherit",borderColor:"#dfdfdf"}}></div>*/}
                                                            <Divider style={{ margin: '8px 0' }} />
                                                            {enter_address != '' && (
                                                                <>
                                                                    {
                                                                        option_coin_address.option.map((label,index) => {
                                                                            if(label.address == enter_address){return}
                                                                            if(index == option_coin_address.option.length -1 ){
                                                                                return(
                                                                                    <button className={"rainbow"} key={index} onClick={() => add_items()}>pluse</button>
                                                                                )
                                                                            }
                                                                        })
                                                                    }
                                                                </>
                                                            )}

                                                        </>
                                                    )}
                                                    style={{width:"316px",height:"38px",backgroundColor:"#bcbbbb"}}
                                                    />
                                            </div>
                                            <div style={{border:"1.5mm ridge #CED4DA",height:"50px",position:"relative",padding:1,backgroundColor:"#dfdfdf"}}>
                                                <Input autoFocus={false} style={{width:"316px",height:"38px",backgroundColor:"#bcbbbb"}} prefix={"$"} suffix={<>
                                                    <button className={""} style={{display:"inline-block",width:"50px",height:"20px",backgroundColor:"#797d85",padding:1,color:"white"}}><p style={{top:"5px",position:"absolute",fontSize:15,right:"18px"}}>max</p></button>
                                                </>}/>
                                            </div>

                                        </div>
                                    </Col>
                                    <Col span={2} style={{height:"180px",display:"inline-block",paddingLeft:10,justifyContent:"center",alignItems:"center"}}>
                                        {/*<div style={{border:"1px solid" ,height:"inherit",width:"5px"}}></div>*/}
                                        <div style={{height:"inherit",alignItems:"center",justifyContent:"center",display:"flex",fontSize:60}}>
                                            <DoubleRightOutlined style={{fontSize:60}}/>
                                        </div>
                                    </Col>
                                    <Col span={11}
                                         style={{height:"180px",display:"inline-block",paddingLeft:10,right:7}}>
                                        <div style={{
                                            height: "180px",
                                            backgroundColor: "white",
                                            display: "inline-block",
                                            width: "330px"
                                        }}></div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24} style={{height:"140px",backgroundColor:"pink",display:"inline-block"}}>

                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={6}></Col>
                <Confirm_box states={true} coin_data={coin_data}/>
            </Row>
        </>
    )
}


export default New_swap_page

const Confirm_box : React.FC <{states:boolean,coin_data:Coin_data}> = ({states,coin_data})=>{
    const [clicked,set_clicked]=useState(false);
    const [box_state,set_box_state]=useState(false);
    const handle_close =() =>{

    }
    const close =()=>{
        set_box_state(false)
    }
    useEffect(() => {
        set_box_state(states)
    }, [coin_data]);
    return(
        <>
            <Modal
                disableEnforceFocus
                disableAutoFocus
                open={box_state}
                onClose={handle_close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                classes={""}
                sx={{borderRadius: 60,paddingTop:3,paddingRight:3,paddingLeft:3,border:"white",'&:fouvu':{outline:'none'},justifyContent:"center",alignItems:"center",display:"flex"}}
            >
                <Box sx={{width:"600px",height:"600px",backgroundColor:"#dfdfdf",borderRadius:5,padding:5,paddingTop:3}}>
                    <Row gutter={[24,6]} style={{}}>
                        <Col span={24} style={{display:"flex",justifyContent:"center",alignItems:"center",height:"150px",background:"#7e1414",fontSize:190}}>
                            <ExclamationCircleTwoTone style={{transform:"scale(4)"}} />
                        </Col>
                        <Col span={24} style={{height:"190px",backgroundColor:"blue",border:"0.5px solid"}}>
                            <Row gutter={[24,6]} style={{}}>
                                <Col span={24}>
                                    <p style={{fontSize:25}}>Coin Details</p>
                                </Col>
                                <Col span={12}>
                                    <Row gutter={[24,6]} >
                                        <Col span={24} style={{paddingLeft:50}}>
                                            <p style={{fontSize:25,justifySelf:"left",display:"inline-block"}}>Name : {coin_data.name}</p>
                                        </Col>
                                        <Col span={24} style={{paddingLeft:50}}>
                                            <p style={{fontSize:25,justifySelf:"left",display:"inline-block"}}>Symbol : {coin_data.symbol}</p>
                                        </Col>
                                        <Col span={24} style={{paddingLeft:50}}>
                                            <p style={{fontSize:25,justifySelf:"left",display:"inline-block"}}>Decimals : {coin_data.decimals}</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12} style={{padding:2,paddingRight:50,right:10,top:"-6px"}}>
                                    <Row>
                                        <Col span={24}>
                                            <p style={{
                                                fontSize: 25,
                                                justifySelf: "center",
                                                display: "flex",
                                                alignSelf: "center"
                                            }}>standard ： {coin_data.stander}</p>
                                            {/*{coin_data.stander === "v2" ? <></> :}*/}
                                        </Col>
                                        <Col span={24} style={{

                                            height: "100px",
                                            justifyContent:"center",alignItems:"center"}}>
                                            {coin_data.stander === "v2" ? <>
                                                 <div style={{width:"100px",height:"100px",border: "4mm ridge #a7a8a1"}}>
                                                    <Image style={{width: "inherit",height:"inherit",justifySelf:"center",display:"inline-block"}} src={coin_data.coin_url} preview={false} fallback="data:image/png;base64,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"></Image>
                                                 </div>
                                                </>:<>
                                                <p style={{fontSize:30,alignSelf:"center",top:"10px",position:"inherit"}}>V1 coin no icon</p>
                                            </>}
                                        </Col>
                                    </Row>

                                </Col>
                            </Row>

                        </Col>
                        <Col span={24} style={{height:"45px",backgroundColor:"blue"}}>
                             <p style={{fontSize:30}}>You are importing an not verify coin</p>
                        </Col>
                        <Col span={24} style={{height:"50px",backgroundColor:"blue"}}>
                            <p style={{fontSize:30}}>Please make sure you understand Risk!</p>
                        </Col>
                        <Col span={24} style={{height:"50px",backgroundColor:"blue",justifyContent:"center",alignItems:"center",display:"inherit"}}>
                            <Radio onChange={(e) => {
                                console.log("clicked", e.nativeEvent.isTrusted);
                                set_clicked(e.nativeEvent.isTrusted)// 输出被点击的值
                            }} style={{transform:"scale(1.5)",fontSize:20}}>Conofirm !</Radio>
                        </Col>
                        <Col span={24} style={{height:"50px",paddingLeft:20}}>
                            {clicked ? <>
                                <motion.div className={"box"}
                                            whileHover={{scale: 1.03}}
                                            whileTap={{scale: 0.95}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}
                                            onClick={() =>{close()}}
                                >
                                    <button className={"rainbow"} style={{width: "500px", height: "inherit"}}>Confirm
                                    </button>
                                </motion.div>
                            </> : <>
                                <button className={""} style={{width: "500px", height: "inherit",backgroundColor:"#b9c3cd"}} disabled={true}>Confirm
                                </button>
                            </>}
                        </Col>
                    </Row>
                </Box>
            </Modal>
        </>
    )
}