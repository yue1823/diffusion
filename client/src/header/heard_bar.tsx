import React, {useState} from 'react';
import "../css_folder/heardbar.css"
import {Card, Col, ConfigProvider, Dropdown, Layout, Progress, ProgressProps,Menu, Row, theme} from "antd";
import type { MenuProps } from 'antd';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import APT_LOGO from '../logo/aptos-apt-logo.svg';
import My_logo from "../art/yue_logo.jpeg";
import MyMenu from "./menu_of_header";
import BurgerMenu from 'react-burger-menu';
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import diffusion_art from '../art/diffusion.png';
import classNames from 'classnames';
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
interface Bet_card_data{
    a_win:string;
    b_win:string;
    c_win:string;
    expired_time:string;
    pair:SavePair;
    time:string;
    which:string;
}
interface Badges{
    name : string;
    url : string;
}
interface Profile{
    save_icon:{
        icon:string;
        name:string;
    };
    save_bet_card:Bet_card_data[];
    save_badges:Badges[];
    save_level:{
        diffusion_point:string;
        level:string;
        lose:string;
        win:string;
    }

}
const { Header, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
const items: MenuItem[] = [
    {
        label: (<Link to={"/"}>
            Transfer
        </Link>),
        key: '/',
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
    },
    {
        key: 'Helper',
        label: (
            <Link to={"/Helper"}>
               Helper
            </Link>
        ),
        icon: <BookOutlined />
    },
    {
        key: 'Bridge',
        label: (
            <Link to={"/Bridge"}>
                Bridge
            </Link>
        ),
        icon: <BookOutlined />,
        disabled:true
    }
];

const drop_item: MenuProps['items']= [
    {
        key:'1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">

                    <Card
                        style={{width: 300}}
                        cover={
                            <img
                                alt={"apt"}
                                src={APT_LOGO}
                            />
                        }
                    ></Card>


            </a>

        )
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                1st menu item
            </a>
        ),
    },
]
const TOP_bar:React.FC<{ user_address:string,index_of_address:number,profile_data:Profile}>=({user_address,index_of_address,profile_data}) =>{

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

            <Col span={1}>
                <Link to={"/website"}>

                <img src={diffusion_art}
                     alt={"diffusion logo"}
                     style={{width: 80, borderRadius: 20, height: 80 ,position:"relative",top:10,right:30}} />
                </Link>
                <></>
            </Col>
            <Col span={18}>
                <Menu_click/>
            </Col>
            <Col span={4}>
                <WalletSelector/>
            </Col>
            <Col span={1}>

                <Dropdown menu={{
                    items:  [
                        {
                            key:'1',
                            label: (

                                    <Link to={"/my_page"}>
                                            <Card
                                                style={{width: 300 ,backgroundColor:"#ded9cd"}}
                                                cover={
                                                    <Row  gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                                                        <Col span={4}></Col>
                                                        <Col span={24}>
                                                            <img
                                                                alt={`${profile_data.save_icon.icon}`}
                                                                src={profile_data.save_icon.icon}
                                                                style={{height: 200, width: 200,left:50,position:"relative",top:10}}
                                                            />
                                                        </Col>
                                                        <Col span={4}></Col>
                                                    </Row>

                                                }

                                            >
                                            <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>

                                                        <Col span={24}>
                                                            <Card  style={{backgroundColor:"#646262",color:"white"}}>
                                                                <Row gutter={[12,12]}>
                                                                    <Col span={24}>
                                                                        <h1 style={{color:"white"}}>{profile_data.save_icon.name}</h1>
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        Level:
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        <Progress percent={50} strokeColor={twoColors} style={{color:"white"}}/>
                                                                    </Col>
                                                                </Row>

                                                            </Card>
                                                        </Col>
                                                    </Row>

                                                </Card>
                                    </Link>


                            )
                        },]}}>
                    <BarsOutlined style={{position: "relative", left: 5, fontSize: 60,top:10}}/>
                </Dropdown>
            </Col>







        </>
    );
}

const Menu_click = () => {
    const [current, setCurrent] = useState('mail');

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };


    return (
        <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                <ConfigProvider
                theme={{
                    token:{
                        colorTextLightSolid:"#101010",
                        colorBgElevated:"#EBE5DF",
                        padding:25,

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

                <Menu onClick={onClick} selectedKeys={[current]} className={"Menu-position"} mode="horizontal" items={items} theme={"dark"} style={{position:"relative",backgroundColor:"#EBE5DF",height:100,width:900}}/>
            </ConfigProvider>
        </Row>
    )
}

const twoColors: ProgressProps['strokeColor'] = {
    '0%': '#108ee9',
    '100%': '#87d068',
};


export default TOP_bar;