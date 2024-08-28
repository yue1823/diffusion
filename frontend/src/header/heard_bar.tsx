import React, {useState} from 'react';

import "../css_folder/heardbar.css"
import {Card, Col, ConfigProvider, Dropdown, Progress, ProgressProps,Menu, Row} from "antd";
import type { MenuProps } from 'antd';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css"


import diffusion_art from '../art/diffusion.png';

import {

    BarsOutlined, BookOutlined,

    RetweetOutlined, RobotOutlined,
    SendOutlined,

} from "@ant-design/icons";
import {Link} from "react-router-dom";

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
            // <Link to={"/Bridge"}>
               ' Bridge'
            // </Link>
        ),
        icon: <BookOutlined />,
        disabled:true
    }
];


const TOP_bar:React.FC<{ user_address:string,index_of_address:number,profile_data:Profile}>=({profile_data}) =>{

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
            <Row gutter={[36,24]}>
            <Col span={2} style={{position:"relative",top:1,left:8}}>
                <Link to={"/website"}>

                <img src={diffusion_art}
                     alt={"diffusion logo"}
                     style={{width: 80, borderRadius: 20, height: 80 ,position:"relative",top:10,right:30}} />
                </Link>

            </Col>
            <Col span={18} style={{position:"relative",top:15,left:-20}}>
                <Menu_click/>
            </Col>
            <Col span={3} style={{position:"relative",top:15}}>

                    <WalletSelector/>

            </Col>
            <Col span={1} style={{position:"relative",top:15,left:50}}>

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
                    <BarsOutlined style={{position: "relative", left: 45, fontSize: 30,top:10}}/>
                </Dropdown>
            </Col>
            </Row>






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
                            darkItemSelectedBg:"#EBE5DF",
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