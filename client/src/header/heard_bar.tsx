import React, {useState} from 'react';
import "../css_folder/heardbar.css"
import {Col, ConfigProvider, Layout, Menu, MenuProps, Row, theme} from "antd";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import diffusion_art from '../art/diffusion.png';
import {
    AppstoreOutlined,
    BarsOutlined, BookOutlined,
    MailOutlined,
    RetweetOutlined, RobotOutlined,
    SendOutlined,
    SettingOutlined
} from "@ant-design/icons";
import {Link, Route, Routes} from "react-router-dom";
import Main_content from "../content/content";
import Swap_page from "../swap_page";
const { Header, Content, Footer } = Layout;
type MenuItem = Required<MenuProps>['items'][number];
const items: MenuItem[] = [
    {
        label: (<Link to={"/Transfer"}>
            Transfer
        </Link>),
        key: 'Transfer',
        icon: <SendOutlined />,
    },
    {
        label: (
            <Link to={"/Swap"}>
                Swap
            </Link>
            ),
        key: 'Swap',
        icon: <RetweetOutlined />,

    },
    {
        label: (<Link to={"/nft"}>
            NFT
        </Link>),
        key: 'Nft',
        icon: <RobotOutlined />
    },
    {
        key: 'Bet',
        label: (
            <Link to={"/Bet"}>
                Bet Card
            </Link>
        ),
        icon: <BookOutlined />
    }
];
const TOP_bar:React.FC<{ user_address:string,index_of_address:number}>=({user_address,index_of_address}) =>{

    return (
        <>
                {/*<Header style={{ display: 'flex', alignItems:'center',backgroundColor: "#EBE5DF"}}>*/}
                {/*    <Row>*/}
                {/*        <Col span={4}>*/}
                {/*            <img src={diffusion_art}*/}
                {/*                 alt={"diffusion logo"}*/}
                {/*                 style={{width: 60, borderRadius: 20, height: 60}}/>*/}
                {/*        </Col>*/}
                {/*        <Col span={12}>*/}
                {/*            aaa*/}
                {/*        </Col>*/}
                {/*        <Col span={4}>*/}
                {/*            <WalletSelector/>*/}
                {/*        </Col>*/}
                {/*        <Col span={4}>*/}
                {/*            <BarsOutlined style={{position:"relative",fontSize:40,left:65}}/>*/}
                {/*        </Col>*/}
                {/*    </Row>*/}

                {/*    /!*<div className={"Diffusion-logo_where"}>*!/*/}
                {/*    /!*    <img src={diffusion_art}*!/*/}
                {/*    /!*         alt={"diffusion logo"}*!/*/}
                {/*    /!*             className={"diffusion_logo_circular-image "}/>*!/*/}

                {/*    /!*    </div>*!/*/}
                {/*    /!*    <div className={"Diffusion-WalletSelect_layout"}>*!/*/}
                {/*    /!*        <WalletSelector />*!/*/}
                {/*    /!*    </div>*!/*/}
                {/*    /!*    <BarsOutlined style={{position:"relative",fontSize:40,left:65}}/>*!/*/}
                {/*</Header>*/}
            <Header style={{display: 'flex', alignItems: 'center',backgroundColor: "#EBE5DF",height:90}}>
                <img src={diffusion_art}
                     alt={"diffusion logo"}
                     style={{width: 60, borderRadius: 20, height: 60}}/>
                <Menu_click/>
                <WalletSelector />
                <BarsOutlined style={{position:"relative",left:25,fontSize:40}}/>
            </Header>





        </>
    );
}

const Menu_click = () => {
    const [current, setCurrent] = useState('mail');

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };


    return (<ConfigProvider
        theme={{
            token:{
                colorTextLightSolid:"#101010",
                colorBgElevated:"#EBE5DF",
                padding:35,

            },
            components: {
                Menu: {
                    /* 这里是你的组件 token */
                    fontSize:25,
                    darkItemBg:"#EBE5DF",
                    darkPopupBg:"#EBE5DF",
                    darkItemSelectedBg:"#001529",
                    darkSubMenuItemBg:"#EBE5DF",
                    itemHoverBg:"#EBE5DF",
                    itemHoverColor:"#EBE5DF",
                    subMenuItemBg:"#EBE5DF",
                    itemColor:"#EBE5DF",
                    popupBg:"#EBE5DF",
                    horizontalItemHoverBg:"#EBE5DF",


                },
            },
        }}
    >
        <Menu onClick={onClick} selectedKeys={[current]} className={"Menu-position"} mode="horizontal" items={items} theme={"dark"} style={{backgroundColor:"#EBE5DF",height:90,width:2000}}/>
    </ConfigProvider>)
}

export default TOP_bar;