import React from 'react';
import "../css_folder/heardbar.css"
import {Col, ConfigProvider, Layout, Row, theme} from "antd";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import diffusion_art from '../art/diffusion.png';
import {BarsOutlined} from "@ant-design/icons";
const { Header, Content, Footer } = Layout;


function TOP_bar() {

    return (
        <>
                <Header style={{ display: 'flex', alignItems:'center',backgroundColor: "#EBE5DF"}}>

                        <div className={"Diffusion-logo_where"}>
                            <img src={diffusion_art}
                                 alt={"diffusion logo"}
                                 className={"diffusion_logo_circular-image "}/>
                        </div>
                        <div className={"Diffusion-WalletSelect_layout"}>
                            <WalletSelector />
                        </div>
                        <BarsOutlined style={{position:"relative",fontSize:40,left:65}}/>
                </Header>

        </>
    );
}

export default TOP_bar;