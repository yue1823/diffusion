import React from 'react';
import "../css_folder/heardbar.css"
import {Col, ConfigProvider, Layout, Row, theme} from "antd";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import diffusion_art from '../art/diffusion.png';
import {BarsOutlined, GithubOutlined, TwitterOutlined} from "@ant-design/icons";
import Show_content from "../content/show_content";
import Select_content from "../content/select_content";
const { Header, Content, Footer } = Layout;


const Footer_bar:React.FC<{ }> = ({ }) => {
    return (
        <>
            <></>
                <Footer style={{textAlign:'center' ,backgroundColor: "#EBE5DF"}}>
                    Create by Yue  <br/>
                    <a href="https://github.com/yue1823" target="_blank" rel="noopener noreferrer">
                        <GithubOutlined style={{fontSize: 30}}/>
                    </a>
                </Footer>

        </>
    );
}

export default Footer_bar;