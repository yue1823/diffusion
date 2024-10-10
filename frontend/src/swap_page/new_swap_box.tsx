import { DoubleRightOutlined, ExclamationCircleTwoTone, PlusOutlined, RightOutlined } from "@ant-design/icons";
import {Col, Divider, InputNumber, Row, Select, message ,Radio,Image, Segmented} from "antd";
import React, {useEffect, useState } from "react";
import {option_coin_address} from "./coin_address";
import {Aptos} from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Modal from "@mui/material/Modal";
import {Box} from "@mui/material";
import { motion } from "framer-motion";
import APT_logo from "../logo/aptos-apt-logo.svg";
import Diffusion_logo_2 from "../art/diffusion7.png";
import Pontem_logo from "../logo/Pontem.svg"
import Thala_logo from "../logo/thala logo.jpeg";
import Cellea_logo from "../logo/cellana.svg";
import { SDK, convertValueToDecimal } from '@pontem/liquidswap-sdk';
import { diffusion } from "../setting";

const sdk = new SDK({
    nodeUrl: 'https://fullnode.mainnet.aptoslabs.com/v1',});
// const aptosConfig = new AptosConfig({ network: Network.TESTNET});
const aptos = new Aptos(diffusion.aptos_network_setting);


interface Coin_data{
    name:string,
    symbol:string,
    balacne:number,
    coin_url:string,
    decimals:number,
    stander:string,
    coin_address:string
}
interface Transaction_data {
    from_coin_symbol:string,
    from_coin_address:string,
    from_coin_decimals:number,
    from_icon_url:string,
    from_balance:number,
    to_coin_symbol:string,
    to_coin_address:string,
    to_coin_decimals:number,
    to_icon_url:string,
    to_balance:number,
    from_amount:number,
    to_amount:number,
    slippage:string
}
interface Show_value{
    from_value: string | undefined,
    to_value : string | undefined
}
const New_swap_page:React.FC<{}>=({})=>{
    const  regex= /^0x[a-fA-F0-9]{64}$/;
    const regex2=/^0x[a-fA-F0-9]{64}(::[a-zA-Z0-9_]+){1,2}$/;
    const regex3 = /^\d+(\.\d{1,3})?$/;
    const { account, signAndSubmitTransaction } =useWallet() ;
    const [items, setItems] = useState(option_coin_address.option);
    const [enter_address,set_enter_address]=useState('');
    const [open_box,set_open_box]=useState(false);
    const [coin_data,set_coin_data]=useState<Coin_data>({name:'test',symbol:'',balacne:0,coin_url:'',decimals:1,stander:"v2",coin_address:""})
    const [segement_select,set_segement_select]=useState('Pontem');
    const [selectedValue, setSelectedValue] = useState<Show_value>({
        to_value:undefined,
        from_value:undefined
    });
    const [transaction_data , set_transaction_data]=useState<Transaction_data>({from_coin_symbol:"test",from_coin_decimals:0,from_coin_address:"",from_amount:0,from_balance:0,from_icon_url:'',to_coin_decimals:0,to_amount:0,to_coin_address:"",to_coin_symbol:"test",to_balance:0,to_icon_url:"",slippage:""});
    const [show_value,set_show_value] = useState<Show_value>({
        to_value:undefined,
        from_value:undefined
    })
    const Pontem_swap_sdk = async() =>{
        try{
            const output = await sdk.Swap.calculateRates({
                fromToken:transaction_data.from_coin_address,
                toToken:transaction_data.to_coin_address,
                amount:transaction_data.from_amount*Math.pow(10,transaction_data.from_coin_decimals),
                curveType:"uncorrelated",
                interactiveToken:"from",
                version:0
            })
            console.log('pontem sdk swap',parseFloat(output)/Math.pow(10,transaction_data.to_coin_decimals))
            set_show_value({...show_value,to_value:(parseFloat(output)/Math.pow(10,transaction_data.to_coin_decimals)).toFixed(3).toString()})
        }catch (e:any){}finally {

        }


    }
    useEffect(() => {
        if(transaction_data.to_coin_symbol != 'test' && transaction_data.to_coin_address != ''){
            Pontem_swap_sdk()
        }
    }, [show_value.from_value]);

    useEffect(() => {
        if (transaction_data.from_coin_symbol === 'test') {
            setSelectedValue({...selectedValue,from_value:undefined}); // 显示 placeholder
        }else if(transaction_data.to_coin_symbol === 'test'){
            setSelectedValue({...selectedValue,to_value:undefined});
        } else if(coin_data.symbol === transaction_data.from_coin_symbol){
            setSelectedValue({...selectedValue,from_value:coin_data.symbol}); // 显示 symbol
        }else if(coin_data.symbol === transaction_data.to_coin_symbol){
            setSelectedValue({...selectedValue,to_value:coin_data.symbol}); // 显示 symbol
        }
    }, [coin_data]);
    useEffect(() => {
        //console.log("transaction_data",transaction_data)
        // if( coin_data.balacne == 0 && coin_data.name != "test"){
        //     if()
        //     fetch_balance_of_options()
        // }
    }, [transaction_data]);
    useEffect(() => {
        //console.log("from coin symbol",transaction_data)
        if (transaction_data.from_coin_address) {
            fetch_balance_of_options(transaction_data.from_coin_address, "from");
            set_show_value({...show_value,from_value:undefined})
            set_transaction_data({...transaction_data,to_balance:0})
        }
    }, [transaction_data.from_coin_address]);
    useEffect(() => {
        //console.log("to coin symbol",transaction_data)
        if (transaction_data.to_coin_address) {
            fetch_balance_of_options(transaction_data.to_coin_address, "to");
            set_show_value({...show_value,to_value:undefined})
            set_transaction_data({...transaction_data,to_balance:0})
        }
        if(transaction_data.to_coin_symbol != 'test' && transaction_data.to_coin_address != ''){
            Pontem_swap_sdk()
        }
    }, [transaction_data.to_coin_address]);
    const fetch_balance_of_options = async(key_address:string,to_or_from:string) =>{
        if(!account)return[];

        console.log('key_address',key_address)
        console.log('test1',regex.test(key_address))
        console.log('test2',regex2.test(key_address))
        console.log("fetch balance", transaction_data)
        if(regex.test(key_address)){
            let respone = await aptos.view({payload:{
                    function:option_coin_address.function.view_v2_coin_balance(),
                    typeArguments:[option_coin_address.coin_meta_date],
                    functionArguments:[account.address,key_address]
                }})
            //console.log("balance ",respone)
            if(to_or_from == "to"){
                set_transaction_data({...transaction_data,to_balance:respone[0] as number})
            }else if(to_or_from == "from"){
                set_transaction_data({...transaction_data,from_balance:respone[0] as number})
            }
        }else if(regex2.test(key_address)){
            let respone = await aptos.view({payload:{
                    function:option_coin_address.function.view_v1_coin_balance(),
                    typeArguments:[key_address],
                    functionArguments:[account.address]
                }})
            console.log("balance ",respone)
            if(to_or_from == "to"){
                set_transaction_data({...transaction_data,to_balance:respone[0] as number})
            }else if(to_or_from == "from"){
                set_transaction_data({...transaction_data,from_balance:respone[0] as number})
            }
        }else if(key_address === "0x1::aptos_coin::AptosCoin"){
            let respone = await aptos.view({payload:{
                    function:option_coin_address.function.view_v1_coin_balance(),
                    typeArguments:[key_address],
                    functionArguments:[account.address]
                }})
            console.log("balance ",respone[0])
            if(to_or_from == "to"){
                set_transaction_data({...transaction_data,to_balance:respone[0] as number})
            }else if(to_or_from == "from"){
                set_transaction_data({...transaction_data,from_balance:respone[0] as number})
            }
        }else{
            if(to_or_from == "to"){
                set_transaction_data({...transaction_data,to_balance:0})
            }else if(to_or_from == "from"){
                set_transaction_data({...transaction_data,from_balance:0})
            }
        }
    }
    const add_items_form = () =>{
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
                    decimals:coin_data.decimals
                } ]);
                set_open_box(true)
                set_transaction_data({...transaction_data, from_coin_symbol:coin_data.symbol,from_coin_address:coin_data.coin_address,from_coin_decimals:coin_data.decimals})
            }
        })
    }
    const add_items_to = () =>{
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
                    decimals:coin_data.decimals
                } ]);
                set_open_box(true)
                set_transaction_data({...transaction_data, to_coin_symbol:coin_data.symbol,to_coin_address:coin_data.coin_address,to_coin_decimals:coin_data.decimals})
            }
        })
    }
    useEffect(() => {
    }, [open_box]);
    useEffect(() => {
        const fetch_coin_data = async() =>{
            if(enter_address == '')return

            // console.log('enter address',enter_address)
            // console.log('test1',regex.test(enter_address))
            // console.log('test2',regex2.test(enter_address))
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
                    // console.log('name ',name1)
                    // console.log('symbol1 ', symbol1)
                    // console.log('balance1 ', balance1)
                    // console.log('decimals1 ', decimals1)
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


            }catch (e:any){
                console.log(e)
                set_coin_data({
                    name:'error',
                    symbol:'',
                    balacne:0,
                    coin_url:'',
                    coin_address:enter_address,
                    stander:'',
                    decimals:0
                })
            }

        }
        fetch_coin_data()

    }, [enter_address]);
    return (
        <>
            <Row gutter={[24,6]} style={{minHeight:"490px",backgroundColor:"#dfdac8",paddingTop:10,}}>

                <Col span={6}></Col>
                <Col span={12}>
                    <div style={{height:"470px",width:"inhereit",justifyContent:"center"}}>
                        <Row gutter={[24,5]} style={{width:"inherit",height:"inherit",backgroundColor:"#bcbbbb",padding:10,borderRadius:5,border:"1px solid",borderColor:"#a3a2a2"}}>
                            <Col span={24} style={{height:"100px",backgroundColor:"green",display:"inline-block",paddingTop:10,paddingLeft:10}}>
                               <div style={{justifyContent:"left",alignItems: "center",width:"350px",backgroundColor:"#dfdfdf",height:"80px"}}>
                                   <Segmented options={option_coin_address.segmented_options} style={{height:"80px",border:5}} block onChange={(value) =>{
                                       set_segement_select(value)
                                   }}/>
                               </div>
                            </Col>
                            <Col span={24} style={{height:"200px",backgroundColor:"",display:"inline-block",padding:10,paddingLeft:15}}>
                                <Row gutter={[24,6]}>
                                    <Col span={11} style={{height:"180px",display:"inline-block",paddingLeft:15}}>
                                        <div style={{height:"180px",backgroundColor:"",display:"inline-block",width:"330px"}}>
                                            <div style={{border:"1.5mm ridge #CED4DA",height:"50px",position:"relative",padding:1,backgroundColor:"#dfdfdf",borderRadius:5}}>
                                                <Select
                                                    showSearch
                                                    placeholder="Enter an address"
                                                    optionFilterProp="label"
                                                    onChange={(value) =>{
                                                        // console.log(value)
                                                        const select_ooption= items.find(items => items.value == value as string)
                                                        // console.log("items",items)
                                                        // console.log("select options 1",select_ooption)
                                                        if(select_ooption != undefined){

                                                                // console.log("select options 2",select_ooption)
                                                                set_transaction_data({...transaction_data,from_coin_symbol:select_ooption.value,from_coin_address:select_ooption.address,from_coin_decimals:select_ooption.decimals})
                                                                // fetch_balance_of_options(select_ooption.address,"from")
                                                                //console.log("transaction_data",transaction_data)
                                                        }
                                                    }}
                                                    value={selectedValue.from_value}
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
                                                                                    <>
                                                                                        {coin_data.name != "test" && coin_data.name != 'error' ? <>
                                                                                            <button
                                                                                                style={{width:"305px",height:"60px",top:"15px"}}
                                                                                                className={"rainbow"}
                                                                                                key={index}
                                                                                                onClick={() => add_items_form()}><PlusOutlined />
                                                                                            </button>
                                                                                        </> : <>
                                                                                            <p>Please enter correct address</p>
                                                                                        </>}
                                                                                    </>
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
                                            <div style={{border:"1.5mm ridge #CED4DA",height:"130px",position:"relative",padding:1,backgroundColor:"#807f7f",borderRadius:5}}>
                                                <InputNumber autoFocus={false}
                                                             value={show_value.from_value}
                                                             min="0"
                                                             max={transaction_data.from_balance.toString()}
                                                             controls={false}
                                                             size={"large"}
                                                             addonAfter={<>
                                                                 <button onClick={() =>{
                                                                     set_show_value({...show_value,from_value:((transaction_data.from_balance/(Math.pow(10,transaction_data.from_coin_decimals)))-0.001).toFixed(3)})
                                                                 }} className={""} style={{zIndex:10,display:"inline-block",width:"50px",height:"20px",backgroundColor:"#797d85",padding:1,color:"white",top:"-10px"}}><p style={{top:"10px",position:"absolute",fontSize:15,right:"20px"}}>max</p></button>
                                                                 {/*<p style={{position:"absolute",fontSize:12,top:"20px",right:"26px"}}>{coin_data.balacne}</p>*/}
                                                             </>}
                                                             onChange={(value) =>{
                                                                 if(value != null){
                                                                     // console.log("regex3.test",regex3.test(value));
                                                                     // console.log("show value",value);
                                                                     if(regex3.test(value)){
                                                                         console.log('set input value',value)
                                                                         set_show_value({...show_value,from_value:value})
                                                                         set_transaction_data({...transaction_data,from_amount:parseFloat(value)})
                                                                         // set_transaction_data({...transaction_data,from_amount:parseFloat(value)})
                                                                     }
                                                                 }
                                                }} style={{width:"319px",backgroundColor:"#bcbbbb"}} prefix={"$"} suffix={""}/>
                                                <Row gutter={[24,6]} style={{padding:2}}>
                                                    <Col span={12} style={{}}>
                                                        <Row gutter={[24,1]}>
                                                            <Col span={24}>
                                                                {transaction_data.from_coin_symbol != 'test' && (
                                                                    <>
                                                                        <p style={{display:"inline-block",justifySelf:"left"}}>Balacne : </p>
                                                                        <p style={{display:"inline-block",justifySelf:"right",left:10}}>{((transaction_data.from_balance/(Math.pow(10,transaction_data.from_coin_decimals))) - (transaction_data.from_balance == 0  ? 0 : 0.001 )).toFixed(3)}</p>
                                                                    </>
                                                                )}
                                                            </Col>
                                                            <Col span={24}>
                                                                {transaction_data.from_coin_symbol != 'test' && (
                                                                    <>
                                                                        <p style={{
                                                                            display: "inline-block",
                                                                            justifySelf: "right"
                                                                        }}>{transaction_data.from_coin_symbol}</p>
                                                                    </>
                                                                )}

                                                            </Col>
                                                            <Col span={24}>
                                                                {regex2.test(transaction_data.from_coin_address) && (
                                                                    <p style={{
                                                                        display: "inline-block",
                                                                        justifySelf: "right"
                                                                    }}>V1 standard</p>
                                                                )}
                                                                {regex.test(transaction_data.from_coin_address) && (
                                                                    <p style={{
                                                                        display: "inline-block",
                                                                        justifySelf: "right"
                                                                    }}>V2 standard</p>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={12} style={{height:"80px",justifyContent:"center",alignItems:"center",width:"100%",paddingTop:10,paddingLeft:90}}>
                                                        {transaction_data.from_coin_symbol === "APT" ? <><Image src={"https://cryptologos.cc/logos/aptos-apt-logo.svg?v=035"} preview={false} fallback={APT_logo} style={{height:"60px",width:"60px",justifyContent:"center",alignItems:"center",display:"inline-block",top:10}}></Image></>:<>
                                                            {regex.test(transaction_data.from_coin_address) && (async () => {
                                                                    let respone = await aptos.view({payload:{
                                                                            function:option_coin_address.function.view_v2_coin_icon_url(),
                                                                            typeArguments:[option_coin_address.coin_meta_date],
                                                                            functionArguments:[transaction_data.from_coin_address]
                                                                        }})
                                                                    if (respone[0] != undefined) {
                                                                        set_transaction_data({
                                                                            ...transaction_data,
                                                                            from_icon_url: respone[0] as string
                                                                        })
                                                                    }
                                                                    return (
                                                                        <Image src={respone[0] as string} fallback={Diffusion_logo_2}></Image>
                                                                    )
                                                                }
                                                            )}
                                                        </>}
                                                    </Col>
                                                </Row>
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
                                            backgroundColor: "",
                                            display: "inline-block",
                                            width: "330px"
                                        }}>
                                             <div style={{border:"1.5mm ridge #CED4DA",height:"50px",position:"relative",padding:1,backgroundColor:"#dfdfdf",borderRadius:5}}>
                                                <Select
                                                    showSearch
                                                    placeholder="Enter an address"
                                                    optionFilterProp="label"
                                                    onChange={(value) =>{
                                                        // console.log(value)
                                                        const select_ooption= items.find(items => items.value == value as string)
                                                        // console.log("items",items)
                                                        // console.log("select options 1",select_ooption)
                                                        if(select_ooption != undefined){
                                                            // console.log("select options 2",select_ooption)
                                                            set_transaction_data({...transaction_data,to_coin_symbol:select_ooption.value,to_coin_address:select_ooption.address,to_coin_decimals:select_ooption.decimals})
                                                            // fetch_balance_of_options(select_ooption.address,"to")
                                                            //console.log("transaction_data",transaction_data)
                                                        }
                                                    }}
                                                    value={selectedValue.to_value}
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
                                                                                    <>
                                                                                        {coin_data.name != 'test' && coin_data.name != 'error' ? <>
                                                                                            <button
                                                                                                style={{width:"305px",height:"60px",top:"15px"}}
                                                                                                className={"rainbow"}
                                                                                                key={index}
                                                                                                onClick={() => add_items_to()}><PlusOutlined />
                                                                                            </button>
                                                                                        </> : <>
                                                                                            <p>Please enter correct address</p>
                                                                                        </>}
                                                                                    </>
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
                                            <div style={{border:"1.5mm ridge #CED4DA",height:"130px",position:"relative",padding:1,backgroundColor:"#807f7f",borderRadius:5}}>
                                                <InputNumber  value={show_value.to_value} min="0"
                                                              max="3"
                                                              controls={false}
                                                              onChange={(value) =>{
                                                                  if(value != null){
                                                                      // console.log("regex3.test",regex3.test(value));
                                                                      // console.log("show value",value);
                                                                      if(regex3.test(value)){
                                                                          set_show_value({...show_value,to_value:value})

                                                                      }
                                                                  }
                                                              }}
                                                              size={"large"} autoFocus={false} style={{width:"319px",height:"38px",backgroundColor:"#bcbbbb"}} prefix={"$"} />
                                                <Row gutter={[24,6]} style={{padding:2}}>
                                                    <Col span={12} style={{}}>
                                                        <Row gutter={[24,1]}>
                                                            <Col span={24}>
                                                                {transaction_data.to_coin_symbol != 'test' && (
                                                                    <>
                                                                        <p style={{display:"inline-block",justifySelf:"left"}}>Balacne : </p>
                                                                        <p style={{display:"inline-block",justifySelf:"right",left:10}}>{((transaction_data.to_balance/(Math.pow(10,transaction_data.to_coin_decimals)))-(transaction_data.to_balance== 0  ? 0 : 0.001 )).toFixed(3)}</p>
                                                                    </>
                                                                )}
                                                            </Col>
                                                            <Col span={24}>
                                                                {transaction_data.to_coin_symbol != 'test' && (
                                                                    <>
                                                                        <p style={{
                                                                            display: "inline-block",
                                                                            justifySelf: "right"
                                                                        }}>{transaction_data.to_coin_symbol}</p>
                                                                    </>
                                                                )}
                                                            </Col>
                                                            <Col span={24}>
                                                                {regex2.test(transaction_data.to_coin_address) && (
                                                                    <p style={{
                                                                        display: "inline-block",
                                                                        justifySelf: "right",
                                                                    }}>V1 standard</p>
                                                                )}
                                                                {regex.test(transaction_data.to_coin_address) && (
                                                                    <p style={{
                                                                        display: "inline-block",
                                                                        justifySelf: "right",
                                                                    }}>V2 standard</p>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={12} style={{height:"80px",justifyContent:"center",alignItems:"center",width:"100%",paddingTop:10,paddingLeft:90}}>
                                                        {transaction_data.to_coin_symbol === "APT" ? <><Image src={"https://cryptologos.cc/logos/aptos-apt-logo.svg?v=035"} preview={false} fallback={APT_logo} style={{height:"60px",width:"60px",justifyContent:"center",alignItems:"center",display:"inline-block",top:10}}></Image></>:<>
                                                            {regex.test(transaction_data.to_coin_address) && (async () => {
                                                                    let respone = await aptos.view({payload:{
                                                                            function:option_coin_address.function.view_v2_coin_icon_url(),
                                                                            typeArguments:[option_coin_address.coin_meta_date],
                                                                            functionArguments:[transaction_data.to_coin_address]
                                                                        }})
                                                                    if (respone[0] != undefined) {
                                                                        set_transaction_data({
                                                                            ...transaction_data,
                                                                            to_icon_url: respone[0] as string
                                                                        })
                                                                    }
                                                                    return (
                                                                        <Image src={respone[0] as string} fallback={Diffusion_logo_2}></Image>
                                                                    )
                                                                }
                                                            )}
                                                            {items.find(items =>{
                                                                if(items.value == transaction_data.to_coin_symbol && items.coin_url != ''){
                                                                    <Image src={items.coin_url} fallback={Diffusion_logo_2}></Image>
                                                                }
                                                            })}
                                                        </>}
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24} style={{height:"140px",backgroundColor:"",display:"inline-block"}}>
                                <Row style={{paddingTop:10}}>
                                    <Col span={16}>
                                        <div style={{border:"1.5mm ridge #CED4DA",backgroundColor:"#807f7f",width:"inherit",height:"120px",borderRadius:5}}>
                                            <Row style={{height:"inherit",width:"inherit" ,padding:5}}>
                                                <Col span={5} style={{height:"93px",width:"inherit" ,backgroundColor:"",margin:"1% 0.3%",justifyContent:"center",alignItems:"center",display:"flex"}}>
                                                    <><Image src={Diffusion_logo_2} fallback={APT_logo} style={{height:"95%",width:"95%",transform:"scale(1)",borderRadius:10}} preview={false}></Image></>
                                                </Col>
                                                <Col span={4} style={{height:"93px",width:"inherit" ,backgroundColor:"",margin:"1% 0.5%",justifyContent:"center",alignItems:"center",display:"flex"}}>
                                                    <div style={{border:"5px dashed",width:"100px",height:"10px",borderColor:"rgba(221,221,221,0.94)"}}></div>
                                                    <RightOutlined  style={{justifySelf:"left",alignSelf:"left",fontSize:50,transform:"scale(1.5)"}}/>
                                                </Col>
                                                <Col span={5} style={{height:"93px",width:"inherit" ,backgroundColor:"",margin:"1% 0.3%",justifyContent:"center",alignItems:"center",display:"flex"}}>
                                                    {segement_select == 'Pontem' && (<><Image src={Pontem_logo} fallback={APT_logo} style={{height:"100%",width:"100%",transform:"scale(1.5)"}} preview={false}></Image></>)}
                                                    {segement_select == 'Thala' && (<><Image src={Thala_logo} fallback={APT_logo} style={{height:"100%",width:"100%",transform:"scale(0.9)",borderRadius:"50%"}} preview={false}></Image></>)}
                                                    {segement_select == 'Cellea' && (<><Image src={Cellea_logo} fallback={APT_logo} style={{height:"100%",width:"100%",transform:"scale(2.5)",borderRadius:"50%"}} preview={false}></Image></>)}
                                                </Col>
                                                <Col span={4} style={{height:"93px",width:"inherit" ,backgroundColor:"",margin:"1% 0.5%",justifyContent:"center",alignItems:"center",display:"flex"}}>
                                                    <div style={{border:"5px dashed",width:"100px",height:"10px",borderColor:"rgba(221,221,221,0.94)"}}></div>
                                                    <RightOutlined  style={{justifySelf:"left",alignSelf:"left",fontSize:50,transform:"scale(1.5)"}}/>
                                                </Col>
                                                <Col span={5} style={{height:"93px",width:"inherit" ,backgroundColor:"#154cc1",margin:"1% 0.3%",justifyContent:"center",alignItems:"center",display:"flex"}}></Col>
                                            </Row>
                                        </div>
                                    </Col>
                                    <Col span={7} offset={1}>
                                        <div style={{border:"1.5mm ridge #CED4DA",borderRadius:5,backgroundColor: "#807f7f",width:"inherit",height:"120px",padding:1,justifyContent:"center",alignItems:"center",display:"flex",paddingTop:18}}>
                                            <motion.div className={"box"}
                                                        whileHover={{scale: 1.03}}
                                                        whileTap={{scale: 0.95}}
                                                        transition={{type: "spring", stiffness: 400, damping: 25}}
                                            >
                                                <button className={"rainbow"} style={{height: "80px"}}>
                                                    Swap
                                                </button>
                                            </motion.div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={6}>

                </Col>
                {open_box && (
                    <>
                        <Confirm_box states={open_box} coin_data={coin_data}/>
                    </>
                )}

            </Row>
        </>
    )
}


export default New_swap_page

const Confirm_box : React.FC <{states:boolean,coin_data:Coin_data}> = ({states,coin_data})=>{
    const [clicked,set_clicked]=useState(false);
    const [box_state,set_box_state]=useState(false);

    const close =()=>{
        if(clicked){
            set_box_state(false)
        }else{
            set_box_state(true)
        }
    }
    useEffect(() => {
        set_box_state(true)
    }, [states]);
    return(
        <>
            <Modal
                disableEnforceFocus
                disableAutoFocus
                open={box_state}
                onClose={close}
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
                                //console.log("clicked", e.nativeEvent.isTrusted);
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