import React, {useEffect, useState} from 'react';
import {Avatar, Button, Col, Drawer, Layout, Row, Steps, Image, message} from "antd";
import TOP_bar from './header/heard_bar';
import Main_content from "./content/content";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { DataContext } from './DataContext';
import Footer_bar from "./Footer/Footer";
import {CloseOutlined, UserAddOutlined, UserOutlined} from "@ant-design/icons";

const aptosConfig = new AptosConfig({ network: Network.DEVNET });
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

    const [sharedData, setSharedData] = useState<number>(0);
    const [accountHasList, setAccountHasList] = useState<boolean>(false);
    const [user_address,setuser_address]=useState<string>("User address")
    const  [index_of_to_address]=useState<number>(0);
    const [diffusion_account,setdiffusion_account]=useState<boolean>(false);
    const diffusion_address = "0xfbd26e5585a977ca7d1d0e1d6a8337fa9ca37ad01dc945d978cc296327dd20f0";
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
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=devnet`;
            settransaction_hash(transaction_1.hash);
            message.success(
                <span>
                        hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                    </span>
            )
            onClose()
        } catch (error: any) {
            message.error(`please try again`)
        } finally {}
    }
    const fetchList = async () => {
        if (!account) return [];
        // change this to be your module account address
        const random_resource = `${diffusion_address}::pay_module::Randomness_store` as `${string}::${string}::${string}`
        const random_view_fun  = `${diffusion_address}::pay_module::check_randome` as `${string}::${string}::${string}`
        const moduleAddress = "0xfbd26e5585a977ca7d1d0e1d6a8337fa9ca37ad01dc945d978cc296327dd20f0";
        try {
            setuser_address(account.address);
            const diffusion_exists = await aptos.general.view({payload: {function: random_view_fun, typeArguments: [random_resource]}});
            //const diffusion_exists = await aptos.account.getAccountResource({accountAddress: account.address, resourceType:random_resource})

            if(diffusion_exists){
                setdiffusion_account(true)
            }else{
                showDrawer();
            }
            setAccountHasList(true);
        } catch (e: any) {
            setAccountHasList(false);
        }
    };
    useEffect(() => {
    fetchList() ;
    }, [account?.address]);
  return (
      <>
          <DataContext.Provider value={{ sharedData, setSharedData }}>
              <Layout>

                  <TOP_bar/>
                  <Main_content address={user_address} index_of_address={index_of_to_address}/>

                   <Footer_bar/>

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

export default App;
