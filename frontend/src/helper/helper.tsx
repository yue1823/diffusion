
import {Col, Collapse, Row, theme, Image, Card, Segmented, Statistic, Steps, message} from "antd";
import React, {useEffect, useRef, useState} from 'react';
import Prove_of_helper from "../art/Prove of Helper.png";
import {Content} from "antd/lib/layout/layout";
import APT_logo from "../logo/aptos-apt-logo.svg"
import Helper_upload_box from "./upload_box_helper";
import { motion } from "framer-motion";
import  "../css_/rainbow_button.css";
// import New_Bet_card from "../Bet_card/New_Bet_card";
import { SmileOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";
import {MoveValue} from "@aptos-labs/ts-sdk";
import Apt_logo from "../art/Aptos_mark_BLK.svg";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
import EnvelopeComponent from "./letter.";
import ButtonWithProgress from "./submit_button";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk"; // Assuming you have a CSS file for the styles
const diffusion_address = "0x7776f4ac2f3a13f751b966220b0e68e0b5688682c31e4f93cbf12ce1cea4a7b9";
const NOW_Network = "testnet";
const aptosConfig = new AptosConfig({ network: Network.TESTNET});
const aptos = new Aptos(aptosConfig);
const text1 = `
  If you are our diffusion helper , you can help us to upload correct result.
`;
// interface Cylinder_Pair{
//     already_send:string;
//     coin:string;
//     coin_address:string;
//     pair_number:string;
//     save_number:string;
//     save_total:string;
//     send_address_vector:string[];
//     send_amount_vector:string[];
// }
interface  Helper_data{
    chips: Chips[];
    pairs:SavePair[];
}
// interface Helper{
//
//     account:string;
//     helper_contribute:string[];
//     helper_point:string;
//     need_admin:boolean;
//     pay_margin:boolean;
//     upload_times:string;
//     wrong_time:string;
// }
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
interface  Chips {
    left:string;
    middle:string;
    right:string;
    given:string;
}
// interface Badges{
//     name : string;
//     url : string;
// }
// interface Badges_list{
//     save_badges:Badges;
//     save_can_mint:boolean;
//     save_allow_list:string[];
//     save_list:string[];
// }
// interface Data {
//     fee:{
//         allocation_share_1:string;
//         allocation_share_2:string;
//         bank_share_1:string;
//         bank_share_2:string;
//         fees_1:string;
//         fees_2:string;
//         margin:string;
//         nft_chance_1:string;
//         nft_chance_2:string;
//         nft_id:string;
//     };
//     save_Cylinder_Pairs:Cylinder_Pair[];
//     save_Helper_list:{
//         list:Helper[];
//         period:string[];
//     };
//     save_Pair_result_store: {
//         save_admin_set_result:boolean[];
//         save_can_claim:boolean[];
//         save_chips:Chips[];
//         save_pair: SavePair[];
//         save_lost_pair:{
//             big_vec: {
//                 vec: any[];  // 你可以根据具体数据类型替换 `any`
//             };
//             bucket_size: {
//                 vec: any[];  // 你可以根据具体数据类型替换 `any`
//             };
//             inline_capacity: {
//                 vec: any[];  // 你可以根据具体数据类型替换 `any`
//             };
//             inline_vec: any[];  // 你可以根据具体数据类型替换 `any`
//         };
//         save_result:string[];
//     };
//     save_badges_list:Badges_list[];
//     save_helper_chance:{
//         chance_for_wrong_time:string;
//         helper_number:string;
//         least_helper_result:string;
//         maimun_helper_num:string;
//     }
//     // 其他字段可以根据需要定义
// }
const Deal_with_data: React.FC<{ fetch_data: Helper_data ,which1:string}> = ({fetch_data,which1}) =>{
    if (!fetch_data) return null;
    // const filteredPairs = which1 === "All"
    //     ? fetch_data.pairs // 如果 which1 为 "all"，则不进行过滤
    //     : fetch_data.pairs.filter(pair => pair.pair_type === which1);

    const filteredPairs = fetch_data.pairs
        .filter(pair =>
            (which1 === "All" || pair.pair_type === which1) &&
            !pair.can_bet
        );
    //Array.from({ length: fetch_data.pairs.length }).map((_, index)
    console.log(filteredPairs);
    return (
        <>
            {filteredPairs.map((pair, index) => {
                const [firstPart, secondPart] = pair.pair_name.split(" vs ");
                const pool = (
                    (parseInt(fetch_data.chips[index]?.left || '0') +
                        parseInt(fetch_data.chips[index]?.middle || '0') +
                        parseInt(fetch_data.chips[index]?.right || '0')) / 100000000
                ).toString();

                return (
                    <Helper_upload_box
                        key={index} // 确保为每个组件提供唯一的 key
                        left_url={pair.left_url}
                        right_url={pair.right_url}
                        pair_name_left={firstPart}
                        pair_name_right={secondPart}
                        pool={pool}
                        expired_time={pair.expired_time}
                    />
                );
            })}
        </>
    );
}
const Helper_page:React.FC<{helper_data:MoveValue[] ,fetch_data:Helper_data}> = ({helper_data,fetch_data }) => {
    const { account, signAndSubmitTransaction } =useWallet() ;
    // const [pair_can_upload,set_pair_can_upload]=useState<string[]>([]);
    const [which,set_which] =useState('All');
    const [pay,setpay]=useState(0);
    const animatedButtonRef = useRef<{ playAnimation: () => void }>(null);
    const [helper]=useState({
        helper_point:'',
        wrong_time:''
    })
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const submit_transaction = async () => {
        const transaction: InputTransactionData = {
            data: {
                function: `${diffusion_address}::helper::apply_to_be_helper`,
                functionArguments: []
            }
        }
        console.log(`sumittransaction`)
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);

            setpay(1)
            animatedButtonRef.current?.playAnimation()

            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=${NOW_Network}`;
            // message.success(
            //
            // )


            toast.success(<span>
                        hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                    </span>, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            setpay(2);
        } catch (error: any) {
            console.log(error);
            message.error(`please try again`);
        } finally {


        }
    }
    useEffect(() => {

    }, [account?.address]);
    useEffect(() => {
        if (pay === 2) {
            // 只有当 pay 的值变为 2 时，才会执行这里的逻辑
            console.log('Pay is now 2, do something...');
            // 这里写重新渲染的逻辑或其他需要触发的操作
        }
    }, [pay]);
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
                                    <Card title={"Helper"} style={{height: 500, backgroundColor: "#f4f4f1"}}>
                                        <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                                            <Col span={24}>
                                                <Card>
                                                    <img src={APT_logo} alt={"logo1"}></img>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                                            <Col span={24}>
                                                <motion.div
                                                    animate={{x: [null, 100, 0], y: [null, 100, 0]}}
                                                    whileHover={{
                                                        scale: [null, 1.5, 1.4],
                                                        zIndex: 1000,
                                                        position: 'relative'
                                                    }}
                                                    transition={{duration: 0.3}}
                                                >
                                                    <Card style={{height:90}}>
                                                        <Statistic
                                                            title="Helper Point"
                                                            value={helper.helper_point}
                                                            precision={2}
                                                            valueStyle={{color: '#3f8600'}}
                                                            suffix=" pt"
                                                            style={{position: "relative", top: -8}}
                                                        />
                                                    </Card>
                                                </motion.div>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}} >
                                            <Col span={24}>
                                                <motion.div
                                                    animate={{x: [null, 100, 0], y: [null, 100, 0]}}
                                                    whileHover={{
                                                        scale: [null, 1.5, 1.4],
                                                        zIndex: 1000,
                                                        position: 'relative'
                                                    }}
                                                    transition={{duration: 0.3}}
                                                >
                                                    <Card style={{height:90}}>
                                                        <Statistic
                                                            title="Wrong Times"
                                                            value={helper.wrong_time}
                                                            precision={2}
                                                            valueStyle={{color: '#cf1322'}}
                                                            suffix=" t"
                                                            style={{position: "relative", top: -8}}
                                                        />
                                                    </Card>
                                                </motion.div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                {helper_data[0]  ? <>
                                    {helper_data[1] ? <>
                                        <Col span={20}>
                                            <Card title={<span>
                                        <Segmented<string>
                                            options={['All','game', 'sport', 'unexpected']}
                                            onChange={(value) => {
                                                set_which(value);
                                                //console.log(which);// string
                                            }}
                                        />
                                     </span>} style={{height: 500, backgroundColor: "#f4f4f1"}}>
                                                <Row gutter={[24, 16]}>
                                                    {/*<Helper_upload_box left_url={"data:image/png;base64,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"} right_url={"data:image/png;base64,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"} pair_name_left={"aptos"} pair_name_right={"sol"} pool={"100"}/>*/}
                                                    {/*/!*<Helper_upload_box left_url={""} right_url={""} pair_name_left={"Me"} pair_name_right={"you"}/>*!/*/}
                                                    <Deal_with_data fetch_data={fetch_data} which1={which}/>
                                                </Row>

                                            </Card>
                                        </Col>
                                    </> : <>
                                        <Col span={20}>
                                            <Card  style={{height: 500, backgroundColor: "#f4f4f1"}}>
                                                <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>

                                                        <Col span={18} offset={2}>
                                                            <Steps  current={pay}
                                                                items={[
                                                                    {
                                                                        title: 'Helper',

                                                                        icon: <UserOutlined />,
                                                                    },
                                                                    {
                                                                        title: 'Pay margin',

                                                                        icon: <SolutionOutlined />,
                                                                    },
                                                                    {
                                                                        title: 'Done',

                                                                        icon: <SmileOutlined />,
                                                                    },
                                                                ]}
                                                            style={{position:"relative",left:10}}/>
                                                        </Col>

                                                </Row >
                                                    <Row style={{position:"relative",top:60}} gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                                                        <Col span={16} offset={4}>
                                                            <button onClick={() => submit_transaction()}>
                                                                <ButtonWithProgress ref={animatedButtonRef}/>
                                                            </button>
                                                        </Col>
                                                    </Row>

                                                <Row style={{position:"relative",top:120}}>
                                                        <Col span={24} >
                                                            <Collapse
                                                                size="large"
                                                                items={[{ key: '1', label: 'Introduction for Helper', children: <p>Although you are helper , but you need to pay margin first
                                                                    <Image src={Apt_logo} style={{height:150,width:500}}></Image>

                                                                    </p>}]}
                                                            />
                                                        </Col>
                                                    </Row>
                                            </Card>
                                        </Col>
                                    </>}
                                   </> : <>

                                    <Col span={20}>
                                        <Card style={{height: 500 , backgroundColor:"#222222"}}>
                                            <Row gutter={[24, 16]}>
                                                <Col span={24} style={{position:"relative",top:380}}>
                                                    <EnvelopeComponent/>
                                                </Col>

                                            </Row>
                                        </Card>
                                    </Col>
                                </>}
                            </Row>
                            <br/>


                            <Collpse_this_page/>
                        </div>
                    </Col>
                </Row>
            </Content>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
}

const Collpse_this_page = () =>{

    return(
        <>
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 },{ xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col  span={24}>
                    <Collapse
                        size="small"
                        items={[{ key: '1', label: 'Introduction for Helper', children: <p>{text1}
                                <Collapse  items={[{
                                    key: '1', label: 'How it work', children: <p>
                                        <Image  src={Prove_of_helper}/>
                                    </p> }]}
                                />
                            </p>}]}
                    />
                </Col>
            </Row>
        </>
    );
}

export default Helper_page;