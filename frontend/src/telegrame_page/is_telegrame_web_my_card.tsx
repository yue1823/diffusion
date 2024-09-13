import {Col, Row ,Image} from 'antd';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
interface Profile{
    data: {
        save_1: any
        save_2: any[],
        save_3: any,
        save_4: any,
        save_5: any
    }
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
    const [can_claim_pair , set_can_claim_pair]=useState<any[]>([]);
    const [user_have_pair, set_user_have_pair]=useState<any[]>([]);
    const [finish_pair,set_finish_pair]=useState<any[]>([]);
    const [wrong_pair,set_wrong_pair]=useState<any[]>([]);
    const [big_cols, setBigCols] = useState<JSX.Element[]>([]);
    const solve_data = () =>{
        let pair = [];
        for(let i =0;i<profile_date.data.save_2.length;i++){
            if( profile_date.data.save_2[i].pair.can_bet == true){
                pair.push(profile_date.data.save_2[i])
            }
        }
        //console.log('finsih pair', pair);
        set_finish_pair(pair);
        find_pair_of_user();
    }
    const find_pair_of_user =()=>{
        let have_pair =[];
        let wrong_pair =[];
        let right_pair = [];
        for(let j = 0 ; j<profile_date.data.save_2.length;j++){
            for (let i=0; i < diffusion_data.save_Pair_result_store.save_pair.length;i++){

                if(profile_date.data.save_2[j].pair.pair_name == diffusion_data.save_Pair_result_store.save_pair[i].pair_name){
                    //console.log(`profile_date`,profile_date.data.save_2[j].pair.pair_name)
                   // console.log(`diffusion_data.`,diffusion_data.save_Pair_result_store.save_pair[i].pair_name)
                    if(profile_date.data.save_2[j].pair.expired_time == diffusion_data.save_Pair_result_store.save_pair[i].expired_time){

                       // console.log( ' diffusion_data.save_Pair_result_store.save_result[3+i*2]',diffusion_data.save_Pair_result_store.save_result[3+i*2])
                        if(diffusion_data.save_Pair_result_store.save_result[3+i*2] != 9){
                            if(profile_date.data.save_2[j].which !=  diffusion_data.save_Pair_result_store.save_result[4+i*2] ){
                                // console.log('4+i*2',3+i*2)
                                // console.log('4+i*2 data',diffusion_data.save_Pair_result_store.save_result[3+i*2])
                                wrong_pair.push(profile_date.data.save_2[j])
                                //console.log( 'wrong_pair',wrong_pair)
                            }
                            if(profile_date.data.save_2[j].which =  diffusion_data.save_Pair_result_store.save_result[4+i*2] ){
                                right_pair.push(profile_date.data.save_2[j])
                            }
                        }else{
                            have_pair.push(diffusion_data.save_Pair_result_store.save_pair[i])
                        }

                    }
                }
            }
        }
        // console.log('right pair',right_pair);
        // console.log('wrong pair',wrong_pair);
        // console.log('have pair',have_pair);
        set_wrong_pair(wrong_pair)
        set_can_claim_pair(right_pair)
        set_user_have_pair(have_pair)
        console.log('right pair',can_claim_pair);
        console.log('wrong pair',wrong_pair);
        console.log('have pair',user_have_pair);
        if(have_pair.length !=0){
            console.log("big_cols.length",big_cols.length)
            set_pair_for_user()
            console.log("big_cols",big_cols)
        }
    }
    const set_pair_for_user = () =>{
        const cols: JSX.Element[] = [];
        can_claim_pair.forEach((_) => {
          cols.push(
                <MyCard_bet status_color={"rgb(5, 240, 40)"}/>
            );
        });
        wrong_pair.forEach((_) => {
            cols.push(
                <MyCard_bet  status_color={"rgb(240,5,25)"}/>
            );
        });
        user_have_pair.forEach((_) => {
            cols.push(
                <MyCard_bet  status_color={"rgb(224,240,5)"}/>
            );
        });
        setBigCols(cols)
    }

    useEffect(() => {
        console.log('diffusion_date',diffusion_data);
        console.log('profile_date', profile_date);
        //console.log('profile_date.save_2', profile_date.data.save_2);
        //console.log(profile_date.save_2)
        solve_data();

    }, [profile_date,diffusion_data]);
    // useEffect(() => {
    //     solve_data();
    //     find_pair_of_user();
    // }, []);
    // useEffect(() => {
    //
    // }, [can_claim_pair]);
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
                    {big_cols}
                </Row>
            </Col>
            <Col span={12} offset={2}>
                <Row gutter={[24,8]}>
                    <Col span={24} style={{border:"solid 0.5px", backgroundColor:"#bbdcbb",height:"51.5vmax",borderRadius:5,padding:10}}>
                        <Row gutter={[24,6]}>

                            <Col span={24} style={{height: "20vmax"}}>
                                <BarChart data1={{win:profile_date.data.save_5.win as number,lose:profile_date.data.save_5.lose as number}}/>
                                <div style={{
                                    border: "solid 1px",
                                    borderRadius: 5,
                                    borderColor: "rgb(155,158,155)"
                                }}></div>
                            </Col>
                            <Col span={24}>
                                <div style={{height:"19.5vmax",width:"auto"}}>
                                    <Row gutter={[24,5]} style={{position:"relative",top:-25}}>
                                        <Col span={24} >
                                            <p style={{textAlign:"center",position:"relative",top:-5}}>Status</p>
                                        </Col>
                                        <Col span={24}>
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
                                        <Col span={24}>
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
                                        <Col span={24}>
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
                                        <button className={"rainbow"} style={{height:"7vmax",width:"11vmax"}}>
                                            <ArrowLeftOutlined style={{position:"relative",right:"1.3vmax"}}/>
                                        </button>
                                    </Col>
                                    <Col span={4}>
                                        <p>10/10</p>
                                    </Col>
                                    <Col span={10}>
                                        <button className={"rainbow"} style={{height:"7vmax",width:"11vmax",textAlign:"center",position:"relative",left:"2vmax"}}>
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

const MyCard_bet: React.FC <{status_color:string}>=({status_color})=>{

    return(
        <>
            <Col span={24} style={{
                border: "solid 0.5px",
                backgroundColor: "rgb(185,198,190)",
                height: "16.3vmax",
                borderRadius: 5,
                paddingLeft: 5
            }}>
                <Row gutter={[24,6]}>
                    <Col span={24} style={{paddingTop: 5, textAlign: "center"}}>
                        <div  style={{backgroundColor:`${status_color}` ,width:"3vmax",height:"3vmax",borderRadius:20}}></div>
                        {/*<div style={{*/}
                        {/*    backgroundColor: `rgb(5, 240, 40)`,*/}
                        {/*    width: "3vmax",*/}
                        {/*    height: "3vmax",*/}
                        {/*    borderRadius: 20*/}
                        {/*}}></div>*/}
                    </Col>
                    <Col span={12}>

                    </Col>
                    <Col span-={12}>
                    <Image src={""} preview={false}></Image>
                    </Col>
                </Row>

                <div style={{
                    border: "solid 1px",
                    width: "10vmax",
                    height: 1,
                    position: "relative",
                    left: "0vmax",
                    top: "0.5vmax",
                    borderColor: "rgb(107,141,168)"
                }}></div>
            </Col>
        </>
    )
}