import React, {useEffect, useState} from 'react';
import "../css_folder/heardbar.css"
import {Badge, Card, Col, ConfigProvider, Layout, Row, Space, theme} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {UserOutlined} from "@ant-design/icons";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
import {useWallet} from "@aptos-labs/wallet-adapter-react";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

const User_address_box:React.FC<{ address:string}> = ({ address}) =>  {
    const [user_address_box,setuser_address_box]=useState<boolean>(false);
    const [APT_user_address_balance,setAPT_user_address_balance] =useState<string>("0");

    const { account } = useWallet();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const get_apt_amount =  async () =>{
        if (!account) return [];
        try {
            if(account?.address!=null){
                // const a = await aptos.getAccountAPTAmount({accountAddress:address});
                //                 // const APT_balance=a.toString().slice(0,1)+ '.' + a.toString().slice(1);
                //                 // setAPT_user_address_balance(APT_balance.slice(0,5));
                const a = await aptos.getAccountAPTAmount({ accountAddress: address });

                // 将数值转换为字符串
                const aStr = a.toString();

                // 获取长度
                const len = aStr.length;

                // 处理余额，确保小数点位置正确
                let APT_balance;
                if (len > 8) {
                    // 长度大于8，插入小数点
                    APT_balance = aStr.slice(0, len - 8) + '.' + aStr.slice(len - 8);
                } else {
                    // 长度小于或等于8，在前面补零并插入小数点
                    APT_balance = '0.' + '0'.repeat(8 - len) + aStr;
                }

                // 保留8位小数
                APT_balance = APT_balance.slice(0, APT_balance.indexOf('.') + 5);

                // 更新余额显示
                setAPT_user_address_balance(APT_balance);
            }
        } catch (e: any) {
            console.log("error to get apt amount")
        }
    };
    useEffect(() => {
        get_apt_amount();
        setuser_address_box(true);
    },[address]);
    return (
        <div>

                <Badge.Ribbon text="User Address">
                    <Card title={<><UserOutlined /> User</>} size="small" style={{minWidth:170}}>
                        APT : {APT_user_address_balance}
                    </Card>
                </Badge.Ribbon>

        </div>
    );
}

export default User_address_box