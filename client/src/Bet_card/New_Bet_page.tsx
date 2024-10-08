
import {Col, Collapse, Row, theme, Image, Card, Segmented, Statistic} from "antd";
import React, {useEffect, useState} from 'react';
import Prove_of_helper from "../art/Prove of Helper.png";
import {Content} from "antd/lib/layout/layout";
import APT_logo from "../logo/aptos-apt-logo.svg"

import { motion } from "framer-motion";
import  "../css_/rainbow_button.css";
import New_Bet_card from "../Bet_card/New_Bet_card";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
import Helper_page from "../helper/helper";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {Network} from "@aptos-labs/ts-sdk";
import Helper_upload_box from "../helper/upload_box_helper";
interface Box_number{
    boxCount: number; // 传入的数量
}


interface SavePair {
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
interface Data {
    save_Pair_result_store: {
        save_pair: SavePair[];
        // 其他字段可以根据需要定义
    };
    // 其他字段可以根据需要定义
}
interface  Helper_data{
    chips: Chips[];
    pairs:SavePair[];
}
interface  Chips {
    left:string;
    middle:string;
    right:string;
    given:string;
}
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
const text1 = `
  If you are our diffusion helper , you can help us to upload correct result.
`;
const NOW_Network = "testnet";
const resources_name = "0x6484fa91822ffab0092151219d0ca96beff41934e9ebbdaac432899594c5055::helper::Diffusion_store_tree";
const resources_address = "0x7d6d0640179e280abefeda5d687115ebcf5595337e777e86d1296fb1967fa4b";
const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY': 'bT8aS3ezHOl6T1_PyaM30lkg7odC_42l'}
};
const Deal_with_data_bet: React.FC<{ fetch_data: Helper_data ,which1:string,balance1:string,currentPage:number}> = ({fetch_data,which1,balance1,currentPage}) =>{

    if (!fetch_data) return null;
    const filteredPairs = fetch_data.pairs
        .filter(pair =>
            (which1 === "All" || pair.pair_type === which1) &&
            pair.can_bet
        );
    //Array.from({ length: fetch_data.pairs.length }).map((_, index)

    const itemsPerPage = 6;
    const totalItems = filteredPairs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const currentData = filteredPairs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    console.log(filteredPairs);
    return (
        <>
            {currentData.map((pair, index) => {
                const [firstPart, secondPart] = pair.pair_name.split(" vs ");
                const a = (parseInt(pair.left, 10)/parseInt(pair.left2, 10)).toFixed(2).toString();
                const b = (parseInt(pair.middle, 10)/parseInt(pair.middle2, 10)).toFixed(2).toString();
                const c = (parseInt(pair.right, 10)/parseInt(pair.right2, 10)).toFixed(2).toString();
                let real_balance = (parseInt(balance1,10)/100000000).toFixed(2).toString();

                return (
                    <>
                        <New_Bet_card key={index} left_url={pair.left_url} right_url={pair.right_url} pair_name_left={firstPart} pair_name_right={secondPart} balance={real_balance} left={a} right={c} middle={b} expired_time={pair.expired_time}/>

                    </>
                );
            })}
        </>
    );
}
const New_Bet_page:React.FC<{ length:number,pair:SavePair[],balance1:string,fetch_data:Helper_data,profile_data:Profile}> = ({length,pair ,balance1,fetch_data,profile_data}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { account, signAndSubmitTransaction } = useWallet();
    const [savePair, setSavePair] = useState<SavePair[]>([]);
    const [pair_can_upload,set_pair_can_upload]=useState<string[]>([]);
    const [which,set_which] =useState('All');
    const [user , set_user] = useState<Profile>();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    // const Desicion_number_of_box: React.FC<Box_number> = ({boxCount}) =>{
    //     const length = savePair.length;
    //     return(
    //         <>
    //             {Array.from({ length: boxCount }).map((_, index) => {
    //                 const [firstPart, secondPart] = pair[index].pair_name.split(" vs ");
    //                 const a = (parseInt(pair[index].left, 10)/parseInt(pair[index].left2, 10)).toFixed(2).toString();
    //                 const b = (parseInt(pair[index].middle, 10)/parseInt(pair[index].middle2, 10)).toFixed(2).toString();
    //                 const c = (parseInt(pair[index].right, 10)/parseInt(pair[index].right2, 10)).toFixed(2).toString();
    //                 let real_balance = (parseInt(balance1,10)/100000000).toFixed(2).toString();
    //                 // console.log(`a : ${a}`);
    //                 // console.log(`b : ${b}`);
    //                 // console.log(`c : ${c}`);
    //                 // console.log(`left url : ${pair[index].left_url}`);
    //                 // console.log(`right url : ${pair[index].right_url}`);
    //                 return(
    //                     <New_Bet_card key={index} left_url={pair[index].left_url} right_url={pair[index].right_url} pair_name_left={firstPart} pair_name_right={secondPart} balance={real_balance} left={a} right={c} middle={b}/>
    //                 );
    //             })}
    //         </>
    //     )
    // }

    const filteredPairs = fetch_data.pairs
        .filter(pair =>
            (which === "All" || pair.pair_type === which) &&
            pair.can_bet
        );
    //Array.from({ length: fetch_data.pairs.length }).map((_, index)

    const itemsPerPage = 6;
    const totalItems = filteredPairs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
        const set_data = () =>{
            if (!fetch_data) return null;
            set_user(profile_data);
            // console.log(`user data : ${user}`)
            // console.log(user?.save_icon.icon)
            // console.log(user?.save_icon.name)
            // console.log(user?.save_level)
        }

    useEffect(() => {
        //pythConnection.start()
        set_data()
        //fatch_diffusion_resource_from_aptos()
    },[account,profile_data]);
    return (
        <>
            <Content style={{padding: '15px 30px'}}>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >

                    <Col span={24}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 600,

                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                                <Col span={4}>
                                    <Card title={`${user?.save_icon.name}`} style={{height: 500, backgroundColor: "#f4f4f1"}}>
                                        <Row>
                                            <Col span={24}>
                                                <img src={user?.save_icon.icon} alt={"logo1"}
                                                     style={{width: 150, height: 150}}></img>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col span={24}>

                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col span={24}>

                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={20}>
                                    <Card title={<span>
                                    <Segmented<string>
                                        options={["All",'game', 'sport', 'unexpected']}
                                        onChange={(value) => {
                                            set_which(value);
                                            console.log(value); // string
                                        }}
                                    />
                                </span>} style={{height: 500, backgroundColor: "#f4f4f1"}}>
                                        <Row gutter={[24, 16]}>

                                            <Deal_with_data_bet fetch_data={fetch_data} balance1={balance1} which1={which} currentPage={currentPage}/>

                                            {/*<Desicion_number_of_box boxCount={length}/>*/}
                                        </Row>

                                    </Card>
                                </Col>
                            </Row>
                            <br/>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                                <Col span={8} offset={17}>
                                    <div>
                                        <button
                                            className={"rainbow"}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}>
                                            Previous
                                        </button>
                                        <span>{currentPage} / {totalPages}</span>
                                        <button
                                            className={"rainbow"}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}>
                                            Next
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

            </Content>
        </>
    );
};
export default New_Bet_page;