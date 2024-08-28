import { Card, Col, message, Row, Segmented, Statistic, theme} from "antd";
import React, {useEffect,  useState} from 'react';
import APT_LOGO from '../logo/aptos-apt-logo.svg';

import {Content} from "antd/lib/layout/layout";
import {
    AppstoreOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
    BarsOutlined,
    CopyOutlined, FallOutlined,
    RiseOutlined
} from "@ant-design/icons";
import {Bounce, toast, ToastContainer} from "react-toastify";

import copy from "copy-to-clipboard";
import { PieChart } from '@mui/x-charts/PieChart';


import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
import {Aptos, AptosConfig, MoveValue, Network} from "@aptos-labs/ts-sdk";
import Claim_card_user_page from "./claim_card";
import {Link} from "react-router-dom";
import {diffusion} from "@/src/setting.tsx";

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
interface Bet_card_data{
    a_win:string;
    b_win:string;
    c_win:string;
    bet:string;
    expired_time:string;
    pair:SavePair;
    time:string;
    which:string;
}
interface Badges{
    name : string;
    url : string;
}
interface Profile{
    save_icon:{
        icon:string;
        name:string;
    };
    save_bet_card:Bet_card_data[];
    save_badges:Badges[];
    save_level:{
        diffusion_point:string;
        level:string;
        lose:string;
        win:string;
    }

}
interface Result_Data{
    save_data1:Bet_card_data;
    save_can_claim:boolean;
    save_result:string;
}
interface Real_Result_Data{
    save_data1:SavePair;
    save_can_claim:boolean;
    save_result:string;
}
interface Helper{
    account:string;
    helper_contribute:string[];
    helper_point:string;
    need_admin:boolean;
    pay_margin:boolean;
    upload_times:string;
    wrong_times:string;
}


const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

const have_card_data :Result_Data[] = [];
const How_many_claim_card:React.FC<{profile_data:Profile,result_data:Result_Data[] ,which1:string}> = ({profile_data,result_data,which1}) =>{
    if (!profile_data) return null;
    if (!result_data) return null;
    const empty_vector:Result_Data[]=[];
    //const [input_data, set_input_data]=useState<Result_Data>();
    const filteredPairs = profile_data.save_bet_card.filter(pair => {
        if (which1 === "All") {
            return true; // 返回所有 bet cards
        } else if (which1 === "Claim") {
            // 在 result_data 中查找匹配的 pair
            // console.log(`pair.name : ${pair.pair.pair_name }`)
            // console.log(`pair.which : ${pair.which}`)
             result_data.filter(result =>{
                if(pair.pair.pair_name == result.save_data1.pair.pair_name){
                    if(pair.pair.expired_time == result.save_data1.expired_time){
                        if(pair.which == result.save_result){
                            const new_data:Result_Data  = {
                                save_data1:pair,
                                save_can_claim:result.save_can_claim,
                                save_result:result.save_result,
                            }
                            //set_input_data(new_data)
                            empty_vector.push(new_data);
                        }
                    }
                }
            })
            const matchingResult = result_data.find(result =>
                    result.save_data1.pair.pair_name === pair.pair.pair_name &&
                    result.save_data1.pair.expired_time === pair.expired_time
                // console.log(`result which : ${result.save_result} result naem : ${result.save_data1.pair.pair_name} `)
            );

            //console.log(`matchingResult: ${matchingResult}`)
            // 如果匹配且 save_result 和 save_can_claim 都为 true
            return matchingResult?.save_result === pair.which && matchingResult?.save_can_claim === true;
        }
        return false;
    });
    const combinedData = filteredPairs.map(pair => {
        const matchingResult = result_data.find(result =>
            result.save_data1.pair.pair_name === pair.pair.pair_name &&
            result.save_data1.pair.expired_time === pair.pair.expired_time
        );
        // if(matchingResult){
        //     console.log(`match data : ${matchingResult.save_data1}`)
        //     console.log(`save_result : ${ matchingResult.save_result}`);
        //     console.log(`pair.claim : ${matchingResult.save_can_claim}`)
        //     ;}
        // 创建一个新的 Result_Data 对象，包含 Bet card 数据和对应的 result
        return {
            save_data1: pair, // 用户的 Bet card 数据
            save_can_claim: matchingResult?.save_can_claim || false,
            save_result: matchingResult?.save_result || ''
        } as Result_Data;


    });

    // console.log(`combinedData : ${combinedData.length}`)
    //     console.log(`save_result : ${ matchingResult.save_result}`);
    //     console.log(`pair.claim : ${matchingResult.save_can_claim}`)
    // useEffect(() => {
    //     empty_vector.length = 0;
    // },[filteredPairs]);
    return (
        <>
            {which1 === "Claim" &&
                <Row gutter={24}>
                    {empty_vector.map((pair, index) => (

                        <Claim_card_user_page  key={index}  profile_data={profile_data} result_data={pair}/>
                    ))}
                </Row>
            }
            {which1 === "All" &&
                <Row gutter={24}>
                    {combinedData.map((pair, index) => (

                        <Claim_card_user_page  key={index}  profile_data={profile_data} result_data={pair}/>
                    ))}
                </Row>
            }

        </>
    );
}
const User_page:React.FC<{profile_data:Profile,result_data:Real_Result_Data[] ,move_data:MoveValue[],helper_list:Helper}> = ({profile_data,result_data,move_data,helper_list}) => {
    const { account, signAndSubmitTransaction } = useWallet();
    const [right_of_segement,setright_of_segement]=useState<string>('Claim');
    const [helper_point,set_helper_point]=useState<string>('');
    const [wrong_time,set_wrong_time]=useState<string>('');
    const [value,set_value]= useState<string>('0');
    const [user_address,set_user_address]=useState<string>("hello") ;
    const [user_gain,set_user_gain]=useState<string>('0');
    const [user_lost,set_user_lost]=useState<string>('0');
    const [data_go_claim_card,set_data_go_claim_card]=useState<Result_Data[]>();
    const [move , set_move]=useState(false);

    const [pie_data,set_pie_data] = useState([
        { id: 0, value: 0, label: 'APT' },
        { id: 1, value: 0, label: 'zUSDC' },
        { id: 2, value: 0, label: 'wUSDC' },
        { id: 3, value: 0, label: 'zUSDT' },
        { id: 4, value: 0, label: 'wUSDT' },]);
    let [a,seta] =useState(0);
    let [b,setb]= useState(0);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const copy_address_button =() =>{
        copy(user_address);
        toast.success("Success Copy !", {
            position: "bottom-right"
        });
    }

    const compare_data = () =>{
        // have_card_data    Result_Data
        //result_data  -Real_Result_Data
        //
        let length1 =profile_data.save_bet_card.length;
        let length2 =result_data.length;
        for (let i = 0; i < length1; i++) {
            let j=0;
            for ( j=0;j < length2; j++) {
                if(profile_data.save_bet_card[i].pair.pair_name === result_data[j].save_data1.pair_name){
                    if(profile_data.save_bet_card[i].pair.expired_time === result_data[j].save_data1.expired_time){
                        const new_data : Result_Data ={
                            save_data1:profile_data.save_bet_card[i],
                            save_can_claim:result_data[j].save_can_claim,
                            save_result:result_data[j].save_result
                        }
                        have_card_data.push(new_data);
                    }
                }
            }
        }
        // console.log(`result_data 0: ${result_data[0].save_result}`)
        // console.log(`result_data 1: ${result_data[1].save_result}`)
        // console.log(`result_data 2: ${result_data[2].save_result}`)
        set_data_go_claim_card(have_card_data);
        // console.log(`have_card_data length: ${have_card_data.length}`)
        // console.log(`have_card_data 0: ${have_card_data[0].save_can_claim}`)
        // console.log(`have_card_data 0: ${have_card_data[0].save_result}`)
        // console.log(`have_card_data 0: ${have_card_data[0].save_data1.pair.pair_name}`)
    }

    const devnet_fatch_pie_data = () =>{
        if (!account) return [];

        set_user_address(account.address)
        try{
            const promise = aptos.account.getAccountAPTAmount({accountAddress:account.address});
            promise.then(balance => {

                let real_balance = balance /100000000;
                const updata_pie_data = [...pie_data];
                updata_pie_data[0]={...updata_pie_data[0],value: real_balance}
                set_pie_data(updata_pie_data);
                const url = 'https://api.dexscreener.com/latest/dex/tokens/0x1::aptos_coin::AptosCoin';
                fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } })
                    .then(response => response.json())
                    .then(response => {
                        const  priceNative = response.pairs[0].priceNative;

                        const apt = real_balance*priceNative;
                        const wusdc = aptos.account.getAccountCoinAmount({accountAddress:account.address,coinType: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T" as `${string}::${string}::${string}`} );
                        const usdt = aptos.account.getAccountCoinAmount({accountAddress:account.address,coinType: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC" as `${string}::${string}::${string}`} );
                        wusdc.then(balance =>seta(balance))
                        usdt.then(balance =>setb(balance))
                        let amount =(a+b+apt).toFixed(2).toString();
                        set_value(amount);
                    })

            }).catch(error => {
                console.error('Error fetching balance:', error);
            });
        }catch (error:any){
            console.log(error);
        }
    }


    const submit_transaction_pay_margin = async () => {
        const transaction: InputTransactionData = {
            data: {
                function: diffusion.function.apply_to_be_helper(),
                functionArguments: []
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;
            // message.success(
            //
            // )
            toast.success(<span>
                        hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                    </span>, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

        } catch (error: any) {
            console.log(error);
            message.error(`please try again`);
        } finally {


        }
    }


    // const feeds = [new PublicKey('H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG')]
    // const pythConnection = new PythConnection(connection, pythPublicKey, 'confirmed', feeds)
    // pythConnection.onPriceChangeVerbose((productAccount, priceAccount) => {
    //     // The arguments to the callback include solana account information / the update slot if you need it.
    //
    //     const product = productAccount.accountInfo.data.product
    //     const price = priceAccount.accountInfo.data
    //
    //     // sample output:
    //     // SOL/USD: $14.627930000000001 ±$0.01551797
    //     if (price.price && price.confidence) {
    //         // tslint:disable-next-line:no-console
    //         console.log(`${product.symbol}: $${price.price} \xB1$${price.confidence}`)
    //     } else {
    //         // tslint:disable-next-line:no-console
    //         console.log(`${product.symbol}: price currently unavailable. status is ${PriceStatus[price.status]}`)
    //     }
    //     pythConnection.stop()
    //
    // })

    // const deal_with_date = () =>{
    //      const new_data : Result_Data = {
    //          save_data1:profile_data.save_bet_card
    //          save_can_claim:
    //      }
    // }
    //  useEffect(() => {
    //          empty_vector.length = 0;
    //      },[account]);

    useEffect(() => {
        //pythConnection.start()
        if(move_data[0] && move_data[1]){
            set_helper_point(helper_list.helper_point);
            set_wrong_time(helper_list.wrong_times);
        }

        set_user_gain((parseFloat(profile_data.save_level.win)/100000000).toFixed(2).toString());
        set_user_lost((parseFloat(profile_data.save_level.lose)/100000000).toFixed(2).toString());
        set_move(move_data[1] as  boolean);
        devnet_fatch_pie_data();
        compare_data();

    },[account,profile_data]);
    return (
        <>
            <Content style={{padding: '15px 30px'}}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                    <Col span={24}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 620,
                                minWidth: 1200,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={6}>
                                    <Card  style={{height:580}}>
                                        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 },{ xs: 8, sm: 16, md: 24, lg: 32 }]}>
                                            <Col span={24}>
                                                <Card style={{height: 260, backgroundColor: "#f4f4f1"}}>
                                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                        <Col span={24}>
                                                            <img
                                                                src={profile_data.save_icon.icon}
                                                                alt={"img1"}
                                                                style={{height:210,width:210, borderRadius: 20,backgroundColor:"white"}}>
                                                            </img>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                                <br/>
                                                <Card style={{height: 64, backgroundColor: "#f4f4f1"}}>
                                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                        <Col span={24}>
                                                            <Card style={{backgroundColor:"#60605b",color:"#f4f4f1",position:"relative",top:-18,height:50}}>
                                                                <h1 style={{position:"relative",top:-42,fontSize:50,color:"white"}}>{profile_data.save_icon.name}</h1>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                                <br/>
                                                <Card style={{height: 168, backgroundColor: "#f4f4f1"}}>
                                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{position:"relative",top:-10}}>
                                                        <Col span={24}>
                                                            <Card style={{backgroundColor:"white",height:60}}>
                                                                <Statistic
                                                                    title="Gain"
                                                                    value={user_gain}
                                                                    precision={2}
                                                                    valueStyle={{ color: '#3f8600' }}
                                                                    prefix={<RiseOutlined />}
                                                                    suffix=" APT"
                                                                    style={{position:"relative",top:-25}}
                                                                />
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                    <br/>
                                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{position:"relative",top:-12}}>
                                                        <Col span={24}>
                                                            <Card style={{backgroundColor:"white",height:60}}>
                                                                <Statistic
                                                                    title="Lost"
                                                                    value={user_lost}
                                                                    precision={2}
                                                                    valueStyle={{ color: '#cf1322' }}
                                                                    prefix={<FallOutlined />}
                                                                    suffix=" APT"
                                                                    style={{position:"relative",top:-25}}
                                                                />
                                                            </Card>

                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={18}>
                                    <Card  style={{height:580}}>
                                        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 },{ xs: 8, sm: 16, md: 24, lg: 32 }]}>
                                            <Col span={16}>
                                                <Card style={{height:345,backgroundColor:"#f4f4f1"}}>
                                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                        <Col span={8}>
                                                            <h3>Balance of User</h3>
                                                            <h2>${value}</h2>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={24}>

                                                            <Card style={{height:250}}>
                                                                <Row>
                                                                    <Col span={24} >
                                                                        <PieChart
                                                                            series={[
                                                                                {
                                                                                    data: pie_data,
                                                                                    innerRadius: 60,
                                                                                    outerRadius: 90,
                                                                                    paddingAngle: 4,
                                                                                    cornerRadius: -2,
                                                                                    startAngle: 0,
                                                                                    endAngle: 360,
                                                                                    cx: 150,
                                                                                    cy: 95,
                                                                                }
                                                                            ]}
                                                                            height={200}
                                                                        />
                                                                        <img alt={"apt_logo"} src={APT_LOGO} style={{height:80,width:80,position:"relative",top:-140,left:116}}></img>
                                                                    </Col>
                                                                </Row>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                            <Col span={8}>
                                                <Card style={{height: 100, backgroundColor: "#f4f4f1"}}>
                                                    <Row style={{position:"relative",top:-10}}>
                                                        <Col span={21}>
                                                            User address:
                                                        </Col>
                                                        <Col span={3}>
                                                            <CopyOutlined  style={{fontSize:25}} onClick={copy_address_button}/>
                                                            <ToastContainer
                                                                position="bottom-right"
                                                                autoClose={5000}
                                                                hideProgressBar={false}
                                                                newestOnTop={false}
                                                                closeOnClick
                                                                rtl={false}
                                                                pauseOnFocusLoss
                                                                draggable
                                                                pauseOnHover
                                                                theme="light"
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row style={{position:"relative",top:-10}}>
                                                        <Col span={24}>
                                                            <Card style={{backgroundColor:"#60605b",color:"#f4f4f1",height:50}}>
                                                                <Row>
                                                                    <div style={{position:"relative",top:-10}}>
                                                                        {user_address.substring(0, 28)}
                                                                    </div>
                                                                </Row>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                                <br/>
                                                <Card style={{height: 100, backgroundColor: "#f4f4f1"}}>
                                                    <Row>
                                                        <Col span={24}>
                                                            <Card style={{height:80 ,position:"relative",top:-14}}>
                                                                {move_data[0] ?
                                                                    <>
                                                                        {move ?  <Statistic
                                                                            title="Helper Point"
                                                                            value={helper_point}
                                                                            precision={2}
                                                                            valueStyle={{ color: '#3f8600' }}
                                                                            prefix={<ArrowUpOutlined />}
                                                                            suffix=" pt"
                                                                            style={{position:"relative",top:-14}}
                                                                        /> : <>
                                                                            <p>Although you are a helper,but you need to pay the margin first.</p>
                                                                        </>}
                                                                    </>

                                                                    :<>
                                                                        <p>Sorry , you are not helper</p>
                                                                    </> }
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                                <br/>
                                                <Card style={{height: 100, backgroundColor: "#f4f4f1"}}>
                                                    <Row>
                                                        <Col span={24}>
                                                            <Card style={{height:80 ,position:"relative",top:-14}}>
                                                                {move_data[0] ?
                                                                    <>
                                                                        {move ? <Statistic
                                                                            title="Wrong Times"
                                                                            value={wrong_time}
                                                                            precision={2}
                                                                            valueStyle={{ color: '#cf1322' }}
                                                                            prefix={<ArrowDownOutlined />}
                                                                            suffix=" t"
                                                                            style={{position:"relative",top:-14}}
                                                                        /> : <>
                                                                            <button className="custom-btn btn-2"
                                                                                    onClick={() => {
                                                                                        submit_transaction_pay_margin()
                                                                                        set_move(true)
                                                                                    }}>Pay margin
                                                                            </button>
                                                                        </>}
                                                                    </>

                                                                    : <div style={{
                                                                        position: "relative",
                                                                        left: -15,
                                                                        top: -15
                                                                    }}>
                                                                        <Link to={"/Bet"}>
                                                                            <button className="custom-btn btn-2"
                                                                                    onClick={() => {
                                                                                    }}>Go Bet
                                                                            </button>
                                                                        </Link>
                                                                    </div>}
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col span={24}>
                                                <Card title={<span>{<Segmented options={segemat_options} onChange={check =>{setright_of_segement(check)}} />}</span>} style={{height: 170, backgroundColor: "#f4f4f1",padding:1}}>
                                                    <Segment_position right={right_of_segement} profile_data={profile_data}  result_data={data_go_claim_card ? data_go_claim_card : have_card_data}/>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <ToastContainer
                                    position="bottom-right"
                                    autoClose={5000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="light"
                                />
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Content>
        </>
    );
}

const Segment_position :React.FC<{ profile_data:Profile,result_data:Result_Data[] ,right:string}> = ({ right,result_data,profile_data})=>{
    return(
        <>

            <How_many_claim_card result_data={result_data}  profile_data={profile_data} which1={right} />


            {/*    {(right=="Claim") &&*/}
            {/*        <Row>*/}
            {/*            <Col span={24}>*/}
            {/*                    */}
            {/*                <p>aaa</p>*/}
            {/*            </Col>*/}
            {/*        </Row>*/}
            {/*}*/}
            {/*    {(right=="") &&*/}
            {/*    <Row>*/}
            {/*        <Col span={24}>*/}
            {/*            <Card>*/}

            {/*            </Card>*/}
            {/*        </Col>*/}
            {/*    </Row>*/}
            {/*}*/}
        </>
    )
}
const segemat_options = [
    { label: 'Claim',
        value: 'Claim',
        icon: <BarsOutlined />  },
    { label: 'All',
        value: 'All',
        icon: <AppstoreOutlined />},
]


export default User_page;
export { How_many_claim_card };