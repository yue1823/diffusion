import {Col, Row ,Image, message} from 'antd';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Modal from "@mui/material/Modal";
import {Box} from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {ArrowLeftOutlined, ArrowRightOutlined, RedoOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import CountdownTimer from '../user/Count_time';
import {Sleepy_cat} from './sleepy_cat';
import {InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react';
import { diffusion } from '../setting';
import {Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
interface Profile{
    data: {
        save_1: any
        save_2: Bet_card_data[],
        save_3: any,
        save_4: any,
        save_5: any
    }
}
interface Bet_card_data{
    a_win:string;
    b_win:string;
    c_win:string;
    bet:string;
    expired_time:string;
    pair:SavePair;
    time:string;
    which:number;
}
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
interface Data {
    fee:any,
    save_Cylinder_Pairs:any,
    save_Helper_list:any,
    save_Pair_result_store:{
        save_admin_set_result:boolean[],
        save_can_claim:boolean[],
        save_chips:any,
        save_lost_pair:any,
        save_pair:SavePair[],
        save_result:any,
        save_user:any
    },
    save_badges_list:any,
    save_helper_chance:any
}
// const options = {
//     method: 'GET',
//     headers: {accept: 'application/json', 'X-API-KEY':`${diffusion.x_api_key}`}
// };
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);
const BarChart: React.FC<{data1:{win:number,lose:number}}> = ({data1}) => {
    const data = {
        labels: ['win', 'lose'],
        datasets: [
            {
                label: '',
                data: [data1.win,data1.lose],
                backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(192,75,155,0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)','rgb(192,75,134)'],
                borderWidth: 1,
            }
            // {
            //     label: [''],
            //     data: [ 59],
            //     backgroundColor: ['rgba(192,75,155,0.2)'],
            //     borderColor: ['rgb(192,75,134)'],
            //     borderWidth: 1,
            // }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Gain',
            },
        },
    };
    useEffect(() => {

    }, [data]);
    return <Bar  data={data} options={options} style={{width:"auto",height:"auto"}}/>;
};
const Is_telegrame_web_my_card: React.FC <{profile_date:Profile,diffusion_data:Data }>= ({profile_date,diffusion_data}) => {
    const [can_claim_pair , set_can_claim_pair]=useState<Bet_card_data[]>([]);
    const [user_have_pair, set_user_have_pair]=useState<Bet_card_data[]>([]);
   // const [finish_pair,set_finish_pair]=useState<Bet_card_data[]>([]);
    const [wrong_pair,set_wrong_pair]=useState<Bet_card_data[]>([]);
    const [reload_profile,set_reload_profile]=useState<Profile>();
    const [big_cols, setBigCols] = useState<JSX.Element[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const ITEMS_PER_PAGE = 3;
    const currentItems = big_cols.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);
    const [loading, setLoading] = useState(true);
    const {account}=useWallet();
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - ITEMS_PER_PAGE);
        }
    };

        // 处理“后一个”按钮点击
    const handleNext = () => {
        if (currentIndex + ITEMS_PER_PAGE < big_cols.length) {
            setCurrentIndex(currentIndex + ITEMS_PER_PAGE);
        }
    };



    const solve_data = () =>{
        let pair = [];
        for(let i =0;i<profile_date.data.save_2.length;i++){
            if( profile_date.data.save_2[i].pair.can_bet == true){
                pair.push(profile_date.data.save_2[i])
            }
        }
        //console.log('finsih pair', pair);
        //set_finish_pair(pair);

    }
    const reload_button = async ()=>{
        if (!account){
            message.error("please connect wallet")
            return [];
        }
        if (profile_date.data.save_2.length < 1 ){
            // message.error("")
            return [];
        }
        try{

            //console.log("steps",1);
             const aptos_response=await aptos.account.getAccountResource({accountAddress:account.address,resourceType:diffusion.function.diffusion_account_tree()})
            //      .then( response => {
            //     console.log("steps",2);
            //
            //         if(response ){
            //
            //             console.log("steps",3);
            //             let new_profile={
            //                 data:{save_1:response.save_1,
            //                     save_2:response.save_2,
            //                     save_3:response.save_3,
            //                     save_4:response.save_4,
            //                     save_5:response.save_5,
            //                 }
            //
            //             }
            //
            //
            //             console.log("new_profile",new_profile.data.save_2);
            //             console.log("reload_profile 1",reload_profile );
            //             set_reload_profile(new_profile)
            //             console.log("reload_profile 2",reload_profile);
            //             console.log("steps",5);
            //             // if (reload_profile){
            //             //
            //             //     console.log("steps",6);
            //             //     find_pair_of_user(reload_profile);
            //             //     console.log("steps",7);
            //             //
            //             // }
            //
            //
            //         }
            //
            //     }
            // );

            const new_vector:Bet_card_data[] =[];
            //console.log("aptos respone save 2 ",aptos_response);
             for(let i=0;i<aptos_response.save_2.length;i++){
                 //console.log("aptos respone i",i,aptos_response.save_2[i].which);
                 let new_data:Bet_card_data = {
                     a_win:aptos_response.save_2[i].a_win,
                     b_win:aptos_response.save_2[i].b_win,
                     c_win:aptos_response.save_2[i].c_win,
                     bet:aptos_response.save_2[i].bet,
                     expired_time:aptos_response.save_2[i].expired_time,
                     pair:aptos_response.save_2[i].pair,
                     time:aptos_response.save_2[i].time,
                     which:Number(aptos_response.save_2[i].which),
                 }
                 //console.log("new_data bet card i",i,new_data.which);
                 new_vector.push(new_data)
             }
            //console.log("new_vector",JSON.parse(JSON.stringify(new_vector)));
            // console.log("new_vector i",0,new_vector[0].which);
            // console.log("new_vector i",1,new_vector[1].which);
            // console.log("new_vector i",2,new_vector[2].which);
             if(reload_profile){
                 set_reload_profile({
                     data:{
                         save_1:reload_profile.data.save_1,
                         save_2:JSON.parse(JSON.stringify(new_vector)),
                         save_3:reload_profile.data.save_3,
                         save_4:reload_profile.data.save_4,
                         save_5:reload_profile.data.save_5
                     }
                 })
                 //console.log("reload_profile 2",reload_profile);
             }else{
                 set_reload_profile({
                     data:{
                         save_1:aptos_response.save_1,
                         save_2:JSON.parse(JSON.stringify(new_vector)),
                         save_3:aptos_response.save_3,
                         save_4:aptos_response.save_4,
                         save_5:aptos_response.save_5
                     }
                 })
                // console.log("reload_profile 2",reload_profile);
             }

            //console.log("aptos respone",response_aptos);

            // await fetch(`https://aptos-testnet.nodit.io/v1/accounts/${account.address}/resource/${diffusion.function.diffusion_account_tree()}`, options)
            //     .then(response => response.json())
            //     .then((response) => {
            //         console.log('respone data',response)
            //         if(response){
            //
            //             find_pair_of_user(response);
            //         }
            //     }).catch(error =>{
            //         console.log(error)
            //     });
            //console.log("steps",5);
        }catch(e:any){
            console.log(`profile :${e}`)
        }

    }
    useEffect(() => {
        // 当 reload_profile 更新时调用 find_pair_of_user
        if (reload_profile) {
            console.log("reload_profile updated", reload_profile);
            find_pair_of_user(JSON.parse(JSON.stringify(reload_profile)));
        }
    }, [reload_profile]);
    const find_pair_of_user =(profile_date1:Profile)=>{
        let have_pair:Bet_card_data[] =[];
        let wrong_pair:Bet_card_data[]  =[];
        let right_pair:Bet_card_data[]  = [];
        // console.log('profile_date1 i',0,profile_date1.data.save_2[0].which);
        // console.log('profile_date1 i',1,profile_date1.data.save_2[1].which);
        // console.log('profile_date1 i',2,profile_date1.data.save_2[2].which);
        for(let j = 0 ; j<profile_date1.data.save_2.length;j++){
            for (let i=0; i < diffusion_data.save_Pair_result_store.save_pair.length;i++){

                if(profile_date1.data.save_2[j].pair.pair_name === diffusion_data.save_Pair_result_store.save_pair[i].pair_name){
                    //console.log(`profile_date`,profile_date.data.save_2[j].pair.pair_name)
                   // console.log(`diffusion_data.`,diffusion_data.save_Pair_result_store.save_pair[i].pair_name)
                    if(profile_date1.data.save_2[j].pair.expired_time === diffusion_data.save_Pair_result_store.save_pair[i].expired_time){

                       // console.log( ' diffusion_data.save_Pair_result_store.save_result[3+i*2]',diffusion_data.save_Pair_result_store.save_result[3+i*2])
                        if(diffusion_data.save_Pair_result_store.save_result[3+i*2] != 9){
                            if(profile_date1.data.save_2[j].which !=  diffusion_data.save_Pair_result_store.save_result[4+i*2] ){
                                // console.log('4+i*2',3+i*2)
                                // console.log('4+i*2 data',diffusion_data.save_Pair_result_store.save_result[3+i*2])
                                wrong_pair.push(profile_date1.data.save_2[j])
                                //console.log( 'wrong_pair',wrong_pair)
                            }
                            if(profile_date1.data.save_2[j].which === diffusion_data.save_Pair_result_store.save_result[4+i*2] ){

                                right_pair.push(profile_date1.data.save_2[j])
                            }
                        }else{
                            //console.log('profile_date1 i',j,profile_date1.data.save_2[j].which)
                            let new_p:Bet_card_data={
                                ...profile_date1.data.save_2[j],
                                which:Number(JSON.parse(JSON.stringify(profile_date1.data.save_2[j].which)))
                            }
                            //console.log('new_p',j,new_p)
                            have_pair.push(new_p)
                        }

                    }
                }
            }
        }
        // console.log('right pair',right_pair);
        // console.log('wrong pair',wrong_pair);
        // console.log('1 have pair',have_pair);
        // console.log('1 have_pair i',0,have_pair[0].which);
        // console.log('1 have_pair i',1,have_pair[1].which);
        // console.log('1 have_pair i',2,have_pair[2].which);
        set_wrong_pair(wrong_pair)
        set_can_claim_pair(right_pair)
        set_user_have_pair(have_pair)
        // console.log('right pair',can_claim_pair);
        // console.log('wrong pair',wrong_pair);
        // console.log('have pair',user_have_pair);
        // if(have_pair.length !=0){
        //     //console.log("big_cols.length",big_cols.length)
        //     set_pair_for_user()
        //   //  console.log("big_cols",big_cols)
        // }
    }
    const set_pair_for_user = () =>{
        const cols: JSX.Element[] = [];
        console.log('right pair',can_claim_pair);
        console.log('wrong pair',wrong_pair);
        console.log('have pair',user_have_pair);
        can_claim_pair.forEach((data,index) => {
            //console.log('can_claim' ,data);
          cols.push(
                <MyCard_bet key={index} status_color={"rgb(5, 240, 40)"} bet_data={data} user_name={profile_date.data.save_1.name}/>
            );
        });
        wrong_pair.forEach((data,index) => {
            //console.log('wrong' ,data);
            cols.push(
                <MyCard_bet key={cols.length+index} status_color={"rgb(240,5,25)"} bet_data={data} user_name={profile_date.data.save_1.name}/>
            );
        });
        user_have_pair.forEach((data,index) => {
            //console.log('have' ,data);
            cols.push(
                <MyCard_bet key={cols.length+index} status_color={"rgb(224,240,5)"} bet_data={data} user_name={profile_date.data.save_1.name}/>
            );
        });
        console.log('Col length',cols.length);
        setBigCols(cols)
        setLoading(false);
    }


    useEffect(() => {
        if (profile_date && diffusion_data) {
            solve_data();
            //console.log('profile_date',profile_date)
            find_pair_of_user(profile_date);
        }
    }, [profile_date, diffusion_data]);

    useEffect(() => {
        if (can_claim_pair.length || wrong_pair.length || user_have_pair.length) {
            set_pair_for_user();
        }
    }, [can_claim_pair, wrong_pair, user_have_pair]);
    // useEffect(() => {
    //     console.log('diffusion_date',diffusion_data);
    //     console.log('profile_date', profile_date);
    //     //console.log('profile_date.save_2', profile_date.data.save_2);
    //     //console.log(profile_date.save_2)
    //     solve_data();
    //     find_pair_of_user();
    //     //set_pair_for_user()
    // }, [profile_date,diffusion_data]);
    // useEffect(() => {
    //
    // }, []);
    return (<>
        <Row style={{paddingLeft:0,paddingRight:0,position:"relative",top:-10}}>
            {/*<Col span={24}>*/}
            {/*    <BarChart/>*/}
            {/*</Col>*/}
            <Col span={10}>
                <Row gutter={[24,8]} >
                    {/*<MyCard_bet status_color={"white"}/>*/}
                    {/*<Col span={24}  style={{border:"solid 0.5px", backgroundColor:"#bbdcbb",height:"16.3vmax",borderRadius:5}}>*/}

                    {/*</Col>*/}
                    {/*<Col span={24}  style={{border:"solid 0.5px", backgroundColor:"#bbdcbb",height:"16.3vmax",borderRadius:5}}>*/}

                    {/*</Col>*/}
                    {/*{big_cols}*/}
                    {loading ? (
                        <div>Loading...</div>  // 显示加载指示
                    ) : (
                        <>
                            {currentItems.map((item, index) => (
                                <div key={index}>{item}</div>
                            ))}
                        </>
                    )}

                </Row>
            </Col>
            <Col span={12} offset={2}>
                <Row gutter={[24,8]}>
                    <Col span={24} style={{border:"solid 0.5px", backgroundColor:"#bbdcbb",height:"51.5vmax",borderRadius:5,padding:10}}>
                        <Row gutter={[24,6]}>

                            <Col span={24} style={{height: "20vmax"}}>
                                <motion.div
                                    className={"box"}
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.95}}
                                    transition={{type: "spring", stiffness: 500, damping: 60}}
                                    onClick={() => reload_button()}
                                >
                                    <RedoOutlined style={{position: "absolute", fontSize: 18}}/>
                                </motion.div>
                                    <BarChart data1={{
                                        win: profile_date.data.save_5.win as number,
                                        lose: profile_date.data.save_5.lose as number
                                    }}/>
                                    <div style={{
                                        border: "solid 1px",
                                        borderRadius: 5,
                                        borderColor: "rgb(155,158,155)"
                                    }}></div>
                            </Col>
                            <Col span={24}>
                                <div style={{height: "19.5vmax", width: "auto"}}>
                                    <Row gutter={[24, 0]} style={{position: "relative", top: -25}}>
                                        <Col span={24} >
                                            <p style={{textAlign:"center",position:"relative",top:-8}}>Status</p>
                                        </Col>
                                        <Col span={24} style={{position:"relative",top:-5}}>
                                            <div style={{
                                                backgroundColor: `rgb(5, 240, 40)`,
                                                width: "3vmax",
                                                height: "3vmax",
                                                borderRadius: 20
                                            }}></div>
                                            <p style={{textAlign:"center",fontSize:13,position:"inherit",top:"-3vmax"}}>Can Claim</p>
                                            <div style={{
                                                border: "solid 0.5px",
                                                borderRadius: 5,
                                                borderColor: "rgba(155,158,155,0.59)",
                                                width:"25vmax",
                                                position:"relative",
                                                left:"5vmax",
                                                top:"-3vmax"
                                            }}></div>
                                        </Col>
                                        <Col span={24} style={{position:"relative",top:-13}}>
                                            <div style={{
                                                backgroundColor: `rgb(240, 5, 25)`,
                                                width: "3vmax",
                                                height: "3vmax",
                                                borderRadius: 20
                                            }}></div>
                                            <p style={{
                                                textAlign: "center",
                                                fontSize: 13,
                                                position: "inherit",
                                                top:"-3vmax"
                                            }}>Wrong</p>
                                            <div style={{
                                                border: "solid 0.5px",
                                                borderRadius: 5,
                                                borderColor: "rgba(155,158,155,0.59)",
                                                width: "25vmax",
                                                position: "relative",
                                                left: "5vmax",
                                                top:"-3vmax"
                                            }}></div>
                                        </Col>
                                        <Col span={24} style={{position:"relative",top:-19}}>
                                            <div style={{
                                                backgroundColor: `rgb(224, 240, 5)`,
                                                width: "3vmax",
                                                height: "3vmax",
                                                borderRadius: 20
                                            }}></div>
                                            <p style={{
                                                textAlign: "center",
                                                fontSize: 13,
                                                position: "inherit",
                                                top:"-3vmax"
                                            }}>Pending</p>
                                            <div style={{
                                                border: "solid 0.5px",
                                                borderRadius: 5,
                                                borderColor: "rgba(155,158,155,0.59)",
                                                width: "25vmax",
                                                position: "relative",
                                                left: "5vmax",
                                                top:"-3vmax"
                                            }}></div>
                                        </Col>
                                        <Col span={24} style={{position:"relative",top:-24}}>
                                            <div style={{
                                                backgroundColor: `rgb(224, 240, 5)`,
                                                width: "3vmax",
                                                height: "3vmax",
                                                borderRadius: 20
                                            }}></div>
                                            <p style={{
                                                textAlign: "center",
                                                fontSize: 13,
                                                position: "inherit",
                                                top:"-3vmax"
                                            }}>Pending</p>
                                            <div style={{
                                                border: "solid 0.5px",
                                                borderRadius: 5,
                                                borderColor: "rgba(155,158,155,0.59)",
                                                width: "25vmax",
                                                position: "relative",
                                                left: "5vmax",
                                                top:"-3vmax"
                                            }}></div>
                                        </Col>
                                    </Row>
                                </div>
                                <div style={{
                                    border: "solid 1px",
                                    borderRadius: 5,
                                    borderColor: "rgb(155,158,155)",
                                    position: "relative", top: -2
                                }}></div>
                            </Col>
                            <Col span={24}>
                            <Row>
                                    <Col span={10}>
                                        <button className={"rainbow"} style={{height:"7vmax",width:"11vmax"}} onClick={handlePrev} disabled={currentIndex === 0}>
                                            <ArrowLeftOutlined style={{position:"relative",right:"1.3vmax"}}/>
                                        </button>
                                    </Col>
                                    <Col span={4}>
                                        <p>{(currentIndex / ITEMS_PER_PAGE) + 1}/{Math.ceil(big_cols.length / ITEMS_PER_PAGE)}</p>
                                    </Col>
                                    <Col span={10}>
                                        <button className={"rainbow"} style={{height:"7vmax",width:"11vmax",textAlign:"center",position:"relative",left:"2vmax"}} onClick={handleNext} disabled={currentIndex + ITEMS_PER_PAGE >= big_cols.length}>
                                            <ArrowRightOutlined style={{position:"relative",right:"1.3vmax"}}/>
                                        </button>
                                    </Col>
                                </Row>
                            </Col>

                        </Row>

                    </Col>
                </Row>
            </Col>
        </Row>




    </>)
}

export default Is_telegrame_web_my_card;

const MyCard_bet: React.FC <{status_color:string,bet_data:Bet_card_data,user_name:string}>=({status_color,bet_data,user_name})=>{
    const { account, signAndSubmitTransaction } = useWallet();
    const handleClose = () => {setOpen(false)};
    const [open, setOpen] = React.useState(false);
    const [whats_pair_need,set_whats_pair_need] =useState({
        bet_name:'',
        left_name:'',
        right_name:'',
        left_url:'',
        right_url:'',
        type:'',
        which:0,
        bet:'',
        win:'',
        expired_date:'',
        true_or_not:"",
    })
    const [input_url,set_input_url]=useState<string>('');
    const [true_of_pair,set_true_of_pair] =useState('');
    const claim_reward = async () =>{
        if (!account) return [];
        //console.log(status_color)
        if(status_color == "rgb(224,240,5)"){
            message.error(`Wait until times up`)
            return [];}
        if(status_color == "rgb(240,5,25)"){
            message.error(`You guess wrong`)
            return [];}
        //console.log('submit')
        const transaction:InputTransactionData = {
            data: {
                function:diffusion.function.claim_reward(),
                typeArguments:[],
                functionArguments:[bet_data.pair.pair_name as string,bet_data.pair.expired_time as string]
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
    useEffect(() => {
        if (status_color === "rgb(5, 240, 40)") {
            set_true_of_pair("true");
        } else if (status_color === "rgb(240, 5, 25)") {
            set_true_of_pair("wrong");
        } else if (status_color === "rgb(224, 240, 5)") {
            set_true_of_pair("pending");
        }
    }, [status_color]);
    useEffect(() => {
       // console.log('bet card data',bet_data)
        //console.log('data',new Date())
        const randomIndex = Math.floor(Math.random()*random_url.length);
        const input_to_flip_card = random_url[randomIndex];
        set_input_url(input_to_flip_card);
        const [firstPart, ddd] = bet_data.pair.pair_name.split(" vs ");
        const [secondPart ,thirdPart]= ddd.split(" - ");
        const new_date = bet_data.pair.expired_time.length==7?`0${bet_data.pair.expired_time.slice(0,1)}/${bet_data.pair.expired_time.slice(1,3)}/${bet_data.pair.expired_time.slice(3,7)}`:`${bet_data.pair.expired_time.slice(0,2)}/${bet_data.pair.expired_time.slice(2,4)}/${bet_data.pair.expired_time.slice(4,8)}`
        if(bet_data.which == 1){
            set_whats_pair_need({
                bet_name: firstPart,
                left_name:firstPart,
                right_name:secondPart,
                left_url: bet_data.pair.left_url,
                right_url: bet_data.pair.right_url,
                type: thirdPart,
                which:bet_data.which,
                bet:bet_data.bet,
                win:bet_data.a_win,
                expired_date: new_date,
                true_or_not: true_of_pair
            })
        }else if(bet_data.which == 2){
            set_whats_pair_need({
                bet_name: "middle",
                left_name:firstPart,
                right_name:secondPart,
                left_url: bet_data.pair.left_url,
                right_url: bet_data.pair.right_url,
                type: thirdPart,
                which:bet_data.which,
                bet:bet_data.bet,
                win:bet_data.b_win,
                expired_date: new_date,
                true_or_not: true_of_pair
            })
        }else if(bet_data.which == 3){
            set_whats_pair_need({
                bet_name:secondPart,
                left_name:firstPart,
                right_name:secondPart,
                left_url: bet_data.pair.left_url,
                right_url: bet_data.pair.right_url,
                type: thirdPart,
                which:bet_data.which,
                bet:bet_data.bet,
                win:bet_data.c_win,
                expired_date: new_date,
                true_or_not: true_of_pair
            })
        }
       // console.log(new_date)
        // console.log('bet_data',bet_data)
        // console.log('bet_data.pair.pairname',bet_data.pair.pair_name)
        // console.log('bet_data.which',bet_data.which)
        // console.log('whats_pair_need',whats_pair_need)
    }, [bet_data, true_of_pair]);


    return(
        <>
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
                <Box sx={{width: "70vmax", height: "65vmax", borderRadius: 5}}>
                    <Row>
                        <Col span={13}>
                            <div style={{
                                border: "solid 0.5px",
                                backgroundColor: "#87CEEB",
                                height: "65vmax",
                                width: "39vmax",
                                borderRadius: 5,
                                backgroundImage: `url(${input_url})`, // 在这里放入你的图片链接
                                backgroundSize: "cover",  // 确保图片覆盖整个 div
                                backgroundPosition: "center",  // 让图片居中显示
                                backgroundRepeat: "no-repeat"  // 防止图片重复
                            }}>
                                 <div style={{height:"5vmax",width:"15vmax",backgroundColor:"rgba(67,67,67,0.6)",position:"absolute",right:"-1vmax",top:"0vmax",borderRadius:5}}>
                                        <p style={{textAlign:"center",color:"rgba(214,214,214,0.95)"}}>{user_name}</p>
                                </div>
                                <div style={{height:"23vmax",width:"23vmax",backgroundColor:"rgba(67,67,67,0.6)",position:"absolute",left:"8vmax",top:"7vmax",borderRadius:5}}>
                                    {whats_pair_need.which === 1 &&
                                        <Image src={whats_pair_need.left_url} preview={false} style={{height:"19vmax",width:"19vmax",position:"relative",left:"2vmax",top:"2vmax"}}></Image>
                                    }
                                    {whats_pair_need.which === 3 &&
                                        <Image src={whats_pair_need.right_url} preview={false} style={{height:"19vmax",width:"19vmax",position:"relative",left:"2vmax",top:"2vmax"}}></Image>
                                    }
                                    {whats_pair_need.which === 2 &&
                                        <Image  src={"data:image/png;base64,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"} fallback="data:image/png;base64,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"
                                                style={{height:"19vmax",width:"19vmax",position:"relative",left:"2vmax",top:"2vmax"}} preview={false}></Image>
                                    }
                                </div>

                                <div style={{height:"30vmax",width:"30vmax",backgroundColor:"rgba(67,67,67,0.75)",position:"absolute",left:"5vmax",top:"33vmax",borderRadius:5}}>
                                    <Row gutter={[24,11]} >
                                        <Col span={24}>
                                            <p style={{textAlign:"center",color:"rgba(214,214,214,0.95)"}}>Bet Card</p>
                                        </Col>
                                        <Col span={24} style={{paddingLeft:20 ,paddingRight:20}}>
                                            <p style={{display: "flex", justifyContent: "space-between"}}>
                                                <span style={{textAlign:"left",color:"rgba(214,214,214,0.95)"}}>Pair:</span>
                                                <span style={{textAlign:"right",color:"rgba(214,214,214,0.95)"}} >{whats_pair_need.left_name} vs {whats_pair_need.right_name}</span>
                                            </p>
                                                <div style={{border:"solid 0.5px",borderColor:"rgba(179,178,178,0.89)"}}></div>
                                        </Col>
                                        <Col span={24} style={{paddingLeft:20 ,paddingRight:20}}>
                                            <p style={{display: "flex", justifyContent: "space-between"}}>
                                                <span style={{textAlign:"left",color:"rgba(214,214,214,0.95)"}}>Choose:</span>
                                                <span style={{textAlign:"right",color:"rgba(214,214,214,0.95)"}} >{whats_pair_need.bet_name}</span>
                                            </p>
                                            <div style={{border:"solid 0.5px",borderColor:"rgba(179,178,178,0.89)"}}></div>
                                        </Col>
                                        <Col span={24} style={{paddingLeft:20 ,paddingRight:20}}>
                                            <p style={{display: "flex", justifyContent: "space-between"}}>
                                                <span style={{textAlign:"left",color:"rgba(214,214,214,0.95)"}}>Bet:</span>
                                                <span style={{textAlign:"right",color:"rgba(214,214,214,0.95)"}} >{(parseFloat(whats_pair_need.bet)/100000000).toFixed(2)}</span>
                                            </p>
                                            <div style={{border:"solid 0.5px",borderColor:"rgba(179,178,178,0.89)"}}></div>
                                        </Col>
                                        <Col span={24} style={{paddingLeft:20 ,paddingRight:20}}>
                                            <p style={{display: "flex", justifyContent: "space-between"}}>
                                                <span style={{textAlign:"left",color:"rgba(214,214,214,0.95)"}}>Date:</span>
                                                <span style={{textAlign:"right",color:"rgba(214,214,214,0.95)"}} >{whats_pair_need.expired_date}</span>
                                            </p>
                                            <div style={{border:"solid 0.5px",borderColor:"rgba(179,178,178,0.89)"}}></div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                        <Col span={9} offset={1}>
                            <Row gutter={[24,11]}>
                                <Col span={24}>
                                    <div style={{
                                        border: "solid 0.5px",
                                        backgroundColor: "#11181c",
                                        height: "18vmax",
                                        width: "29vmax",
                                        borderRadius: 5,
                                    }}>
                                        <p style={{textAlign:"center",position:"relative",color:"rgba(235,229,223,0.76)"}}>Left Time :</p>
                                        <div style={{border:"solid 0.5px",borderColor:"rgba(235,229,223,0.76)",position:"relative",top:"1vmax",width:"25vmax",left:10}}></div>
                                        <div style={{transform: "scale(0.85)",width:"31vmax",position:"relative",right:"1.2vmax",top:"1vmax"}}> <CountdownTimer expiredDate={bet_data.pair.expired_time} yes_or_not={true} /></div>

                                    </div>
                                </Col>
                                <Col span={24}>
                                    <div style={{
                                        border: "solid 0.5px",
                                        backgroundColor: "#11181c",
                                        height: "33vmax",
                                        width: "29vmax",
                                        borderRadius: 5,

                                    }}>
                                        <Sleepy_cat/>
                                        <div style={{border:"solid 1px",width:"3vmax",height:"3vmax",position:"relative",borderRadius:20,backgroundColor:`${status_color}`,top:"-25.3vmax",left:"23.8vmax",borderColor:"rgba(195,193,193,0.94)"}}></div>
                                        <p style={{color:"#fff",fontSize:35,top:"-24vmax",position:"relative",right:"1vmax"}}>{(parseFloat(whats_pair_need.win)/100000000).toFixed(2).toString()}</p>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <div style={{
                                        border: "solid 0.5px",
                                        // backgroundColor: "#ebe5df",
                                        height: "10vmax",
                                        width: "29vmax",
                                        borderRadius: 5,

                                    }}>
                                        <button className={"rainbow"} style={{width:"inherit",height:"inherit"}}  onClick={() =>claim_reward()}>Claim</button>
                                    </div>
                                </Col>
                            </Row>

                    </Col>
                </Row>


            </Box>

        </Modal>
    <motion.div
        className={"box"}
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.9}}
                transition={{type: "spring", stiffness: 400, damping: 25}}
                onClick={()=>setOpen(true)}
            >
                <Col span={24} style={{
                    border: "solid 0.5px",
                    backgroundColor: "rgb(185,198,190)",
                    height: "16.3vmax",
                    borderRadius: 5,
                    paddingLeft: 5
                }}>
                    <Row gutter={[24,3]}>
                        <Col span={24} style={{paddingTop: 5, textAlign: "center"}}>
                            <div  style={{backgroundColor:`${status_color}` ,width:"3vmax",height:"3vmax",borderRadius:20}}></div>
                            {/*<div style={{*/}
                            {/*    backgroundColor: `rgb(5, 240, 40)`,*/}
                            {/*    width: "3vmax",*/}
                            {/*    height: "3vmax",*/}
                            {/*    borderRadius: 20*/}
                            {/*}}></div>*/}
                        </Col>
                        <Col span={12} style={{position:"relative",top:-7}}>
                            <Row gutter={[24,8]} >
                                <Col span={24} style={{paddingRight:0}}>
                                    <p style={{fontSize: 12, color: "rgb(27,26,26)",position:"relative",top:5,display: "flex", justifyContent: "space-between"}}>
                                        <span> Pair: </span>
                                        <span >{whats_pair_need.bet_name}</span></p>
                                    <div style={{
                                        border: "solid 1px",
                                        width: "14vmax",
                                        height: 1,
                                        position: "relative",
                                        left: "0vmax",
                                        top: "0.6vmax",
                                        borderColor: "rgb(155,158,155)"
                                    }}></div>
                                </Col>
                                <Col span={24} style={{paddingRight:0}}>
                                    <p style={{
                                        fontSize: 12,
                                        color: "rgb(27,26,26)",
                                        position: "relative",
                                        top: 5,
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}>
                                        <span>Date: </span>
                                        <span>{whats_pair_need.expired_date}</span>
                                        {/*<span>{whats_pair_need.which == '1' && whats_pair_need.left_name}</span>*/}
                                        {/*<span>{whats_pair_need.which == '2' && 'middle'}</span>*/}
                                        {/*<span>{whats_pair_need.which == '3' && whats_pair_need.right_name}</span>*/}
                                    </p>
                                    <div style={{
                                        border: "solid 1px",
                                        width: "14vmax",
                                        height: 1,
                                        position: "relative",
                                        left: "0vmax",
                                        top: "0.6vmax",
                                        borderColor: "rgb(155,158,155)"
                                    }}></div>
                                </Col>
                            </Row>
                        </Col>
                        <Col span-={12}>
                            {whats_pair_need.which === 1 &&
                                <Image src={whats_pair_need.left_url} preview={false} style={{height:"12vmax",width:"12vmax",position:"relative",left:"15vmax",top:"-10vmax"}}></Image>
                            }
                            {whats_pair_need.which === 3 &&
                                <Image src={whats_pair_need.right_url} preview={false} style={{height:"12vmax",width:"12vmax",position:"relative",left:"15vmax",top:"-10vmax"}}></Image>
                            }
                            {whats_pair_need.which === 2 &&
                                <Image  src={"data:image/png;base64,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"} fallback="data:image/png;base64,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"
                                        style={{height:"12vmax",width:"12vmax",position:"relative",left:"15vmax",top:"-10vmax"}} preview={false}></Image>
                            }
                        </Col>
                    </Row>


                </Col>
            </motion.div>

        </>
    )
}

const random_url = [
    "https://images.unsplash.com/photo-1486162928267-e6274cb3106f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1545436864-cd9bdd1ddebc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1486162928267-e6274cb3106f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.pexels.com/photos/1006121/pexels-photo-1006121.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1808329/pexels-photo-1808329.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1905054/pexels-photo-1905054.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1078981/pexels-photo-1078981.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2832046/pexels-photo-2832046.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1933320/pexels-photo-1933320.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/672036/pexels-photo-672036.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1252871/pexels-photo-1252871.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/240526/pexels-photo-240526.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/132428/pexels-photo-132428.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2088206/pexels-photo-2088206.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1032652/pexels-photo-1032652.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2896668/pexels-photo-2896668.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3227984/pexels-photo-3227984.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1819634/pexels-photo-1819634.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2310641/pexels-photo-2310641.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2873992/pexels-photo-2873992.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2670898/pexels-photo-2670898.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2674062/pexels-photo-2674062.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3934512/pexels-photo-3934512.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1105189/pexels-photo-1105189.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3389536/pexels-photo-3389536.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1261731/pexels-photo-1261731.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3551227/pexels-photo-3551227.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1459534/pexels-photo-1459534.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/572780/pexels-photo-572780.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4064432/pexels-photo-4064432.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2825343/pexels-photo-2825343.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2724664/pexels-photo-2724664.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/27756675/pexels-photo-27756675.jpeg?auto=compress&cs=tinysrgb&w=800"
];