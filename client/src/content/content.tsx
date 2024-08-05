import React, {useContext} from 'react';
import "../css_folder/heardbar.css"
import {Col, ConfigProvider, Layout, Row, theme} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import Select_content from "./select_content";
import Show_content from "./show_content";
import { DataContext } from '../DataContext';
import Carousel_comp from "../Carousel/Carousel_comp";
const { Header, Content, Footer } = Layout;


const Main_content:React.FC<{ address:string , index_of_address:number}> = ({ address,index_of_address}) => {
    return (
        <>
            <Content style={{padding: '15px 30px'}}>
                <Row gutter={26}>
                    <Col span={1}></Col>
                    <Col span={14}>
                        <Show_content address={address} index_of_address={index_of_address}/>
                    </Col>
                    <Col span={4}>
                        <Select_content address={address} index_of_address={index_of_address} />
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </Content>
        </>
    );
}

export default Main_content;