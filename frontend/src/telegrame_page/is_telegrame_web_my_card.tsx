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
const BarChart: React.FC = () => {
    const data = {
        labels: ['win', 'lose'],
        datasets: [
            {
                label: '',
                data: [165,59],
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
const Is_telegrame_web_my_card: React.FC <{profile_date:Profile}>= ({profile_date}) => {
    const [can_claim_pair , set_can_claim_pair]=useState<any>('');
    const [finish_pair,set_finish_pair]=useState<any>('');
    const solve_data = () =>{

        let pair = [];
        for(let i =0;i<profile_date.data.save_2.length;i++){
            if( profile_date.data.save_2[i].pair.can_bet == true){
                pair.push(profile_date.data.save_2[i])
            }
        }
        console.log('finsih pair', pair);
        set_finish_pair(pair);
    }
    useEffect(() => {
        console.log('profile_date', profile_date);
        console.log('profile_date.save_2', profile_date.data.save_2);
        //console.log(profile_date.save_2)
        solve_data()
    }, [profile_date]);
    return (<>
        <Row style={{paddingLeft:0,paddingRight:0,position:"relative",top:-10}}>
            {/*<Col span={24}>*/}
            {/*    <BarChart/>*/}
            {/*</Col>*/}
            <Col span={10}>
                <Row gutter={[24,8]} >
                    <MyCard_bet/>
                    <Col span={24}  style={{border:"solid 0.5px", backgroundColor:"#bbdcbb",height:"16.3vmax",borderRadius:5}}>

                    </Col>
                    <Col span={24}  style={{border:"solid 0.5px", backgroundColor:"#bbdcbb",height:"16.3vmax",borderRadius:5}}>

                    </Col>
                </Row>
            </Col>
            <Col span={12} offset={2}>
                <Row gutter={[24,8]}>
                    <Col span={24} style={{border:"solid 0.5px", backgroundColor:"#bbdcbb",height:"51.5vmax",borderRadius:5,padding:10}}>
                        <Row gutter={[24,6]}>

                            <Col span={24} style={{height: "20vmax"}}>
                                <BarChart/>
                                <div style={{
                                    border: "solid 1px",
                                    borderRadius: 5,
                                    borderColor: "rgb(155,158,155)"
                                }}></div>
                            </Col>
                            <Col span={24}>
                                <div style={{height:"19.5vmax",width:"auto"}}></div>
                                <div style={{border:"solid 1px",borderRadius:5,borderColor:"rgb(155,158,155)"}}></div>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Col span={10}>
                                        <button className={"rainbow"} style={{height:"7vmax",width:"12vmax"}}><ArrowLeftOutlined /></button>
                                    </Col>
                                    <Col span={4}>
                                        <p>10/10</p>
                                    </Col>
                                    <Col span={10}>
                                        <button className={"rainbow"} style={{height:"7vmax",width:"12vmax",textAlign:"center"}}><ArrowRightOutlined style={{position:"relative"}}/></button>
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

const MyCard_bet: React.FC <{}>=({})=>{

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