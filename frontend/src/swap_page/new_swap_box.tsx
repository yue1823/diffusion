import { DoubleRightOutlined } from "@ant-design/icons";
import {Col, Divider, Input, Row, Select, message } from "antd";
import React, {useEffect, useState } from "react";
import {option_coin_address} from "./coin_address";
import {Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const aptosConfig = new AptosConfig({ network: Network.TESTNET});
const aptos = new Aptos(aptosConfig);
interface Coin_data{
    name:string,
    symbol:string,
    balacne:number,
    coin_url:string,
    decimals:number,
}
const New_swap_page:React.FC<{}>=({})=>{
    const { account, signAndSubmitTransaction } =useWallet() ;
    const [items, setItems] = useState(option_coin_address.option);
    const [enter_address,set_enter_address]=useState('');
    const [coin_data,set_coin_data]=useState<Coin_data>({name:'',symbol:'',balacne:0,coin_url:'',decimals:0})

    const add_items = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) =>{
        e.preventDefault();
        setItems([...items, {
            value:'',
            label:'',
            address:'',
            coin_url:'',
        } ]);
    }
    useEffect(() => {
        const fetch_coin_data = async() =>{
            if(enter_address == '')return

            const  regex= /^0x[a-fA-F0-9]{64}$/;
            const regex2=/^0x[a-fA-F0-9]{64}(::[a-zA-Z0-9_]+){1,2}$/;
            console.log('enter address',enter_address)
            console.log('test1',regex.test(enter_address))
            console.log('test2',regex2.test(enter_address))
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
                    decimals:decimals1[0] as number
                })
                console.log('v1 coin data',{
                    name:name1[0] as string,
                    symbol:symbol1[0] as string,
                    balacne:typeof  balance1 === "number" ?  balance1 : balance1[0] as number,
                    coin_url:'',
                    decimals:decimals1[0] as number
                })
            }else if(regex.test(enter_address)){
                // let name1 = await aptos.view({payload:{
                //         function:option_coin_address.function.view_v2_coin_name(),
                //         typeArguments:[option_coin_address.coin_meta_date],
                //         functionArguments:[enter_address]
                //     }})
                let name1 = 'test';
                let symbol1 = await aptos.view({payload:{
                        function:option_coin_address.function.view_v2_coin_symbol(),
                        typeArguments:[option_coin_address.coin_meta_date],
                        functionArguments:[enter_address]
                    }})
                let balance1 = account ? await aptos.view({payload:{
                        function:option_coin_address.function.view_v2_coin_balance(),
                        typeArguments:[option_coin_address.coin_meta_date],
                        functionArguments:[account.address]
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
                    name:name1 as string,
                    symbol:symbol1[0] as string,
                    balacne: typeof  balance1 === "number" ?  balance1 : balance1[0] as number,
                    coin_url:coin_url[0] as string,
                    decimals:decimals1[0] as number
                })
                console.log('v2 coin data',{
                    name:name1 as string,
                    symbol:symbol1[0] as string,
                    balacne:typeof  balance1 === "number" ?  balance1 : balance1[0] as number,
                    coin_url:coin_url[0] as string,
                    decimals:decimals1[0] as number
                })
            }

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
            </Row>
        </>
    )
}

export default New_swap_page