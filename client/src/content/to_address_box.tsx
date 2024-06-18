import React, {useEffect, useState} from 'react';
import "../css_folder/heardbar.css"
import {Badge, Card, Col, ConfigProvider, Layout, Row, Space, theme} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {ArrowRightOutlined, UserOutlined} from "@ant-design/icons";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import "../css_folder/Content.css"

const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);

const Arrow_position:React.FC<{ address:string,row_index:number}> =({address,row_index})=>{
    const [user_address_box,setuser_address_box]=useState<boolean>(false);
    useEffect(() => {
        if(address != "User address"){setuser_address_box(true)}
    },[address,row_index]);

            if(row_index==1){
                return <div className={"ArrowRightOutlined_position_1"}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }} >
                    {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                       )}
                    </Space>
                </div>
            }else if(row_index==2) {
                return <>
                    <div className={"ArrowRightOutlined_position_2_1"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                    <div className={"ArrowRightOutlined_position_2_2"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                </>
            } else {
                return <div></div>
            }


}


const To_address_box: React.FC<{ address: string, row_index: number }> = ({address, row_index}) => {

    useEffect(() => {

    }, [address]);

    return (
        <div>
        <Arrow_position address={address} row_index={row_index}/>
            <Check_row_index_to_create_box address={address} index={row_index} />
        </div>
    );
}

export default To_address_box

 const Check_row_index_to_create_box:React.FC<{address:string,index:number}>=({address,index})=> {
     const [APT_user_address_balance,setAPT_user_address_balance] =useState<string>("0");
     const { account } = useWallet();
     const get_apt_amount =  async () =>{
         if (!account) return [];
         try {
             if(account?.address!=null){
                 const a = await aptos.getAccountAPTAmount({accountAddress:address});
                 const APT_balance=a.toString().slice(0,1)+ '.' + a.toString().slice(1);
                 setAPT_user_address_balance(APT_balance.slice(0,5));
             }
         } catch (e: any) {
             console.log("error to get apt amount")
         }
     };
     useEffect(() => {
         get_apt_amount();
     },[address]);
    if(index==1){
        return <div className={"to_address_box_position_1"}>
                    <Space direction="vertical" size="middle" style={{ width: '110%' }} >
                        <Badge.Ribbon text="To Address" color={"green"}>
                            <Card title={<><UserOutlined /> Receiver</>} size="small" style={{minWidth:150}}>
                                APT : {APT_user_address_balance}  <ArrowRightOutlined/>  APT : {APT_user_address_balance}
                            </Card>
                        </Badge.Ribbon>
                    </Space>
                </div>
    }else if(index == 2 ){
        return <>
            <Space direction="vertical" size="middle" style={{ width: '110%' }} >
                    <div className={"to_address_box_position_2_1"}>
                            <Badge.Ribbon text="To Address 1" color={"green"}>
                                <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 150}}>
                                    APT : {APT_user_address_balance} <ArrowRightOutlined/> APT : {APT_user_address_balance}
                                </Card>
                            </Badge.Ribbon>
                    </div>

                    <div className={"to_address_box_position_2_2"}>

                            <Badge.Ribbon text="To Address 2" color={"purple"}>
                                <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 150}}>
                                    APT : {APT_user_address_balance} <ArrowRightOutlined/> APT : {APT_user_address_balance}
                                </Card>
                            </Badge.Ribbon>

                    </div>
            </Space>
                </>


    } else if (index == 3) {
        return <div></div>
    } else if (index == 4) {
        return <div></div>
    } else if (index == 5) {
        return <div></div>
    } else {
        return <div></div>
    }
 }