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