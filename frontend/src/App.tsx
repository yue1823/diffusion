import React, {useEffect, useState} from 'react';
import {Avatar,  Col, Drawer, Layout, Row, Steps, Image, message,  Input, Popover} from "antd";
import TOP_bar from './header/heard_bar';
import Main_content from "./content/content";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
import {Aptos, AptosConfig, MoveValue, Network} from "@aptos-labs/ts-sdk";

import Footer_bar from "./Footer/Footer";
import {InfoCircleOutlined, UserAddOutlined, UserOutlined} from "@ant-design/icons";
import { Route, Routes, } from "react-router-dom";
import Swap_page from "./swap_page/swap_box.tsx";
// import Apt_logo from "./art/Aptos_mark_BLK.svg";
// import { Link } from 'react-router-dom';
// import Bet_page from "./Bet_card/Bet_page";
import Admin_page from "./admin/admin_page";
import NFT_page from "./nft/nft_page";
import {WalletSelector} from "@aptos-labs/wallet-adapter-ant-design";
import Helper_page from "./helper/helper";
import Carousel_comp from "./Carousel/Carousel_comp";
import {Content,Footer,Header} from "antd/lib/layout/layout";
import User_page from "./user/user_page";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {motion} from "framer-motion";
import New_Bet_page from "./Bet_card/New_Bet_page";
import {diffusion} from "./setting";
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
interface Helper{
    account:string;
    helper_contribute:string[];
    helper_point:string;
    need_admin:boolean;
    pay_margin:boolean;
    upload_times:string;
    wrong_times:string;
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
interface  Chips {
    left:string;
    middle:string;
    right:string;
    given:string;
}
interface Badges{
    name : string;
    url : string;
}
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
// interface Data{
//     save_admin_set_result: any[]; // 如果不知道具体结构，可以使用any[]
//     save_can_claim: any[];
//     save_chips: any[];
//     save_lost_pair: any[]; // 用object或自定义结构替换
//     save_pair: any[]; // 这是你关心的部分
//     save_result: string;
// }
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

interface Bet_card_data{
    a_win:string;
    b_win:string;
    c_win:string;
    bet:string;
    expired_time:string;
    pair:SavePair;
    time:string;
    which:string;
}
interface Real_Result_Data{
    save_data1:SavePair;
    save_can_claim:boolean;
    save_result:string;
}
const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY':'bT8aS3ezHOl6T1_PyaM30lkg7odC_42l'}
};
// const text1 = `
//   If you are our diffusion helper , you can help us to upload correct result.
// `;
const NOW_Network = "testnet";
// const resources_name = "0xd3d2a6b4340d87ea390368ddcab692cf4b330c86fb5daaa2609e1052c20ca873::helper::Diffusion_store_tree";
// const resources_address = "0xbe47168a83a2ed7114a689e02a7a1cacc04c19fd9f056e9dbf7c921175d05da8";
//
// const test_config = new AptosConfig({
//     fullnode: "https://aptos-testnet.nodit.io/bT8aS3ezHOl6T1_PyaM30lkg7odC_42l/v1",
//     indexer: "https://aptos-testnet.nodit.io/bT8aS3ezHOl6T1_PyaM30lkg7odC_42l/v1/graphql",
// });
const aptosConfig = new AptosConfig({ network: Network.TESTNET});
const aptos = new Aptos(aptosConfig);
// const defaultReal_Result_Data: Real_Result_Data = {
//     save_data1: {
//         can_bet:false,
//         expired_time: "",
//         left: "",
//         left2: "",
//         left_url: "",
//         middle: "",
//         middle2:"",
//         pair_name:"",
//         pair_type: "",
//         right: "",
//         right2: "",
//         right_url: "",
//     },
//     save_can_claim: false,
//     save_result:"99"
// };
let dataArray: Real_Result_Data[] = [];
const defaultHelperData: Helper_data = {
    chips: [],
    pairs: []
};
const defaultProfile: Profile= {
    save_icon:{
        icon:'https://pot-124.4everland.store/user_badges.png',
        name:'User'
    },
    save_bet_card:[],
    save_badges:[],
    save_level:{
        diffusion_point:'0',
        level:'0',
        lose:'0',
        win:'0',
    }
};
const default_helper_to_helper_point:Helper={
    account:'',
    helper_contribute:[],
    helper_point:'',
    need_admin:false,
    pay_margin:false,
    upload_times:'',
    wrong_times:'',
};
const App: React.FC<{id:string}> = ({}) => {

    const { account, signAndSubmitTransaction } =useWallet() ;
    const [open, setOpen] = useState(false);



    const onClose = () => {
        setOpen(false);
    };
    const content = "Set up your icon for diffusion";
    const content1 = "Tell us your name for diffusion";
   //  const [sharedData, setSharedData] = useState<number>(0);
   const [user_address,setuser_address]=useState<string>("User address")
    const  [index_of_to_address]=useState<number>(0);
    const [icon_url , set_icon_url]  = useState('https://raw.githubusercontent.com/yue1823/diffusion/main/client/src/art/diffusion7.png');
    const [account_name , set_account_name] = useState('');
    const [savePair, setSavePair] = useState<SavePair[]>([]);
    const [balance1,set_balance]=useState<string>('');
    const [helper_data,set_helper_data]=useState<MoveValue[]>();
    const [user_profile,set_user_profile] = useState<Profile>();
    const [fetch_data,setfetch_data]=useState<Helper_data>();
    const [data_to_user_page,set_data_to_user_page]=useState<Real_Result_Data[]>();
    const [helper_to_helper_point,set_helper_to_helper_point]=useState<Helper>();
    const create_diffusion_account =  async () =>{
        if (!account) return [];
        const transaction:InputTransactionData = {
            data: {
                function:diffusion.function.create_account_tree(),
                functionArguments:[account_name,icon_url]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
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
            onClose()
        } catch (error: any) {
            console.log(error);
            message.error(`please try again`);
        } finally {


        }
    }
    const fetchList = async () => {
        if (!account) return [];
        // change this to be your module account address




        try {
             await aptos.account.getAccountAPTAmount({accountAddress: account.address}).then(balance=>{ set_balance(String(balance));});

            setuser_address(account.address);
            //const diffusion_exists = await aptos.account.getAccountResource({accountAddress: account.address, resourceType:diffusion.function.create_account_tree()})

            const helper_data = await aptos.view(
                {
                    payload: {
                        function: diffusion.function.check_helper_list(),
                        functionArguments: [account.address]
                    }
                }
            )
            console.log(helper_data);
            // console.log(`https://aptos-${NOW_Network}.nodit.io/v1/accounts/${account.address}/resource/${diffusion.function.diffusion_account_tree()}`)
            set_helper_data(helper_data);
            try{

                    fetch(`https://aptos-${NOW_Network}.nodit.io/v1/accounts/${account.address}/resource/${diffusion.function.diffusion_account_tree()}`, options)
                    .then(response => response.json())
                    .then((response) => {
                        console.log(`respone account: ${response.account}`)
                        console.log(`respone icon: ${response.icon}`)
                        if(response.account == null){
                            console.log(`1`)
                            setOpen(true);
                        }
                        if(response){
                            const new_profile : Profile = {
                                save_icon:{
                                    icon:response.data.save_1.icon,
                                    name:response.data.save_1.name
                                },
                                save_bet_card:response.data.save_2 as Bet_card_data[],
                                save_badges:response.data.save_4 as Badges[],
                                save_level:{
                                    diffusion_point:response.data.save_5.diffusion_loyalty,
                                    level:response.data.save_5.level,
                                    win:response.data.save_5.win,
                                    lose:response.data.save_5.lose
                                }
                            }
                            set_user_profile(new_profile)
                            // console.log(response);
                        }
                    })



                if(helper_data[0] == true){
                    try{
                        const helper_data1 = await aptos.view(
                            {
                                payload: {
                                    function: diffusion.function.view_helper_upload_which_result(),
                                    functionArguments: [account.address]
                                }
                            }
                        )
                        //console.log((helper_data1[0] as Helper).wrong_times)

                        if(helper_data1){
                            const new_helper :Helper = {
                                account:(helper_data1[0] as Helper).account,
                                helper_contribute:(helper_data1[0] as Helper).helper_contribute,
                                helper_point:(helper_data1[0] as Helper).helper_point,

                                need_admin:(helper_data1[0] as Helper).need_admin,
                                pay_margin:(helper_data1[0] as Helper).pay_margin,
                                upload_times:(helper_data1[0] as Helper).upload_times,
                                wrong_times:(helper_data1[0] as Helper).wrong_times,
                            }
                            ///console.log( new_helper)
                            set_helper_to_helper_point(new_helper);
                            // console.log()
                        }
                    }catch (e:any){console.log(e)}

                }

            }catch (e:any){

                console.log(`417: ${e}`)
            }




        } catch (e: any) {

            console.error('Failed to helper bool:', e);
        }finally {
            //setOpen(false);
        }


    };

    const  fatch_diffusion_resource_from_aptos = async () =>{
        if (!account) return [];
        fetch(`https://aptos-${NOW_Network}.nodit.io/v1/accounts/${diffusion.resources_address}/resource/${diffusion.function.diffusion_store_store()}`, options)
            .then(response => response.json())
            .then((response) => {
                console.log(response)

                if(response){
                    const length1 = response.data.save_Pair_result_store.save_pair.length;
                    //console.log(`first time : ${dataArray}`)
                    for (let i = 0; i < length1; i++) {
                        if(i ==0){
                            const new_result: Real_Result_Data = {
                                save_data1:response.data.save_Pair_result_store.save_pair[i] ,
                                save_can_claim: response.data.save_Pair_result_store.save_can_claim[i],
                                save_result: response.data.save_Pair_result_store.save_result[3]
                            }
                            dataArray.push(new_result);
                        }else{
                            const new_result: Real_Result_Data = {
                                save_data1:response.data.save_Pair_result_store.save_pair[i] ,
                                save_can_claim: response.data.save_Pair_result_store.save_can_claim[i],
                                save_result: response.data.save_Pair_result_store.save_result[3+2*i]
                            }
                            dataArray.push(new_result);
                        }
                        // console.log(`save_result [0]: ${response.data.save_Pair_result_store.save_result[0]} `)
                        // console.log(`save_result [1]: ${response.data.save_Pair_result_store.save_result[1]} `)
                        // console.log(`save_result [2]: ${response.data.save_Pair_result_store.save_result[2]} `)
                        // console.log(`save_result [3]: ${response.data.save_Pair_result_store.save_result[3]} `)
                        // console.log(`save_result [4]: ${response.data.save_Pair_result_store.save_result[4]} `)

                    }
                    set_data_to_user_page(dataArray);
                    //console.log(`dataArray : ${dataArray}`)
                    // console.log(`dataArray 0: ${dataArray[0].save_can_claim}`)
                    // console.log(`dataArray 0: ${dataArray[0].save_result}`)
                    // console.log(`dataArray 0: ${dataArray[0].save_data1.pair_name}`)
                    // console.log(`dataArray 1: ${dataArray[1].save_can_claim}`)
                    // console.log(`dataArray 1: ${dataArray[1].save_result}`)
                    // console.log(`dataArray 1: ${dataArray[1].save_data1.pair_name}`)
                    // console.log(`dataArray 2: ${dataArray[2].save_can_claim}`)
                    // console.log(`dataArray 2: ${dataArray[2].save_result}`)
                    // console.log(`dataArray 2: ${dataArray[2].save_data1.pair_name}`)
                    // console.log(`dataArray length: ${dataArray.length}`)

                }
                // set_data_to_user_page
                if (response && response.data.save_Pair_result_store && response.data.save_Pair_result_store.save_pair) {
                    setSavePair(response.data.save_Pair_result_store.save_pair as SavePair[]);
                    const new_date:Helper_data = { pairs:response.data.save_Pair_result_store.save_pair as SavePair[],chips:response.data.save_Pair_result_store.save_chips as Chips[]}
                    setfetch_data(new_date)
                } else {
                    console.error('Unexpected data structure:', response);
                }
                //else {
                //     console.error('Unexpected data structure:', response);
                // }
                // const {name,icon} = response.save1;
                // const { diffusion_loyalty, level,win,lose } = response.save_5;
                // const{badges} = response.save_4;
                // console.log(response)
                // console.log(`save_pair ${savePair}`)
                // console.log(`length of save_pair ${savePair.length}`)
            })
            .catch(err => console.error(err));
        //const priceUpdates = await connection.getLatestVaas()
    }

    useEffect(() => {
        document.title = "Diffusion aptos";
        const setFavicon = () => {
            let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
            if (!link) {
                link = document.createElement('link') as HTMLLinkElement;
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
        };
        setFavicon();

        fatch_diffusion_resource_from_aptos()
        // console.log(`save_pair ： ${savePair}`)
        fetchList();
    }, [account?.address]);

    return (
        <>



                <Row gutter={[{ xs: 16, sm: 24, md: 32, lg: 40 },{ xs: 16, sm: 24, md: 32, lg: 40 }]}>
                    <Layout>

                        <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                            <Col span={24}>
                                <Header style={{display: 'flex', alignItems: 'center',backgroundColor: "#EBE5DF",height:80}}>
                                    <TOP_bar user_address={user_address}  index_of_address={index_of_to_address} profile_data={user_profile ? user_profile:defaultProfile}/>
                                </Header>
                            </Col>
                        </Row>
                        {/*<Content style={{display:"flex"}}>*/}
                        {/*    <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }} style={{width:"auto"}}>*/}
                        {/*        <Col flex={"auto"}>*/}
                        {/*            <Carousel_comp/>*/}
                        {/*        </Col>*/}
                        {/*    </Row>*/}
                        {/*</Content>*/}
                        <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                            <Col span={24}>
                                <div style={{width:1462,height:100}}>
                                    <Content>
                                        <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                                            <Col span={24}>
                                                <Carousel_comp/>

                                            </Col>
                                        </Row>
                                    </Content>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                            <Content style={{padding: '15px 30px'}}>
                                <Routes>
                                    <Route  path={"diffusion/" } element={<Main_content address={user_address} index_of_address={index_of_to_address}/>}/>
                                    <Route  path={"diffusion/app"} element={<Main_content address={user_address} index_of_address={index_of_to_address}/>}/>
                                    <Route  path={"diffusion/swap"} element={<Swap_page/>}/>
                                    <Route  path={"diffusion/Bet"  } element={<New_Bet_page length={savePair ? savePair.length :0} pair={savePair} balance1={balance1} fetch_data={fetch_data ? fetch_data:defaultHelperData} profile_data={user_profile ? user_profile:defaultProfile} result_data={data_to_user_page ? data_to_user_page : dataArray}/> } />
                                    <Route  path={"diffusion/admin"} element={<Admin_page/>}/>
                                    <Route  path={"diffusion/nft"} element={<NFT_page/>}/>
                                    <Route  path={"diffusion/Helper"} element={<Helper_page helper_data={helper_data ? helper_data:[]} fetch_data={fetch_data ? fetch_data:defaultHelperData}/>}/>
                                    <Route path={"diffusion/my_page"} element={<User_page profile_data={user_profile ? user_profile:defaultProfile} result_data={data_to_user_page ? data_to_user_page : dataArray} move_data={helper_data ? helper_data:[]} helper_list={helper_to_helper_point ? helper_to_helper_point: default_helper_to_helper_point}/>}></Route>

                                    {/*<Route path={"/"} element={<Main_content address={user_address} index_of_address={index_of_address}/>}></Route>*/}
                                    {/*<Route path={"/swap"} element={<Swap_page/>}/>*/}
                                </Routes>
                            </Content>
                        </Row>
                        {/*<nav>*/}
                        {/*    <ul>*/}
                        {/*        <li><Link to="/">Home</Link></li>*/}
                        {/*        <li><Link to="/nft">NFT</Link></li>*/}
                        {/*        <li><Link to="/swap">Swap</Link></li>*/}
                        {/*    </ul>*/}
                        {/*</nav>*/}





                        {/*<Routes>*/}
                        {/*    {swap && (*/}
                        {/*        <>*/}
                        {/*            <Route path="/" element={<Swap_page/>}/>*/}
                        {/*        </>*/}
                        {/*    )}*/}
                        {/*</Routes>*/}

                        {/*{(!swap) && (*/}
                        {/*    <>*/}
                        {/*        <Main_content address={user_address} index_of_address={index_of_to_address}/>*/}
                        {/*    </>*/}
                        {/*)}*/}
                        {/*    <Main_content address={user_address} index_of_address={index_of_to_address}/>*/}
                        <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                            <Col span={24}>
                                <Footer style={{textAlign:'center' ,backgroundColor: "#e1dcd6"}}>
                                    <Footer_bar/>
                                </Footer>
                            </Col>
                        </Row>

                    </Layout>
                </Row>


            <Drawer title={<> <Row gutter={24}>
                <Col span={16}>
                    <div style={{position:"relative",top:10}}>
                        <Avatar size={"small"} icon={<UserOutlined/>}/> Diffusion account
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{position:"relative",left:-60,top:-2}}>
                        <WalletSelector />
                    </div></Col>
                </Row></>  }
                    open={open} style={{backgroundColor: "#f5f4f0"}} >
                <Row gutter={[24,24]}>
                    <Col span={24}>
                        <Row>
                            <Col span={24}>
                                <Image
                                    src={icon_url}
                                />
                            </Col>

                        </Row>
                        <br/>
                        <Row gutter={[24,24]}>
                            <Col span={24}><h2>User Name</h2></Col>
                            <br/>
                            <Col span={24}>
                                <Input placeholder="Name" suffix={<span style={{fontSize: 20}}>
                                   <Popover content={content1}>
                                        <InfoCircleOutlined/>
                                    </Popover>
                              </span>}
                                       onChange={input => {
                                           set_account_name(input.target.value);
                                       }}
                                       style={{position:"relative",top:-10}}></Input>

                            </Col>
                            <Col span={24}  style={{position:"relative",top:-15}}><h2>Icon</h2></Col>
                            <br/>
                            <Col span={24}>
                                <Input placeholder="https://" style={{position:"relative",top:-25}} suffix={<span style={{fontSize: 20}} >
                                   <Popover content={content}>
                                        <InfoCircleOutlined/>
                                    </Popover>
                              </span>}
                                       onChange={input => {
                                           set_icon_url(input.target.value);
                                       }}></Input>

                            </Col>
                        </Row>
                        <br/>

                        <Row>
                            <Col span={24}>
                                <Steps
                                    current={0}
                                    status={"error"}
                                    items={[{title: 'No diffusion account', description: "Create one account first."}]}
                                    style={{position:"relative",top:-25}} >
                                </Steps>
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
                            </Col>
                        </Row>

                        <br/>
                        <Row>
                            <Col span={20} style={{position:"relative",top:-25}} >
                                <motion.div className={"box"}
                                            whileHover={{scale: 1.1}}
                                            whileTap={{scale: 0.9}}
                                            transition={{type: "spring", stiffness: 400, damping: 25}}>
                                    <button style={{width:320}}
                                            onClick={create_diffusion_account} className={"rainbow"}><UserAddOutlined/>Create
                                        Account
                                    </button>
                                </motion.div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Drawer>
        </>
    );
}


export default App;
