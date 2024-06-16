import React from 'react';
import "../css_folder/heardbar.css"
import {Col, ConfigProvider, Layout, Row, theme} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import Select_content from "./select_content";
import Show_content from "./show_content";
const { Header, Content, Footer } = Layout;


const Main_content:React.FC<{ address:string , index_of_address:number}> = ({ address,index_of_address}) => {
    return (
        <>
            <Content style={{padding: '15px 30px'}}>
                <Row >
                    <Show_content address={address} index_of_address={index_of_address}/>
                    <Select_content address={address} index_of_address={index_of_address}/>
                </Row>
            </Content>
        </>
    );
}

export default Main_content;