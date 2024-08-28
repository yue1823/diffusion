import React, { useEffect, useState} from 'react';
import "../css_folder/heardbar.css"
import { HappyProvider } from '@ant-design/happy-work-theme';
import Apt_logo from "../art/Aptos_mark_BLK.svg"
import {

    Button,
    Col,
  Drawer,
    Input,
     List, message,

     Popover,
    Row,
    Select,
    Steps,
    Switch,
    theme,

} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import 'react-toastify/dist/ReactToastify.css';
import {
    CheckOutlined,
    CloseOutlined, InfoCircleOutlined,
    ShareAltOutlined, UserAddOutlined, UserDeleteOutlined,
    UserOutlined
} from "@ant-design/icons";

import {
    useWallet,
    InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

const moduleAddress = "0xd3d2a6b4340d87ea390368ddcab692cf4b330c86fb5daaa2609e1052c20ca873";




const Select_content:React.FC<{ address:string,index_of_address:number}> = ({ address}) => {
    const { account, signAndSubmitTransaction } = useWallet();
    const [rows, setRows] = useState<number[]>([0]);
    const [steps,set_steps] = useState(0);

    const [amount,setamount]=useState<number>(0);
    const [cointype,setcointypr] = useState<string>("")
    const longAddressPattern = /^0x[a-fA-F0-9]{64}$/; // 長地址模式
    const shortAddressPattern = /^0x[a-fA-F0-9]{1,63}$/;
    const [open, setOpen] = useState(false);
    const [loadings] = useState<boolean[]>([]);

    const submit_transaction = async()=>{
        if (!account) return [];

        if(cointype=='APT'){
            let input1 = "0x1::aptos_coin::AptosCoin"
            let input2 = "0x1::aptos_coin::AptosCoin"
            const transaction:InputTransactionData = {
                data: {
                    function:`${moduleAddress}::helper::reload_single`,
                    typeArguments:[input1,input2],
                    functionArguments:[false,need_garble,amount*100000000,to_address,cointype,"0x1",amount*100000000]
                }
            }
            try {
                // sign and submit transaction to chain
                const response = await signAndSubmitTransaction(transaction);
                // wait for transaction
                const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
                const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;


                message.success(
                    <span>
                        hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                    </span>
                    )

            } catch (error: any) {
                message.error(`please try again`)
            } finally {

            }
        }
    }
    const data = [
        {label: 'Diffusion fees charge',value:0.1},
        {label: 'Expected transfer ',value:amount},

    ];
    const totalCost = data.reduce((sum, item) => sum + Number(item.value), 0);
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };



    const onSearch = (value: string) => {
        console.log('search:', value);
    };


    // Filter `option.label` match the user type `input`
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    ////////////////////////////////

    //button
    //happy work button
    const check_everything=()=>{
        if(steps==4){
            //amount cointype to_address need_garble
            if(longAddressPattern.test(to_address) || shortAddressPattern.test(to_address)){
                submit_transaction();
            }else{
                message.error('To address not true.')
            }
        }else{
            showDrawer()
        }
    }

    ////////////////////////////////
    const [need_garble , setneed_garble]=useState<boolean>(false)
    const [to_address,setto_address]=useState<string>("")
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const addRow = () => {
        //setRows((prevRows) => [...prevRows, prevRows.length]);
        setRows((prevRows) => {if (prevRows.length < 5) {
            return [...prevRows, prevRows.length];
        } else {
            return prevRows; // 不添加新行
        }})
    };
    const removeRow = () => {
        setRows((prevRows) => {
            if (prevRows.length > 1) {
                return prevRows.slice(0, -1);
            }
            return prevRows;
        });
    };
    const check_Coin_disable = ():boolean =>{
        return steps < 3;
    }
    const check_amount_disable = ():boolean =>{
        return steps < 2;
    }

    useEffect(() => {
        if(steps<1){set_steps(1)}

    },[to_address]);
    return (
        <div
            style={{
                padding: 20,
                minHeight: 400,
                minWidth: 470,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                position: "relative",
                left: 30,
            }}
        >

            <Row gutter={[16, 16]}>
                <Col><ShareAltOutlined style={{fontSize: 25}}/></Col>
                <Col style={{fontSize: 25}}>
                    Garble
                </Col>
                <Col style={{fontSize: 25}}>
                    <Switch
                        checkedChildren={<CheckOutlined/>}
                        unCheckedChildren={<CloseOutlined/>}
                        defaultChecked={false}
                        onChange={value => setneed_garble(value)}
                    />
                    &nbsp;
                    &nbsp;
                    <Popover content={<div><p>prevent coercion</p></div>} title="Garble">
                        <InfoCircleOutlined style={{fontSize: 20,top:10}}/>
                    </Popover>
                </Col>
                <Col>

                </Col>

            </Row>
            <br/>
            <Row>
                <Input placeholder="User address" prefix={<UserOutlined/>} disabled={true} value={address}/>
            </Row>
            <br/>
            <Row>Address</Row>
            {rows.map((_row, index) => (
                <Row key={index}>
                    <Input placeholder="To address" prefix={<UserOutlined/>} onChange={address => {
                        setto_address(address.target.value);
                        if (steps < 2) {
                            set_steps(2)
                        }
                    }} value={to_address}/>
                </Row>

            ))}
            <Row>
                <Button
                    type="primary"
                    icon={<UserAddOutlined/>}
                    loading={loadings[2]}
                    onClick={() => {
                        addRow()
                    }}
                />
                <Button
                    type="primary"
                    icon={<UserDeleteOutlined/>}
                    style={{left: 365}}
                    loading={loadings[2]}
                    onClick={() => {
                        removeRow()
                    }}
                />
            </Row>
            <br/>
            <Row>
                <Select
                    showSearch
                    disabled={check_amount_disable()}
                    placeholder="How much"
                    optionFilterProp="children"
                    onChange={value => {
                        if (steps < 3) {
                            set_steps(3)
                        }
                        ;
                        setamount(value as number);
                        console.log(`selected ${value}`);
                    }}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    style={{minWidth: 100}}
                    options={[
                        {
                            value: '1',
                            label: '1',
                        },
                        {
                            value: '5',
                            label: '5',
                        },
                        {
                            value: '10',
                            label: '10',
                        },
                    ]}
                />
                <Select
                    showSearch
                    disabled={check_Coin_disable()}
                    placeholder="Which coin"
                    optionFilterProp="children"
                    onChange={value => {
                        if (steps < 4) {
                            set_steps(4)
                        }
                        ;
                        setcointypr(value as string);
                        console.log(`selected ${value}`);
                    }}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    style={{minWidth: 100, left: 207}}
                    options={[
                        {
                            value: 'APT',
                            label: 'APT',
                        },
                        {
                            value: 'USDC',
                            label: 'USDC',
                            disabled: true,
                        },
                        {
                            value: 'USDT',
                            label: 'USDT',
                            disabled: true,
                        },
                    ]}
                />
            </Row>
            <br/>
            <Row>
                <Steps
                    current={steps}
                    direction="vertical"
                    items={[
                        {
                            title: 'Connect Wallet',
                        },
                        {
                            title: 'Set to address',
                        },
                        {
                            title: 'Set how much ',
                        },
                        {
                            title: 'Set which coin',
                        },
                    ]}
                />
            </Row>
            <br/>
                {(steps==4) && (

                    <Row>
                        <List

                            size={"small"}
                            style={{width:420}}
                            header={<div>Fees (APT) <span style={{float: 'right' ,width:20,height:20}}><img alt={"apt_logo"} src={Apt_logo}></img></span></div>}
                            footer={<div>Total cost: <span style={{float: 'right'}}>{totalCost}</span></div>}
                            bordered
                            dataSource={data}
                            renderItem={(item) => (
                                <List.Item>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <span>{item.label}</span>
                                        {item.value}
                                    </div>
                                </List.Item>
                            )}
                        />

                    </Row>
                 )}
            <br/>
            <Row>

                <HappyProvider>
                    <Button type="primary" onClick={check_everything}
                            style={{height: 50, width: 190, background: "#f1eddd", color: "black"}}>Safe
                        Transfer</Button>
                </HappyProvider>

                <Drawer title="Check Input" onClose={onClose} open={open}>
                    <Steps
                        direction="vertical"
                        current={steps}
                        status="error"
                        items={[
                            {
                                title: 'Connect Wallet',

                            },
                            {
                                title: 'Set to address',

                            },
                            {
                                title: 'Set how much',

                            },
                            {
                                title: 'Set which coin',

                            },
                        ]}
                    />
                </Drawer>

            </Row>

            <img id="hiddenData" alt={`${rows.length}`} style={{display: 'none'}}/>
            <img id="hiddenData2_to_address" alt={`${to_address}`} style={{display: 'none'}}/>
            <img id="hiddenData2_amount" alt={`${amount}`} style={{display: 'none'}}/>

        </div>
    );
}



export default Select_content