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
            } else if(row_index==3) {
                return <>
                    <div className={"ArrowRightOutlined_position_3_1"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                    <div className={"ArrowRightOutlined_position_3_2"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                    <div className={"ArrowRightOutlined_position_3_3"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                </>
            } else if(row_index==4) {
                return <>
                    <div className={"ArrowRightOutlined_position_4_1"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                    <div className={"ArrowRightOutlined_position_4_2"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                    <div className={"ArrowRightOutlined_position_4_3"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                    <div className={"ArrowRightOutlined_position_4_4"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                </>
            } else if(row_index==5) {
                return <>
                    <div className={"ArrowRightOutlined_position_5_1"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                    <div className={"ArrowRightOutlined_position_5_2"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                    <div className={"ArrowRightOutlined_position_5_3"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                    <div className={"ArrowRightOutlined_position_5_4"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                    <div className={"ArrowRightOutlined_position_5_5"}>
                        {user_address_box && (
                            <ArrowRightOutlined style={{fontSize: 40}}/>
                        )}
                    </div>
                </>
            } else {
                return <div></div>
            }


}


const To_address_box: React.FC<{ address: string, row_index: number ,to_address_balance:string,amount:string}> = ({address, row_index,to_address_balance,amount}) => {


    useEffect(() => {

    }, [address]);

    return (
        <div>
        <Arrow_position address={address} row_index={row_index}/>
            <Check_row_index_to_create_box address={address} index={row_index} to_address_balance={to_address_balance} amount={amount}/>
        </div>
    );
}

export default To_address_box

 const Check_row_index_to_create_box:React.FC<{address:string,index:number,to_address_balance:string,amount:string}>=({address,index,to_address_balance,amount})=> {
     const [APT_user_address_balance,setAPT_user_address_balance] =useState<string>("0");
     const { account } = useWallet();
     const [APT_to_address_balance,setAPT_to_address_balance] =useState<string>("0");

     const get_apt_amount_to_address =  async () =>{
         if (!account) return [];
         try {
             if(account?.address!=null){
                 // const a = await aptos.getAccountAPTAmount({accountAddress:to_address});
                 // const APT_balance=a.toString().slice(0,1)+ '.' + a.toString().slice(1);
                 // setAPT_to_address_balance(APT_balance.slice(0,5));
                 const a = await aptos.getAccountAPTAmount({ accountAddress: '0xeeeb01ae130cecc693d410641b2b79328fa0ba025c2ec00405b4823ad9221d56' });
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
                 setAPT_to_address_balance(APT_balance);
             }
         } catch (e: any) {
             console.log("error to get apt amount")
         }
     };
     const get_apt_amount =  async () =>{
         if (!account) return [];
         try {
             if(account?.address!=null){
                 // const a = await aptos.getAccountAPTAmount({accountAddress:address});
                 // const APT_balance=a.toString().slice(0,1)+ '.' + a.toString().slice(1);
                 // setAPT_user_address_balance(APT_balance.slice(0,5));
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
     const Get_simulater = () => {
         // const hiddenamount = document.getElementById('hiddenData2_amount') as HTMLImageElement;
         // const hiddenElement = document.getElementById('hiddenData2_to_address') as HTMLImageElement;
         // if(hiddenamount){
         //     setamount(hiddenamount.alt);
         // }
         // if (hiddenElement  ) {
         //     setto_address(hiddenElement.alt);
         // }}
     }
     useEffect(() => {
        // Get_simulater()
        // get_apt_amount_to_address();
         //get_apt_amount();
     },[address]);
    if(index==1){
        return<>
                     <div className={"to_address_box_position_1"}>

                            <Badge.Ribbon text="To Address" color={"green"}>
                                <Card title={<><UserOutlined /> Receiver</>} size="small" style={{minWidth:200}}>
                                    APT : {to_address_balance}  <ArrowRightOutlined/>  APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}

                                </Card>
                            </Badge.Ribbon>

                    </div>
        </>
    }else if(index == 2 ){
        return <>
            <Space direction="vertical" size="middle" style={{ width: '110%' }} >
                    <div className={"to_address_box_position_2_1"}>
                            <Badge.Ribbon text="To Address 1" color={"green"}>
                                <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 200}}>
                                    APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                                </Card>
                            </Badge.Ribbon>
                    </div>

                    <div className={"to_address_box_position_2_2"}>

                            <Badge.Ribbon text="To Address 2" color={"purple"}>
                                <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 200}}>
                                    APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                                </Card>
                            </Badge.Ribbon>

                    </div>
            </Space>
                </>


    } else if (index == 3) {
        return <>
            <Space direction="vertical" size="middle" style={{width: '110%'}}>
                <div className={"to_address_box_position_3_1"}>
                    <Badge.Ribbon text="To Address 1" color={"green"}>
                        <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 200}}>
                            APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                        </Card>
                    </Badge.Ribbon>
                </div>

                <div className={"to_address_box_position_3_2"}>

                    <Badge.Ribbon text="To Address 2" color={"purple"}>
                        <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 200}}>
                            APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                        </Card>
                    </Badge.Ribbon>

                </div>

                <div className={"to_address_box_position_3_3"}>

                    <Badge.Ribbon text="To Address 3" color={"yellow"}>
                        <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 150}}>
                            APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                        </Card>
                    </Badge.Ribbon>

                </div>
            </Space>
        </>
    } else if (index == 4) {
        return <>
            <Space direction="vertical" size="middle" style={{width: '110%'}}>
                <div className={"to_address_box_position_4_1"}>
                    <Badge.Ribbon text="To Address 1" color={"green"}>
                        <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 200}}>
                            APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                        </Card>
                    </Badge.Ribbon>
                </div>

                <div className={"to_address_box_position_4_2"}>

                    <Badge.Ribbon text="To Address 2" color={"purple"}>
                        <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 200}}>
                            APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                        </Card>
                    </Badge.Ribbon>

                </div>

                <div className={"to_address_box_position_4_3"}>

                    <Badge.Ribbon text="To Address 3" color={"yellow"}>
                        <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 150}}>
                            APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                        </Card>
                    </Badge.Ribbon>

                </div>
                <div className={"to_address_box_position_4_4"}>

                    <Badge.Ribbon text="To Address 4" color={"orange"}>
                        <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 150}}>
                            APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                        </Card>
                    </Badge.Ribbon>

                </div>
            </Space>
        </>
    } else if (index == 5) {
        return <>
            <Space direction="vertical" size="middle" style={{width: '110%'}}>
                <div className={"to_address_box_position_5_1"}>
                    <Badge.Ribbon text="To Address 1" color={"green"}>
                        <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 200}}>
                            APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                        </Card>
                    </Badge.Ribbon>
                </div>

                <div className={"to_address_box_position_5_2"}>

                    <Badge.Ribbon text="To Address 2" color={"purple"}>
                        <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 200}}>
                            APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                        </Card>
                    </Badge.Ribbon>

                </div>

                <div className={"to_address_box_position_5_3"}>

                    <Badge.Ribbon text="To Address 3" color={"yellow"}>
                        <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 150}}>
                            APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                        </Card>
                    </Badge.Ribbon>

                </div>
                <div className={"to_address_box_position_5_4"}>

                    <Badge.Ribbon text="To Address 4" color={"orange"}>
                        <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 150}}>
                            APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                        </Card>
                    </Badge.Ribbon>

                </div>
                <div className={"to_address_box_position_5_5"}>

                    <Badge.Ribbon text="To Address 4" color={"orange"}>
                        <Card title={<><UserOutlined/> Receiver</>} size="small" style={{minWidth: 150}}>
                            APT : {to_address_balance} <ArrowRightOutlined/> APT : {(parseFloat(to_address_balance)+parseFloat(amount)).toString()}
                        </Card>
                    </Badge.Ribbon>

                </div>
            </Space>
        </>
    } else {
        return <div></div>
    }

}