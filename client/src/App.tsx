import React, {useEffect, useState} from 'react';
import {Avatar, Button, Col, Drawer, Layout, Row, Steps, Image, message, List, Input, Popover} from "antd";
import TOP_bar from './header/heard_bar';
import Main_content from "./content/content";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { DataContext } from './DataContext';
import Footer_bar from "./Footer/Footer";
import {CloseOutlined, InfoCircleOutlined, UserAddOutlined, UserOutlined} from "@ant-design/icons";
import {HashRouter as Router, Route, Routes, Outlet, useNavigate} from "react-router-dom";
import Swap_page from "./swap_page";
import Apt_logo from "./art/Aptos_mark_BLK.svg";
import { Link } from 'react-router-dom';
import Bet_page from "./Bet_card/Bet_page";
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
import Website_page from "./website/website_page";
interface Cylinder_Pair{
    already_send:string;
    coin:string;
    coin_address:string;
    pair_number:string;
    save_number:string;
    save_total:string;
    send_address_vector:string[];
    send_amount_vector:string[];
}
interface Helper{
    account:string;
    helper_contribute:string[];
    helper_point:string;
    need_admin:boolean;
    pay_margin:boolean;
    upload_times:string;
    wrong_time:string;
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
interface Badges_list{
    save_badges:Badges;
    save_can_mint:boolean;
    save_allow_list:string[];
    save_list:string[];
}
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
//                         big_vec: {
//                             vec: any[];  // 你可以根据具体数据类型替换 `any`
//                         };
//                         bucket_size: {
//                             vec: any[];  // 你可以根据具体数据类型替换 `any`
//                         };
//                         inline_capacity: {
//                             vec: any[];  // 你可以根据具体数据类型替换 `any`
//                         };
//                         inline_vec: any[];  // 你可以根据具体数据类型替换 `any`
//                     };
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
interface Data{
    save_admin_set_result: any[]; // 如果不知道具体结构，可以使用any[]
    save_can_claim: any[];
    save_chips: any[];
    save_lost_pair: any[]; // 用object或自定义结构替换
    save_pair: any[]; // 这是你关心的部分
    save_result: string;
}
const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY':'bT8aS3ezHOl6T1_PyaM30lkg7odC_42l'}
};
const text1 = `
  If you are our diffusion helper , you can help us to upload correct result.
`;
const NOW_Network = "testnet";
const resources_name = "0x6484fa91822ffab0092151219d0ca96beff41934e9ebbdaac432899594c5055::helper::Diffusion_store_tree";
const resources_address = "0x7d6d0640179e280abefeda5d687115ebcf5595337e777e86d1296fb1967fa4b";

const test_config = new AptosConfig({
    fullnode: "https://aptos-testnet.nodit.io/bT8aS3ezHOl6T1_PyaM30lkg7odC_42l/v1",
    indexer: "https://aptos-testnet.nodit.io/bT8aS3ezHOl6T1_PyaM30lkg7odC_42l/v1/graphql",
});
const aptosConfig = new AptosConfig({ network: Network.TESTNET});
const aptos = new Aptos(aptosConfig);

const App: React.FC<{id:string}> = ({id}) => {

    const { account, signAndSubmitTransaction } =useWallet() ;
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    const content = "Set up your icon for diffusion";
    const content1 = "Tell us your name for diffusion";
    const [swap,setswap]=useState<boolean>(true);
    const [sharedData, setSharedData] = useState<number>(0);
    const [accountHasList, setAccountHasList] = useState<boolean>(false);
    const [user_address,setuser_address]=useState<string>("User address")
    const  [index_of_to_address]=useState<number>(0);
    const [diffusion_account,setdiffusion_account]=useState<boolean>(false);
    const diffusion_address = "0x06484fa91822ffab0092151219d0ca96beff41934e9ebbdaac432899594c5055";
    const [transaction_hash , settransaction_hash] = useState<string>('');
    const [icon_url , set_icon_url]  = useState('https://raw.githubusercontent.com/yue1823/diffusion/main/client/src/art/diffusion7.png');
    const [account_name , set_account_name] = useState('');
    const [savePair, setSavePair] = useState<SavePair[]>([]);
    const [balance1,set_balance]=useState<string>('');
    const create_diffusion_account =  async () =>{
        if (!account) return [];
        const transaction:InputTransactionData = {
            data: {
                function:`${diffusion_address}::helper::create_account_tree`,
                functionArguments:[account_name,icon_url]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=${NOW_Network}`;
            settransaction_hash(transaction_1.hash);
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
        const random_resource = `${diffusion_address}::helper::Account_tree` as `${string}::${string}::${string}`
        const random_view_fun  = `${diffusion_address}::pay_module::check_randome` as `${string}::${string}::${string}`

        try {
            let a= await aptos.account.getAccountAPTAmount({accountAddress: account.address}).then(balance=>{ set_balance(String(balance));});

            setuser_address(account.address);
            const diffusion_exists = await aptos.account.getAccountResource({accountAddress: account.address, resourceType:random_resource})
            setOpen(false);
        } catch (e: any) {
            setOpen(true);
            console.error('Failed to parse JSON:', e);
        }
    };

    const  fatch_diffusion_resource_from_aptos = async () =>{
        if (!account) return [];
        fetch(`https://aptos-${NOW_Network}.nodit.io/v1/accounts/${resources_address}/resource/${resources_name}`, options)
            .then(response => response.json())
            .then((response) => {
                if (response && response.data.save_Pair_result_store && response.data.save_Pair_result_store.save_pair) {
                    setSavePair(response.data.save_Pair_result_store.save_pair as SavePair[]);
                } else {
                    console.error('Unexpected data structure:', response);
                }
                //else {
                //     console.error('Unexpected data structure:', response);
                // }
                // const {name,icon} = response.save1;
                // const { diffusion_loyalty, level,win,lose } = response.save_5;
                // const{badges} = response.save_4;
                console.log(response)
                console.log(`save_pair ${savePair}`)
                console.log(`length of save_pair ${savePair.length}`)
            })
            .catch(err => console.error(err));
        //const priceUpdates = await connection.getLatestVaas()
    }

    useEffect(() => {
        document.title = "Diffusion aptos";
        const setFavicon = (url: string) => {
            let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
            if (!link) {
                link = document.createElement('link') as HTMLLinkElement;
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
        };
        setFavicon(Apt_logo);

       fatch_diffusion_resource_from_aptos()
        console.log(`save_pair ： ${savePair}`)
    fetchList();
    }, [account?.address]);
  return (
      <>

          <DataContext.Provider value={{ sharedData, setSharedData }}>

                <Row gutter={[{ xs: 16, sm: 24, md: 32, lg: 40 },{ xs: 16, sm: 24, md: 32, lg: 40 }]}>
                  <Layout>

                            <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                                <Col span={24}>
                                    <Header style={{display: 'flex', alignItems: 'center',backgroundColor: "#EBE5DF",height:80}}>
                                        <TOP_bar user_address={user_address}  index_of_address={index_of_to_address}/>
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
                                      <Route  path={"/" } element={<Main_content address={user_address} index_of_address={index_of_to_address}/>}/>
                                      <Route  path={"app"} element={<Main_content address={user_address} index_of_address={index_of_to_address}/>}/>
                                      <Route  path={"/swap"} element={<Swap_page/>}/>
                                      <Route  path={"Bet"  } element={<New_Bet_page length={savePair ? savePair.length :0} pair={savePair} balance1={balance1}/>}/>
                                      <Route  path={"admin"} element={<Admin_page/>}/>
                                      <Route  path={"nft"} element={<NFT_page/>}/>
                                      <Route  path={"Helper"} element={<Helper_page/>}/>
                                      <Route path={"my_page"} element={<User_page/>}></Route>

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
          </DataContext.Provider>

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
                                          whileHovwe={{scale: 1.5}}
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

const NavigationButton = () => {
    const navigate = useNavigate();
    const swap_button_link = () => {
        navigate('/swap');
    };
    return (
        <button style={{height: 30, width: 30}} onClick={swap_button_link}>
            Go to Swap
        </button>
    );
}

export default App;
