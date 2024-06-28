import React, {useEffect, useState} from 'react';
import SDK from "@pontem/liquidswap-sdk";
import { AptosAccount, CoinClient, FaucetClient } from 'aptos';
import { NODE_URL, TokensMapping, MODULES_ACCOUNT, RESOURCE_ACCOUNT, FAUCET_URL, NETWORKS_MAPPING } from "./common";
import {message} from "antd";


type TxPayloadCallFunction = {
    type: 'entry_function_payload';
    function: string;
    type_arguments: string[];
    arguments: string[];
};


const Swap_box:React.FC<{ }> = ({ }) => {

    const ask_price = async () =>{
        const sdk = new SDK({
            nodeUrl: NODE_URL,
            networkOptions: {
                resourceAccount: RESOURCE_ACCOUNT,
                moduleAccount: MODULES_ACCOUNT,
                modules: {
                    Scripts: `${MODULES_ACCOUNT}::scripts_v2`,
                    CoinInfo: '0x1::coin::CoinInfo',
                    CoinStore: '0x1::coin::CoinStore',
                },
            },
        });
        const client = sdk.client;
        try {
            // get Rate for USDT coin.
            const usdtRate = await sdk.Swap.calculateRates({
                fromToken: TokensMapping.APTOS,
                toToken: TokensMapping.USDT,
                amount: 10000000, // 0.1 APTOS
                curveType: 'uncorrelated',
                interactiveToken: 'from',
            })
            message.success(`Price:${usdtRate}`)
            console.log('SsdtRate: ', usdtRate);
        }catch (e:any){
            console.log("error",e);
            message.error(`error:${e}`)
        }
    }


    return (
        <>
            <button onClick={ask_price}>ask </button>
        </>
    );
}

export default Swap_box;