import React, {useEffect, useState} from 'react';
import {Col, Layout, Row} from "antd";
import TOP_bar from './header/heard_bar';
import Main_content from "./content/content";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);

function App() {
    const { account } = useWallet();
    const [accountHasList, setAccountHasList] = useState<boolean>(false);
    const [user_address,setuser_address]=useState<string>("User address")
    const  [index_of_to_address,set_index_of_to_address]=useState<number>(0);
    const fetchList = async () => {
        if (!account) return [];
        // change this to be your module account address

        const moduleAddress = "0xcbddf398841353776903dbab2fdaefc54f181d07e114ae818b1a67af28d1b018";
        try {
            setuser_address(account.address);
            const todoListResource = await aptos.getAccountResource(
                {
                    accountAddress:account?.address,
                    resourceType:`${moduleAddress}::todolist::TodoList`
                }
            );
            setAccountHasList(true);
        } catch (e: any) {
            setAccountHasList(false);
        }
    };
    useEffect(() => {
        fetchList();
    }, [account?.address]);
  return (
      <>

          <Layout>

              <TOP_bar/>
              <Main_content address={user_address} index_of_address={index_of_to_address}/>
              <Row align="middle">

              </Row>
          </Layout>

      </>
  );
}

export default App;
