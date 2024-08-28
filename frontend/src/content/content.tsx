import React from 'react';
import "../css_folder/heardbar.css"
import {Col,   Row} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import Select_content from "./select_content";
import Show_content from "./show_content";


const Main_content:React.FC<{ address:string , index_of_address:number}> = ({ address,index_of_address}) => {
    return (
        <>


                <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                    <Col span={1}></Col>
                    <Col span={14}>
                        <Show_content address={address} index_of_address={index_of_address}/>
                    </Col>
                    <Col span={4}>
                        <Select_content address={address} index_of_address={index_of_address} />
                    </Col>
                    <Col span={1}></Col>
                </Row>

        </>
    );
}

export default Main_content;