

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import {PetraWallet} from "petra-plugin-wallet-adapter";
import {PropsWithChildren, useEffect} from "react";
import { Network } from "@aptos-labs/ts-sdk";
import { useAutoConnect } from "./components/AutoConnectProvider";
import {message} from "antd";


export const WalletProvider = ({ children }: PropsWithChildren) => {
  const { autoConnect } = useAutoConnect();
    const wallets = [
        new PetraWallet(),
    ];
  // const wallets = [
  //   new PontemWallet(),
  // ];
    useEffect(() => {
        console.log(wallets)
    }, []);
  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      dappConfig={{
        network: Network.TESTNET,
      }}
      onError={(error) => {
        message.error(error)
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
