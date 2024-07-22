import React, {useEffect, useState} from 'react';
import {Avatar, Button, Col, Drawer, Layout, Row, Steps, Image, message, List} from "antd";
import TOP_bar from './header/heard_bar';
import Main_content from "./content/content";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { DataContext } from './DataContext';
import Footer_bar from "./Footer/Footer";
import {CloseOutlined, UserAddOutlined, UserOutlined} from "@ant-design/icons";
import {BrowserRouter as Router, Route, Routes, Outlet, useNavigate} from "react-router-dom";
import Swap_page from "./swap_page";
import Apt_logo from "./art/Aptos_mark_BLK.svg";
import { Link } from 'react-router-dom';
import Bet_page from "./Bet_card/Bet_page";
import Admin_page from "./admin/admin_page";
import NFT_page from "./nft/nft_page";



const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

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

                  <Layout>
                      <Router>

                        <TOP_bar user_address={user_address}  index_of_address={index_of_to_address}/>
                          <Routes>
                              <Route  path="/Transfer" element={<Main_content address={user_address} index_of_address={index_of_to_address}/>}/>
                              <Route  path="/Swap" element={<Swap_page/>}/>
                              <Route  path="/Bet"   element={<Bet_page/>}/>
                              <Route  path={"/admin"} element={<Admin_page/>}/>
                              <Route  path={"/nft"} element={<NFT_page/>}/>
                              {/*<Route path={"/"} element={<Main_content address={user_address} index_of_address={index_of_address}/>}></Route>*/}
                              {/*<Route path={"/swap"} element={<Swap_page/>}/>*/}
                          </Routes>
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
                      <Footer_bar/>
                      </Router>
                  </Layout>

          </DataContext.Provider>
          <Drawer title={<> <Avatar size={"small"} icon={<UserOutlined/>}/> Diffusion account </>}
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
