import React, {useEffect, useState} from 'react';
import SDK from "@pontem/liquidswap-sdk";
import { AptosAccount, CoinClient, FaucetClient } from 'aptos';
import { NODE_URL, TokensMapping, MODULES_ACCOUNT, RESOURCE_ACCOUNT, FAUCET_URL, NETWORKS_MAPPING } from "./common";
import {message} from "antd";
import {Buffer} from "buffer";
import Decimal from 'decimal.js';
import {d} from "@pontem/liquidswap-sdk/dist/tsc/utils";
import {dStable, f, lp_value} from "@pontem/liquidswap-sdk/dist/tsc/utils/swap-math";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";


type TxPayloadCallFunction = {
    type: 'entry_function_payload';
    function: string;
    type_arguments: string[];
    arguments: string[];
};
const aptosConfig = new AptosConfig({ network: Network.MAINNET});
const aptos = new Aptos(aptosConfig);

const Swap_box:React.FC<{ }> = ({ }) => {
    const [pool_fee,setpool_fee]=useState<string>('');
    const DENOMINATOR = new Decimal(10000);
    const e8 = new Decimal('100000000');
    const sdk = new SDK({
        nodeUrl: "https://api.mainnet.aptoslabs.com/v1",
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
            message.success(`Price:${usdtRate}`)
            console.log('SsdtRate: ', usdtRate);
        }catch (e:any){
            console.log("error",e);
            message.error(`error:${e}`)
        }
    }
    /////Pontem sdk //////
    const extractAddressFromType=(type: string) =>{
        return type.split('::')[0];

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





    return (
        <>
            <button onClick={ask_price}>ask </button>
        </>
    );
}

export default Swap_box;