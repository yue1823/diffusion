import React, {useEffect, useState} from 'react';
import SDK from "@pontem/liquidswap-sdk";
import { AptosAccount, CoinClient, FaucetClient } from 'aptos';
import { NODE_URL, TokensMapping, MODULES_ACCOUNT, RESOURCE_ACCOUNT, FAUCET_URL, NETWORKS_MAPPING } from "./common";
import {Avatar, Button, Col, Input, message, Row, Segmented, Select, theme} from "antd";
import {Buffer} from "buffer";
import Decimal from 'decimal.js';
import {d, getOptimalLiquidityAmount} from "@pontem/liquidswap-sdk/dist/tsc/utils";
import {dStable, f, lp_value} from "@pontem/liquidswap-sdk/dist/tsc/utils/swap-math";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
import {AptosCoinInfoResource, AptosResourceType, CurveType} from "@pontem/liquidswap-sdk/dist/tsc/types/aptos";
import {VERSION_0, VERSION_0_5} from "@pontem/liquidswap-sdk/dist/tsc/constants";
import {UserOutlined} from "@ant-design/icons";
import logo from "../art/diffusion.png";
import logo_aries from "../logo/aries.svg";
import logo_pontem from "../logo/Pontem.svg";
import logo_panora from "../logo/Panora.svg";
import logo_pancake from "../logo/pancake.svg";
import logo_cellena from "../logo/cellana.svg";
import {HappyProvider} from "@ant-design/happy-work-theme";
import {useNavigate} from "react-router-dom";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
interface ICalculateRatesParams {
    fromToken: AptosResourceType;
    toToken: AptosResourceType;
    amount: Decimal | number;
    interactiveToken: 'from' | 'to';
    curveType: CurveType;
    slippage: number;
    version?: typeof VERSION_0 | typeof VERSION_0_5;
}

type TxPayloadCallFunction = {
    type: 'entry_function_payload';
    function: string;
    type_arguments: string[];
    arguments: string[];
};
const aptosConfig = new AptosConfig({ network: Network.MAINNET});
const aptos = new Aptos(aptosConfig);

const Swap_box:React.FC<{ }> = ({ }) => {
    const { account, signAndSubmitTransaction } = useWallet();
    const [pool_fee,setpool_fee]=useState<string>('');
    const DENOMINATOR = new Decimal(10000);
    const e8 = new Decimal('100000000');
    const sdk = new SDK({
        nodeUrl: "https://fullnode.testnet.aptoslabs.com/v1",
        networkOptions: {
            resourceAccount: "0x05a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948",
            moduleAccount: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12",
            modules: {
                Scripts: `0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2`,
                CoinInfo: '0x1::coin::CoinInfo',
                CoinStore: '0x1::coin::CoinStore',
            },
        },
    });
    const client = sdk.client;

    const create_swap = async() =>{
        if(!account){return}
        try {
            if (swap_to_coin != swap_from_coin) {
                const response = await signAndSubmitTransaction({
                    data:{
                        function:"0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v3::swap",
                        typeArguments: ["0x1::aptos_coin::AptosCoin","0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC","0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated"],
                        functionArguments: ["1000000","69218"],
                    }}

                )
                await aptos.waitForTransaction(response?.hash)
                console.log(`Swap transaction ${response?.hash} is submitted.`);
                console.log(`Check on explorer: https://explorer.aptoslabs.com/txn/${response?.hash}?network=${NETWORKS_MAPPING.DEVNET}`);

            }
        }catch (e:any){}
    }
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    const ask_price = async () =>{
        const client = sdk.client;
        try {
            // get Rate for USDT coin.
            let usdtRate = await calculateRate(TokensMapping.APTOS,TokensMapping.USDC,10000000,'Uncorrelated',"from",0.5);
            // const usdtRate = await sdk.Swap.calculateRates({
            //     fromToken: TokensMapping.APTOS,
            //     toToken: TokensMapping.USDT,
            //     amount: 10000000, // 0.1 APTOS
            //     curveType: 'Uncorrelated',
            //     interactiveToken: 'from',
            // })
            // const { rate, receiveLp } = await calculateRateAndMinReceivedLP({
            //     fromToken:TokensMapping.APTOS,
            //     toToken:"0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins::DevnetUSDC",
            //     amount: 10000000, // 0.1 APTOS
            //     curveType: 'uncorrelated',
            //     interactiveToken: 'from',
            //     slippage: 0.005,
            // });

           message.success(`rate:${usdtRate}`)
            console.log('SsdtRate: ', usdtRate);
        }catch (e:any){
            console.log("error",e);
            message.error(`error:${e}`)
        }
    }
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };
    /////Pontem sdk //////


    const extractAddressFromType=(type: string) =>{
        return type.split('::')[0];

    }

    const calculateRateAndMinReceivedLP = async (

        params: ICalculateRatesParams,
        ): Promise<{ rate: string; receiveLp: string }> => {

        const { modules } = sdk.networkOptions;

        let fromCoinInfo;
        try {
            let a ="0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>" as `${string}::${string}::${string}`
            fromCoinInfo =
                await aptos.getAccountResource({accountAddress:"0xeeeb01ae130cecc693d410641b2b79328fa0ba025c2ec00405b4823ad9221d56",resourceType:a})
                // await sdk.Resources.fetchAccountResource<AptosCoinInfoResource>(
                //     "0xeeeb01ae130cecc693d410641b2b79328fa0ba025c2ec00405b4823ad9221d56",
                //     "0x1::aptos_coin::AptosCoin",
                // );

        } catch (e) {
            console.log(e);
        }

        let toCoinInfo;
        try {
            let a ="0x1::coin::CoinInfo<0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins::DevnetUSDC>" as `${string}::${string}::${string}`
            toCoinInfo =
                await aptos.getAccountResource({accountAddress:"0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68",resourceType:a})
                // await sdk.Resources.fetchAccountResource<AptosCoinInfoResource>(
                //     extractAddressFromType(params.toToken),
                //     composeType(modules.CoinInfo,[params.toToken]),
                // );
            console.log("hello 2 ");
        } catch (e) {
            console.log("fail 2");
            console.log(e);
        }

        if (!fromCoinInfo) {
        throw new Error('From Coin not exists');
    }

    if (!toCoinInfo) {
        throw new Error('To Coin not exists');
    }

    const isSorted = is_sorted(params.fromToken, params.toToken);

    const { liquidityPoolResource } = await sdk.Liquidity.getLiquidityPoolResource(
        params,
    );

    if (!liquidityPoolResource) {
        throw new Error(`LiquidityPool not existed`);
    }

    const fromReserve = isSorted
        ? d(liquidityPoolResource.data.coin_x_reserve.value)
        : d(liquidityPoolResource.data.coin_y_reserve.value);
    const toReserve = isSorted
        ? d(liquidityPoolResource.data.coin_y_reserve.value)
        : d(liquidityPoolResource.data.coin_x_reserve.value);

    const optimalAmount =
        params.interactiveToken === 'from'
            ? getOptimalLiquidityAmount(d(params.amount), fromReserve, toReserve)
            : getOptimalLiquidityAmount(d(params.amount), toReserve, fromReserve);

    const { liquidityPoolResource: lpSupplyResponse } =
        await sdk.Liquidity.getLiquiditySupplyResource(params);
    if (!lpSupplyResponse) {
        throw new Error(`lpSupplyResponse not existed`);
    }

    let lpSupply;
    try {
        // TODO: fix typing
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lpSupply = lpSupplyResponse.data.supply.vec[0].integer.vec[0].value;
    } catch (e) {
        console.log(e);
    }

    const receiveLp = sdk.Liquidity.calculateSupply({
        slippage: params.slippage,
        fromReserve,
        toReserve,
        fromAmount:
            params.interactiveToken === 'from' ? params.amount : optimalAmount,
        toAmount:
            params.interactiveToken === 'to' ? params.amount : optimalAmount,
        lpSupply: lpSupply,
        isSorted,
    });

    return { rate: optimalAmount.toFixed(0), receiveLp };
}


    const cmp=(a: number, b: number)=>{
        if (a === b) {
            return 0;
        } else if (a < b) {
            return 1;
        } else {
            return 2;
        }
    }
    const composeType=(address: string, ...args: unknown[]): string=> {
        const generics: string[] = Array.isArray(args[args.length - 1])
            ? (args.pop() as string[])
            : [];
        const chains = [address, ...args].filter(Boolean);

        let result: string = chains.join('::');

        if (generics && generics.length) {
            result += `<${generics.join(',')}>`;
        }

        return result;
    }
    const cmp_addresses=(a: string, b: string) =>{
        if (a.startsWith('0x')) {
            a = a.substring(2);
        }

        if (a.length != 64) {
            while (a.length < 64) {
                a = '0' + a;
            }
        }

        if (b.startsWith('0x')) {
            b = b.substring(2);
        }

        if (b.length != 64) {
            while (b.length < 64) {
                b = '0' + b;
            }
        }

        const a_buf = Buffer.from(a, 'hex');
        const b_buf = Buffer.from(b, 'hex');

        for (let i = 0; i < 32; i++) {
            if (a_buf[i] < b_buf[i]) {
                return 1;
            } else if (a_buf[i] > b_buf[i]) {
                return 2;
            }
        }

        return 0;
    }


    const compare=(symbolX: string, symbolY: string) =>{
        const lenCmp = cmp(symbolX.length, symbolY.length);
        if (lenCmp != 0) {
            return lenCmp;
        }
        let i = 0;
        while (i < symbolX.length && i < symbolY.length) {
            const elem_cmp = cmp(symbolX.charCodeAt(i), symbolY.charCodeAt(i));
            if (elem_cmp != 0) return elem_cmp;
            i++;
        }
        return 0;
    }
    const compare_types = (coin_x:string,coin_y:string)=> {
        const coin_x_parts = coin_x.split('::').reverse();
        const coin_y_parts = coin_y.split('::').reverse();

        const coin_x_address = coin_x_parts.pop() as string;
        const coin_y_address = coin_y_parts.pop() as string;

        for (let i = 0; i < 2; i++) {
            const c = compare(coin_x_parts[i], coin_y_parts[i]);
            if (c != 0) {
                return c;
            }
        }
        return cmp_addresses(coin_x_address, coin_y_address);
    }
    const is_sorted=(coin_x:string,coin_y:string)=>{
        //console.log(` return compare_types ${compare_types(coin_x,coin_y) ==1}`);
        return compare_types(coin_x,coin_y) ==1;

    }

    const  get_liquidity_Pool_Resource=(fromtoken:string,totoken:string,curve:string,version?:number)=>{
        const get_curve=(type:string,contract?:number):string=>{
            if(contract === 0.5){
                if(type ==='Stable'){
                    return 'Stable'
                }else{return 'Uncorrelated'}
            }else{
                if(type ==='Stable'){
                    return 'Stable'
                }else{return 'Uncorrelated'}
            }
        }
        const curves=get_curve(curve,version);

        const moduleAcc = version === 0.5 ?'0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e' : '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12';
        const resourceAcc = version === 0.5 ? '0x61d2c22a6cb7831bee0f48363b0eec92369357aece0d1142062f7d5d85c7bef8' : '0x05a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948';
        const modulesLiquidityPool = composeType(moduleAcc,'liquidity_pool', 'LiquidityPool');
        const curves_1=composeType(moduleAcc,"curves",curves);
        //console.log(`curves_1: ${curves_1}`)
        //0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::liquidity_pool::LiquidityPool<0x1::aptos_coin::AptosCoin,0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Uncorrelated>
        const get_Pool_Str=(coin_x:string,coin_y:string,curve:string):string=>{
            const [sortedX, sortedY] = is_sorted(coin_x, coin_y)
                ? [coin_x, coin_y]
                : [coin_y, coin_x];
            return composeType(modulesLiquidityPool, [sortedX, ` ${sortedY}`,` ${curve}`]);

        }
        const liquidity_Pool_type  = get_Pool_Str(fromtoken,totoken,curves_1);
        // console.log(`liquidity_Pool_resouce account: ${resourceAcc}`)
        // console.log(`liquidity_Pool_type: ${liquidity_Pool_type}`)
        let liquidity_Pool_resouce;
        try{
            liquidity_Pool_resouce= aptos.getAccountResource({accountAddress:resourceAcc,resourceType:(liquidity_Pool_type as `${string}::${string}::${string}`)});
        }catch(e){console.log(e);}

        return{liquidity_Pool_type, liquidity_Pool_resouce};
    }
    const getCoinOutWithFees=( coinInVal: Decimal,
                               reserveInSize: Decimal,
                               reserveOutSize: Decimal,
                               fee: Decimal,): Decimal =>{
        const { feePct, feeScale } = { feePct: fee, feeScale: d(DENOMINATOR) };
        const feeMultiplier = feeScale.minus(feePct);
        const coinInAfterFees = coinInVal.mul(feeMultiplier);
        const newReservesInSize = reserveInSize.mul(feeScale).plus(coinInAfterFees);
        return coinInAfterFees.mul(reserveOutSize).div(newReservesInSize);
    }
    const getCoinInWithFees=(
        coinOutVal: Decimal,
        reserveOutSize: Decimal,
        reserveInSize: Decimal,
        fee: Decimal,
    ): Decimal =>{
        const feeMultiplier = DENOMINATOR.minus(fee);
        const newReservesOutSize = reserveOutSize
            .minus(coinOutVal)
            .mul(feeMultiplier);
        return coinOutVal
            .mul(DENOMINATOR)
            .mul(reserveInSize)
            .div(newReservesOutSize)
            .plus(1);
    }
    const get_y=(x0: Decimal, xy: Decimal, y: Decimal): Decimal=> {
        let i = 0;
        while (i < 255) {
            const k = f(x0, y);

            let dy = new Decimal(0);
            if (k.lt(xy)) {
                dy = xy.minus(k).div(dStable(x0, y)).plus(1);
                y = y.plus(dy);
            } else {
                dy = k.minus(xy).dividedBy(dStable(x0, y));
                y = y.minus(dy);
            }

            if (dy.lte(1)) {
                return y;
            }

            i++;
        }
        return y;
    }
    const coin_in=(
        coinOut: Decimal,
        scaleOut: Decimal,
        scaleIn: Decimal,
        reserveOut: Decimal,
        reserveIn: Decimal,
    ): Decimal=>{
        const xy = lp_value(reserveIn, scaleIn, reserveOut, scaleOut);

        const reserve_in = reserveIn.mul(e8).div(scaleIn);
        const reserve_out = reserveOut.mul(e8).div(scaleOut);
        const amount_out = coinOut.mul(e8).div(scaleOut);

        const total_reserve = reserve_out.minus(amount_out);
        const x = get_y(total_reserve, xy, reserve_in).minus(reserve_in);
        return x.mul(scaleIn).div(e8);
    }

    const coin_out=(
        coinIn: Decimal,
        scaleIn: Decimal,
        scaleOut: Decimal,
        reserveIn: Decimal,
        reserveOut: Decimal,
    ): Decimal =>{
        const xy = lp_value(reserveIn, scaleIn, reserveOut, scaleOut);

        const reserve_in = reserveIn.mul(e8).div(scaleIn);
        const reserve_out = reserveOut.mul(e8).dividedBy(scaleOut);
        const amount_in = coinIn.mul(e8).div(scaleIn);
        const total_reserve = amount_in.plus(reserve_in);
        const y = reserve_out.minus(get_y(total_reserve, xy, reserve_out));
        return y.mul(scaleOut).div(e8);
    }
    const getCoinsInWithFeesStable=(
        coinOut: Decimal,
        reserveOut: Decimal,
        reserveIn: Decimal,
        scaleOut: Decimal,
        scaleIn: Decimal,
        fee: Decimal,
    ): Decimal =>{
        const r = coin_in(coinOut, scaleOut, scaleIn, reserveOut, reserveIn);
        return r.plus(1).mul(DENOMINATOR).div(DENOMINATOR.minus(fee)).plus(1);
    }
    const getCoinsOutWithFeesStable=(
        coinIn: Decimal,
        reserveIn: Decimal,
        reserveOut: Decimal,
        scaleIn: Decimal,
        scaleOut: Decimal,
        fee: Decimal,
    ): Decimal =>{
        let coin_in_val_after_fees = new Decimal(0);
        const coin_in_val_scaled = coinIn.mul(DENOMINATOR.minus(fee));
        if (!coin_in_val_scaled.mod(DENOMINATOR).eq(0)) {
            coin_in_val_after_fees = coin_in_val_scaled.div(DENOMINATOR).plus(1);
        } else {
            coin_in_val_after_fees = coin_in_val_scaled.div(DENOMINATOR);
        }
        return coin_out(
            coin_in_val_after_fees,
            scaleIn,
            scaleOut,
            reserveIn,
            reserveOut,
        );}


    const  calculateRate =async (fromtoken:string,totoken:string,amount:Decimal|number,curve:'Uncorrelated'|'Stable',interactive:'from'|'to',version?:number)=>{
        let from_coin_info ;
        try{
            from_coin_info=await aptos.getAccountResource({accountAddress:extractAddressFromType(fromtoken),resourceType:composeType("0x1::coin::CoinInfo",[fromtoken]) as `${string}::${string}::${string}` })
            // console.log(` from_coin_info value: ${from_coin_info.data.value}`);
            // console.log(` from_coin_info name : ${from_coin_info.name}`);
        }catch(e){console.log(e);}
        let to_coin_info;
        try{
            to_coin_info=await aptos.getAccountResource({accountAddress:extractAddressFromType(totoken),resourceType:composeType("0x1::coin::CoinInfo",[totoken]) as `${string}::${string}::${string}` })
            // console.log(` to_coin_info: ${to_coin_info}`);
        }catch(e){console.log(e);}
        if(!from_coin_info ){throw new Error('From Coin not exists');}
        if(!to_coin_info ){throw new Error('To Coin not exists');}
        const { liquidity_Pool_type, liquidity_Pool_resouce } =  get_liquidity_Pool_Resource(fromtoken,totoken,curve,version);
        if(! liquidity_Pool_resouce){throw new Error(`LiquidityPool (${liquidity_Pool_type}) not found`);}
        const isSorted=is_sorted(fromtoken,totoken);
        const [sortedFromCoinInfo, sortedToCoinInfo] = isSorted ? [from_coin_info, to_coin_info] : [to_coin_info, from_coin_info];
        const resource = await liquidity_Pool_resouce;
        const fromReserve = isSorted ? d(resource.coin_x_reserve.value) : d(resource.coin_y_reserve.value);

        //console.log(` liquidity_Pool_resouce from : ${fromReserve}`);

        const toReserve = isSorted ? d(resource.coin_y_reserve.value) : d(resource.coin_x_reserve?.value);

        //console.log(` liquidity_Pool_resouce  to : ${ toReserve}`);

        const fee=d(resource.fee);
        setpool_fee((resource.fee*0.1).toString());
        const coinFromDecimals = +sortedFromCoinInfo?.data?.decimals;
        const coinToDecimals = +sortedToCoinInfo?.data?.decimals;
        const amount1 = d(amount);
        if (amount1.comparedTo(0) === 0) {
            throw new Error(`Amount equals zero or undefined`);
        }
        if (interactive === 'to' && toReserve.lessThan(amount1)) {
            throw new Error(`Insufficient funds in Liquidity Pool`);
        }
        let rate;
        //console.log(`step: 1`);
        if (curve === 'Uncorrelated') {
            // console.log(`curve: uncorrelated`);
            // console.log(`amount1: ${amount1}`);
            // console.log(`fromReserve: ${fromReserve}`);
            // console.log(`toReserve: ${toReserve}`);
            // console.log(`fee: ${fee}`);
            rate =
                interactive === 'from' ? getCoinOutWithFees(amount1, fromReserve, toReserve, fee) : getCoinInWithFees(amount1, toReserve, fromReserve, fee);
            //console.log(`rate : ${rate}`);
        }else {
            //console.log(`curve: stable`);
            rate =
                interactive === 'from'
                    ? getCoinsOutWithFeesStable(
                        amount1,
                        fromReserve,
                        toReserve,
                        d(Math.pow(10, coinFromDecimals)),
                        d(Math.pow(10, coinToDecimals)),
                        fee,
                    )
                    : getCoinsInWithFeesStable(
                        amount1,
                        toReserve,
                        fromReserve,
                        d(Math.pow(10, coinToDecimals)),
                        d(Math.pow(10, coinFromDecimals)),
                        fee,
                    );
        }
        return rate.toFixed(0);
    }
   /////Pontem sdk //////
    const [swap_from_coin,setswap_from_coin]=useState<string>('');
    const [swap_to_coin,setswap_to_coin]=useState<string>('');
    const [rate ,setrate]=useState<string>('');
    const [amount ,setamouunt]=useState<string>('');
    const ask = async ()=>{
        try {

            if (swap_from_coin == "APT") {
                if (swap_to_coin == "USDT") {
                    let usdtRate = await calculateRate(TokensMapping.APTOS,TokensMapping.USDT,parseFloat(amount)*10000000,'Uncorrelated',"from",0.5);
                    let a = parseFloat(usdtRate)/100000;
                    setrate(a.toString());
                }
                if(swap_to_coin == "USDC"){
                    let usdtRate = await calculateRate(TokensMapping.APTOS,TokensMapping.USDC,parseFloat(amount)*10000000,'Uncorrelated',"from",0.5);
                    let a = parseFloat(usdtRate)/100000;
                    setrate(a.toString());
                }
            }else if(swap_from_coin == "USDC"){

                if (swap_to_coin == "USDT") {
                    let usdtRate = await calculateRate(TokensMapping.USDC,  "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",parseFloat(amount)*1000000, 'Uncorrelated', "from", 0.5);
                   let b= parseFloat(usdtRate)/1000000;
                     setrate(b.toString());
                }
                if(swap_to_coin == "APT"){
                    let usdtRate = await calculateRate(TokensMapping.USDC, TokensMapping.APTOS, parseFloat(amount)*1000000, 'Uncorrelated', "from", 0.5);
                    let b= parseFloat(usdtRate)/100000000;
                    setrate(b.toString());
                }
            }else{
                if (swap_to_coin == "USDC") {
                    let usdtRate = await calculateRate("0x3c1d4a86594d681ff7e5d5a233965daeabdc6a15fe5672ceeda5260038857183::vcoins::V<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>",  "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",parseFloat(amount)*1000000, 'Uncorrelated', "from", 0.5);
                    setrate(usdtRate)
                }
                if(swap_to_coin == "APT"){
                    let usdtRate = await calculateRate("0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT", '0x1::aptos_coin::AptosCoin', parseFloat(amount)*1000000, 'Uncorrelated', "from", 0.5);
                    setrate(usdtRate)
                }
            }

        }catch (e:any){
            console.log(e);
        }
    }

    useEffect(() => {
        ask()
    },[swap_from_coin,swap_to_coin,amount]);
    return (
        <>

            <div
                style={{
                    padding: 50,
                    minHeight: 400,
                    minWidth: 100,
                    background: "#EBE5DF",
                    borderRadius: borderRadiusLG,
                    textAlign: 'center',
                }}
            >
                <HappyProvider>
                    <Button type="primary" onClick={goBack}
                            style={{height: 20, width: 50, background: "#f1eddd", color: "black" ,left:-310}}>Back</Button>
                </HappyProvider>
                <Segmented size="large" options={[
                    {
                        label: (
                            <div className="swap_page_Select_box">
                                <Avatar src={logo_pontem}/>
                                <div>Pontem</div>
                            </div>
                        ),
                        value: 'user2',

                    },
                    {
                        label: (
                            <div className="swap_page_Select_box">
                                <Avatar src={logo_aries}/>
                                <div>Aries</div>
                            </div>
                        ),
                        value: 'user3',
                        // disabled: true,
                    },

                    {
                        label: (
                            <div className="swap_page_Select_box">
                                <Avatar src={logo_pancake}/>
                                <div>Pancake</div>
                            </div>
                        ),
                        value: 'user4',
                        // disabled: true,
                    }, {
                        label: (
                            <div className="swap_page_Select_box">
                                <Avatar src={logo_panora}/>
                                <div>Panora</div>
                            </div>
                        ),
                        value: 'user5',
                        // disabled: true,
                    },
                    {
                        label: (
                            <div className="swap_page_Select_box">
                                <Avatar src={logo_cellena}/>
                                <div>Cellena</div>
                            </div>
                        ),
                        value: 'user6',
                        // disabled: true,
                    },
                ]}>
                </Segmented>
                <br/>
                <br/>
                <Row>

                    <Input size="large" placeholder="from" prefix={<UserOutlined/>} onChange={value => {
                        setamouunt(value.target.value)
                    }}/>
                    <br/>
                    <Select
                        showSearch
                        placeholder="Which coin"
                        optionFilterProp="children"
                        onChange={value => {
                            setswap_from_coin(value)
                            console.log(`selected ${value}`);
                        }}
                        filterOption={filterOption}
                        style={{minWidth: 100}}
                        options={[
                            {
                                value: 'APT',
                                label: 'APT',
                            },
                            {
                                value: 'USDC',
                                label: 'USDC',
                            },
                            {
                                value: 'USDT',
                                label: 'USDT',
                            },
                        ]}
                    />
                </Row>
                <br/>
                <br/>

                <Row>
                    {swap_from_coin == swap_to_coin &&
                        <Input disabled={true} size="large" placeholder="to" prefix={<UserOutlined/>} value={1}/>
                    }
                    {swap_from_coin != swap_to_coin &&
                        <Input disabled={true} size="large" placeholder="to" prefix={<UserOutlined/>} value={rate}/>
                    }
                    <br/>
                    <Select
                        showSearch
                        placeholder="Which coin"
                        optionFilterProp="children"
                        onChange={value => {

                            setswap_to_coin(value)
                            console.log(`select to  ${value}`);
                        }}
                        filterOption={filterOption}
                        style={{minWidth: 100}}
                        options={[
                            {
                                value: 'APT',
                                label: 'APT',
                            },
                            {
                                value: 'USDC',
                                label: 'USDC',
                            },
                            {
                                value: 'USDT',
                                label: 'USDT',
                            },
                        ]}
                    />

                </Row>

                <HappyProvider>
                    <Button type="primary" onClick={create_swap}
                            style={{height: 50, width: 190, background: "#f1eddd", color: "black"}}>Swap</Button>
                </HappyProvider>

                {/*from :{swap_from_coin}<br/>*/}
                {/*to :{swap_to_coin}<br/>*/}
                {/*rate :{rate}<br/>*/}
                {/*amount :{amount}<br/>*/}
                {/*<button onClick={ask_price}>ask</button>*/}
            </div>
        </>
    );
}

export default Swap_box;