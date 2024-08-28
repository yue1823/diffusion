import React, {useEffect, useState} from 'react';
import "../css_folder/heardbar.css"
import { Col, message,  Row, Space, theme} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import User_address_box from "./user_address_box";
import Resource_address_box from "./resource_address_box";
import {ArrowRightOutlined, ReloadOutlined} from "@ant-design/icons";
import "../css_folder/Content.css"
import To_address_box from "./to_address_box";
import "../css_folder/Content.css"
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

const Show_content:React.FC<{ address:string,index_of_address:number}> = ({ address}) =>  {
    const [user_address_box,setuser_address_box]=useState<boolean>(false);
    const [sharedData, setSharedData] = useState<number | null>(null);
    const [to_address,setto_address]=useState<string>('');
    const [amount_of_address, setamount_of_address] =useState<string>('');
    const [rotated, setRotated] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
        const Get_simulater = async () => {
            try{
                    setRotated(true);
                    setTimeout(() => {
                        setRotated(false);
                    }, 1000);
                    const hiddenElement = document.getElementById('hiddenData') as HTMLImageElement;
                    const hidden_amount = document.getElementById('hiddenData2_amount') as HTMLImageElement;
                    const hiddenElement_to_address = document.getElementById('hiddenData2_to_address') as HTMLImageElement;
                    if (hidden_amount) {
                        setamount_of_address(hidden_amount.alt);
                    }
                    if (hiddenElement_to_address) {
                        const a = await aptos.getAccountAPTAmount({accountAddress: hiddenElement_to_address.alt});
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
                        setto_address(APT_balance);
                    }
                    if (hiddenElement) {
                        setSharedData(parseInt(hiddenElement.alt, 10));
                    }
            }catch (error:any){
                message.error("Wrong address");
            }
        }

    const check_shared_not_null=()=>{
        if(sharedData != null){
            return <To_address_box address={address} row_index={sharedData} to_address_balance={to_address} amount={amount_of_address}/>
        }else{console.log(sharedData)}
    }




    useEffect(() => {
        if(address != "User address"){setuser_address_box(true)}
        //Get_simulater()
    },[address,sharedData]);
    return (
        <div
            style={{
                padding: 24,
                minHeight: 400,
                minWidth: 820,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
        >


            {user_address_box && (
                <div className={`Reload_logo`}><ReloadOutlined style={{fontSize: 30, height: 30}} spin={rotated} onClick={Get_simulater}/> </div>
            )}
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

            <Space direction="vertical" size="middle" style={{width: '110%'}}>
                <Row gutter={[48, 1024]}>
                    <Col>
                        {user_address_box && (
                            <User_address_box address={address}/>
                        )}
                    </Col>
                    {user_address_box && (
                        <div className={"original_arrrow"}><ArrowRightOutlined style={{fontSize: 40}}/>
                        </div>
                    )}
                    <Col>
                        {user_address_box && (
                            <Resource_address_box address={address}/>
                        )}

                    </Col>
                    <Col>
                        {user_address_box && (

                            check_shared_not_null()

                        )}
                    </Col>
                </Row>


            </Space>


        </div>
    );
}

export default Show_content