import React, {useEffect, useState} from 'react';
import {Avatar, Button, Col, Drawer, Layout, Row, Steps, Image, message, List} from "antd";
import TOP_bar from './header/heard_bar';
import Main_content from "./content/content";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { DataContext } from './DataContext';
import Footer_bar from "./Footer/Footer";
import {CloseOutlined, UserAddOutlined, UserOutlined} from "@ant-design/icons";
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



const test_config = new AptosConfig({
    fullnode: "https://aptos-testnet.nodit.io/bT8aS3ezHOl6T1_PyaM30lkg7odC_42l/v1",
    indexer: "https://aptos-testnet.nodit.io/bT8aS3ezHOl6T1_PyaM30lkg7odC_42l/v1/graphql",
});
const aptosConfig = new AptosConfig({ network: Network.TESTNET });

const aptos = new Aptos(test_config);

function App() {

    const { account, signAndSubmitTransaction } =useWallet() ;
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };


    const [swap,setswap]=useState<boolean>(true);
    const [sharedData, setSharedData] = useState<number>(0);
    const [accountHasList, setAccountHasList] = useState<boolean>(false);
    const [user_address,setuser_address]=useState<string>("User address")
    const  [index_of_to_address]=useState<number>(0);
    const [diffusion_account,setdiffusion_account]=useState<boolean>(false);
    const diffusion_address = "0x2e86a41d1b86d4a82c1c74ece536108fc8f9dc5858a6ab5eb488e37d83098eb2";
    const [transaction_hash , settransaction_hash] = useState<string>('');
    const create_diffusion_account =  async () =>{
        if (!account) return [];
        const transaction:InputTransactionData = {
            data: {
                function:`${diffusion_address}::pay_module::save_randome`,
                functionArguments:[]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;
            settransaction_hash(transaction_1.hash);
            message.success(
                <span>
                        hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                    </span>
            )
            onClose()
        } catch (error: any) {
            message.error(`please try again`)
        } finally {

            
        }
    }
    const fetchList = async () => {
        if (!account) return [];
        // change this to be your module account address
        const random_resource = `${diffusion_address}::pay_module::Randomness_store` as `${string}::${string}::${string}`
        const random_view_fun  = `${diffusion_address}::pay_module::check_randome` as `${string}::${string}::${string}`

        try {
            setuser_address(account.address);
            const diffusion_exists = await aptos.account.getAccountResource({accountAddress: account.address, resourceType:random_resource})
            setOpen(false);
        } catch (e: any) {
            setOpen(true);
            console.error('Failed to parse JSON:', e);
        }
    };
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
                                      <Route  path={"Bet"  } element={<Bet_page/>}/>
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
          </Row></> }
                  open={open}>
              <Image
                  width={300}
                  src="https://raw.githubusercontent.com/yue1823/diffusion/main/client/src/art/diffusion7.png"
              />
              <br/>
              <br/>
              <Steps
                  current={0}
                  status={"error"}
                  items={[{title: 'No diffusion account', description: "Create one account first."}]}>
              </Steps>
              <br/>
              <Button type="primary" shape="round" icon={<UserAddOutlined/>} size={'large'} onClick={create_diffusion_account}>Create Account</Button>
          </Drawer>
      </>
  );
}

const NavigationButton = () =>{
    const navigate = useNavigate();
    const swap_button_link=()=>{
        navigate('/swap');
    };
    return (
        <button style={{ height: 30, width: 30 }} onClick={swap_button_link}>
            Go to Swap
        </button>
    );
}

export default App;
