import {Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
const BarChart: React.FC = () => {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Sales',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Monthly Sales',
            },
        },
    };

    return <Bar data={data} options={options} />;
};
const Is_telegrame_web_my_card: React.FC <{}>= ({}) => {

    useEffect(() => {

    }, []);
    return (<>
        <Row style={{paddingLeft:0,paddingRight:0,position:"relative",top:-10}}>
            <Col span={10}>
                <Row gutter={[24,8]} >
                    <Col span={24} style={{border:"solid 0.5px", backgroundColor:"#bbdcbb",height:"16.3vmax",borderRadius:5}}>

                    </Col>
                    <Col span={24}  style={{border:"solid 0.5px", backgroundColor:"#bbdcbb",height:"16.3vmax",borderRadius:5}}>

                    </Col>
                    <Col span={24}  style={{border:"solid 0.5px", backgroundColor:"#bbdcbb",height:"16.3vmax",borderRadius:5}}>

                    </Col>
                </Row>
            </Col>
            <Col span={12} offset={2}>
                <Row gutter={[24,8]}>
                    <Col span={24} style={{border:"solid 0.5px", backgroundColor:"#bbdcbb",height:"51.5vmax",borderRadius:5}}>
                        <Row gutter={[24,6]}>
                            <Col span={24}>

                            </Col>
                            <Col span={24}>
                                <div style={{border:"solid 1px",borderRadius:5,borderColor:"rgb(155,158,155)"}}></div>
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </Col>
        </Row>




    </>)
}

export default Is_telegrame_web_my_card;