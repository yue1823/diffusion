
import {Button,  Col, Drawer, Input, message, Row, theme} from "antd";
import React, {useEffect, useState} from 'react';

import {Content} from "antd/lib/layout/layout";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";

import "../css_/rainbow_button.css";
import {Bounce, toast, ToastContainer} from "react-toastify";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

const module_address="0xd3d2a6b4340d87ea390368ddcab692cf4b330c86fb5daaa2609e1052c20ca873";

const Admin_page:React.FC<{ }> = ({ }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>
            <Content style={{padding: '15px 30px'}}>
                <Row gutter={[36,12]}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 600,
                            minWidth: 1200,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Col span={12}>
                            <Create_pair_button/>
                        </Col>
                        <br/>
                        <Col span={12}>
                            <Upload_result_button />
                        </Col>
                        <br/>
                        <Col span={12}>
                            <Create_helper/>
                        </Col>
                        <br/>
                        <Col span={12}>
                            <Admin_like/>
                        </Col>
                        <br/>
                        <Col span={12}>
                            <Set_chance/>
                        </Col>
                        <br/>
                        <Col span={12}>
                            <Time_to_stop_bet/>
                        </Col>
                        <ToastContainer
                            position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                    </div>
                </Row>
            </Content>
        </>
    );
}

const  Create_pair_button:React.FC<{ }> = ({}) => {
    const [open , set_open] = useState<boolean>(false);
    const button_click = () =>{
        set_open(true)
    }
    const button_close = () =>{
        set_open(false)
    }

    const { account, signAndSubmitTransaction } =useWallet() ;
    const [pair_name,setpair_name]=useState('');
    const [left1,setleft1]=useState('');
    const [left2,setleft2]=useState('');
    const [middle1,setmiddle1]=useState('');
    const [middle2,setmiddle2]=useState('');
    const [right1,setright1]=useState('');
    const [right2,setright2]=useState('');
    const [time,settime]=useState('');
    const [pairtype,setpairtype]=useState('');
    const [input1,setinput1]=useState('');
    const [input2,setinput2]=useState('');



    const submit_transaction = async () => {
        const transaction: InputTransactionData = {
            data: {
                function: `${module_address}::helper::create_pair`,
                functionArguments: [pair_name,left1,left2,middle1,middle2,right1,right2,time,pairtype,input1,input2]
            }
        }
        const datePattern = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])\d{4}$/;
        if (!datePattern.test(time)) {
            message.error("无效的日期。");
            throw new Error("日期格式不正确。应为 ddmmyyyy 格式，并且日期必须有效。");
        }
        const day = parseInt(time.slice(0, 2), 10);
        const month = parseInt(time.slice(2, 4), 10);
        const year = parseInt(time.slice(4, 8), 10);
        const isValidDate = (d: number, m: number, y: number): boolean => {
            const leapYear = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
            const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            return m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth[m - 1];
        };
        if (!isValidDate(day, month, year)) {
            message.error("无效的日期。");
            throw new Error("无效的日期。");
        }else {

            try {
                // sign and submit transaction to chain
                const response = await signAndSubmitTransaction(transaction);
                // wait for transaction
                const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
                const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;
                // message.success(
                //
                // )
                toast.success(<span>
                        hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                    </span>, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                // setinput1("")
                // setinput2("")
                // setpair_name("")
                // settime("")
                // setpairtype("")
                // setleft1("")
                // setmiddle1("")
                // setright1("")
            } catch (error: any) {
                console.log(error);
                message.error(`please try again`);
            } finally {


            }
        }
    }
    useEffect(() => {


        //fetch_pair_resources()
        },[account])
    return (
        <>
            <Button title={"Create_pair"} style={{height:70,width:200}} onClick={button_click}>
                Create pair
            </Button>

            <Drawer open={open} onClose={button_close} style={{width: 1000}} title={"Create_pair"}>
                <Row gutter={[8,24]}>

                        <Col span={24}>
                            <Input placeholder="pair_name" onChange={value => {
                                setpair_name(value.target.value)
                            }}></Input>
                        </Col>


                        <Col span={24}>
                            <Input placeholder="left1" onChange={value => {
                                setleft1(value.target.value)
                            }}></Input>
                        </Col>


                        <Col span={24}>
                            <Input placeholder="left2" onChange={value => {
                                setleft2(value.target.value)
                            }}></Input>
                        </Col>



                        <Col span={24}>
                            <Input placeholder="middle1" onChange={value => {
                                setmiddle1(value.target.value)
                            }}></Input>
                        </Col>


                        <Col span={24}>
                            <Input placeholder="middle2" onChange={value => {
                                setmiddle2(value.target.value)
                            }}></Input>
                        </Col>


                        <Col span={24}>
                            <Input placeholder="right1" onChange={value => {
                                setright1(value.target.value)
                            }}></Input>
                        </Col>


                        <Col span={24}>
                            <Input placeholder="right2" onChange={value => {
                                setright2(value.target.value)
                            }}></Input>
                        </Col>

                        <Col span={24}>
                            <Input placeholder="time (dd/mm/yyyy)" onChange={value => {
                                settime(value.target.value)
                            }}></Input>
                        </Col>


                        <Col span={24}>
                            <Input placeholder="pairtype (unexpected/game/sport)" onChange={value => {

                                setpairtype(value.target.value)
                            }}></Input>
                        </Col>
                    <Col span={24}>

                        <button onClick={() => {
                            setinput1('')
                        }}><img src={input1} style={{height: 100, width: 100}}></img></button>
                        <Input placeholder="left url" onChange={value => {
                            setinput1(value.target.value)
                        }}></Input>
                    </Col>
                    <Col span={24}>

                        <button onClick={() => {
                            setinput2('')
                        }}><img src={input2} style={{height: 100, width: 100}}></img></button>
                        <Input placeholder="right url" onChange={value => {
                            setinput2(value.target.value)
                        }}></Input>
                    </Col>
                    <Col span={24}>

                    <button className={"rainbow"} onClick={() => submit_transaction()}>
                                create pair
                            </button>
                        </Col>

                </Row>
            </Drawer>
        </>
    );
}

const Upload_result_button: React.FC<{ }> = ({}) => {
    const [open , set_open] = useState<boolean>(false);
    const button_click = () =>{
        set_open(true)
    }
    const button_close = () =>{
        set_open(false)
    }

    const { account, signAndSubmitTransaction } =useWallet() ;
    const [pairname,setpairname]=useState('');
    const [result1,setresult1]=useState('');
    const [result2,setresult2]=useState('');
    const [expired_time,set_expired_time]=useState('');



    const submit_transaction = async () => {
        const transaction: InputTransactionData = {
            data: {
                function: `${module_address}::helper::upload_result`,
                functionArguments: [pairname,result1,result2,expired_time]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;
            // message.success(
            //
            // )
            toast.success(<span>
                        hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                    </span>, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

        } catch (error: any) {
            console.log(error);
            message.error(`please try again`);
        } finally {


        }
    }
    useEffect(() => {

        //fetch_pair_resources()
    },[account])
    return (
        <>
            <Button title={"Create_pair"} style={{height:70,width:200}} onClick={button_click}>
                upload result
            </Button>

            <Drawer open={open} onClose={button_close} style={{width: 1000}} title={"Create_pair"}>
                <Row gutter={[8,24]}>

                    <Col span={24}>
                        <Input placeholder="pairname" onChange={value => {
                            setpairname(value.target.value)
                        }}></Input>
                    </Col>


                    <Col span={24}>
                        <Input placeholder="result1" onChange={value => {
                            setresult1(value.target.value)
                        }}></Input>
                    </Col>
                    <Col span={24}>
                        <Input placeholder="result2" onChange={value => {
                            setresult2(value.target.value)

                        }}></Input>
                    </Col>
                    <Col span={24}>
                        <Input placeholder="expired_time" onChange={value => {
                            set_expired_time(value.target.value)

                        }}></Input>
                    </Col>
                    <br/>
                    <Col span={24}>
                        <button className={"rainbow"} onClick={() => submit_transaction()}>
                            admin upload result
                        </button>
                    </Col>

                </Row>
            </Drawer>
        </>
    );
}
const Create_helper: React.FC<{}> = ({ }) => {
    const [open , set_open] = useState<boolean>(false);
    const button_click = () =>{
        set_open(true)
    }
    const button_close = () =>{
        set_open(false)
    }

    const { account, signAndSubmitTransaction } =useWallet() ;
    const [helper_address,sethelper_address]=useState('');
    const [add_or_delete,setadd_or_delete]=useState('');




    const submit_transaction = async () => {
        const transaction: InputTransactionData = {
            data: {
                function: `${module_address}::helper::create_helper`,
                functionArguments: [add_or_delete,helper_address]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;
            // message.success(
            //
            // )
            toast.success(<span>
                        hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                    </span>, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

        } catch (error: any) {
            console.log(error);
            message.error(`please try again`);
        } finally {


        }
    }
    useEffect(() => {


        //fetch_pair_resources()
    },[account])
    return (
        <>
            <Button title={"Create_pair"} style={{height:70,width:200}} onClick={button_click}>
                Create helper
            </Button>

            <Drawer open={open} onClose={button_close} style={{width: 1000}} title={"Create_pair"}>
                <Row gutter={[8,24]}>

                    <Col span={24}>
                        <Input placeholder="add or delete" onChange={value => {
                            setadd_or_delete(value.target.value)
                        }}></Input>
                    </Col>


                    <Col span={24}>
                        <Input placeholder="helper address" onChange={value => {
                            sethelper_address(value.target.value)
                        }}></Input>
                    </Col>

                    <Col span={24}>
                        <button className={"rainbow"} onClick={() => submit_transaction()}>
                            create helper
                        </button>
                    </Col>

                </Row>
            </Drawer>
        </>
    );
}
const Admin_like: React.FC<{}> = ({ }) => {
    const [open , set_open] = useState<boolean>(false);
    const button_click = () =>{
        set_open(true)
    }
    const button_close = () =>{
        set_open(false)
    }

    const { account, signAndSubmitTransaction } =useWallet() ;
    const [amount,setamount]=useState('');
    const [string1,setstring1]=useState('');
    const [string2,setstring2]=useState('');




    const submit_transaction = async () => {
        const transaction: InputTransactionData = {
            data: {
                function: `${module_address}::helper::admin_like`,
                functionArguments: [amount,string1,string2]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;
            // message.success(
            //
            // )
            toast.success(<span>
                        hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                    </span>, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

        } catch (error: any) {
            console.log(error);
            message.error(`please try again`);
        } finally {


        }
    }
    useEffect(() => {

        //fetch_pair_resources()
    },[account])
    return (
        <>
            <Button title={"Create_pair"} style={{height:70,width:200}} onClick={button_click}>
                Admin_like
            </Button>

            <Drawer open={open} onClose={button_close} style={{width: 1000}} title={"Create_pair"}>
                <Row gutter={[8,24]}>

                    <Col span={24}>
                        <Input placeholder="amount" onChange={value => {
                            setamount(value.target.value)
                        }}></Input>
                    </Col>


                    <Col span={24}>
                        <Input placeholder="string1" onChange={value => {
                            setstring1(value.target.value)
                        }}></Input>
                    </Col>
                    <Col span={24}>
                        <Input placeholder="string2" onChange={value => {
                            setstring2(value.target.value)
                        }}></Input>
                    </Col>
                    <Col span={24}>
                            resources - admin
                    </Col>
                    <Col span={24}>
                            bank - resources
                    </Col>
                    <Col span={24}>
                        helper - resources
                    </Col>
                    <Col span={24}>
                        garble -resources
                    </Col>
                    <br/>
                    <Col span={24}>
                        <button className={"rainbow"} onClick={() => submit_transaction()}>
                            admin like
                        </button>
                    </Col>

                </Row>
            </Drawer>
        </>
    );
}
const Set_chance: React.FC<{}> = ({ }) => {
    const [open , set_open] = useState<boolean>(false);
    const button_click = () =>{
        set_open(true)
    }
    const button_close = () =>{
        set_open(false)
    }

    const { account, signAndSubmitTransaction } =useWallet() ;
    const [fee1,setfee1]=useState('');
    const [string1,setstring1]=useState('');
    const [fee2,setfee2]=useState('');




    const submit_transaction = async () => {
        const transaction: InputTransactionData = {
            data: {
                function: `${module_address}::helper::admin_like`,
                functionArguments: [string1,fee1,fee2]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;
            // message.success(
            //
            // )
            toast.success(<span>
                        hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                    </span>, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

        } catch (error: any) {
            console.log(error);
            message.error(`please try again`);
        } finally {


        }
    }
    useEffect(() => {

        //fetch_pair_resources()
    },[account])
    return (
        <>
            <Button title={"Create_pair"} style={{height:70,width:200}} onClick={button_click}>
                Set chance
            </Button>

            <Drawer open={open} onClose={button_close} style={{width: 1000}} title={"Create_pair"}>
                <Row gutter={[8,24]}>

                    <Col span={24}>
                        <Input placeholder="string" onChange={value => {
                            setstring1(value.target.value)
                        }}></Input>
                    </Col>
                    <Col span={24}>
                        <Input placeholder="fee1" onChange={value => {
                            setfee1(value.target.value)
                        }}></Input>
                    </Col>
                    <Col span={24}>
                        <Input placeholder="fee2" onChange={value => {
                            setfee2(value.target.value)
                        }}></Input>
                    </Col>
                    <Col span={24}>
                        margin 1
                    </Col>
                    <Col span={24}>
                        fee 2
                    </Col>
                    <Col span={24}>
                        share 2
                    </Col>
                    <Col span={24}>
                        max helper 1
                    </Col>
                    <Col span={24}>
                       least helper 1
                    </Col>
                    <Col span={24}>
                        wrong 1
                    </Col>
                    <Col span={24}>
                        nft chance 2
                    </Col>
                    <Col span={24}>
                        bank share 2
                    </Col>
                    <br/>
                    <Col span={24}>
                        <button className={"rainbow"} onClick={() => submit_transaction()}>
                            Set chance
                        </button>
                    </Col>

                </Row>
            </Drawer>
        </>
    );
}
const Time_to_stop_bet: React.FC<{}> = ({ }) => {
    const [open , set_open] = useState<boolean>(false);
    const [expired_time ,set_expired_time]=useState('');
    const button_click = () =>{
        set_open(true)
    }
    const button_close = () =>{
        set_open(false)
    }

    const { account, signAndSubmitTransaction } =useWallet() ;

    const [pair_name,set_pair_name]=useState('');





    const submit_transaction = async () => {
        const transaction: InputTransactionData = {
            data: {
                function: `${module_address}::helper::admin_said_times_up`,
                functionArguments: [pair_name,expired_time]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;
            // message.success(
            //
            // )
            toast.success(<span>
                        hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                    </span>, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

        } catch (error: any) {
            console.log(error);
            message.error(`please try again`);
        } finally {


        }
    }
    useEffect(() => {


        //fetch_pair_resources()
    },[account])
    return (
        <>
            <Button title={"Create_pair"} style={{height:70,width:200}} onClick={button_click}>
                Time to stop bet
            </Button>

            <Drawer open={open} onClose={button_close} style={{width: 1000}} title={"Create_pair"}>
                <Row gutter={[8,24]}>

                    <Col span={24}>
                        <Input placeholder="pair_name" onChange={value => {
                            set_pair_name(value.target.value)

                        }}></Input>
                    </Col>
                    <Col span={24}>
                        <Input placeholder="expired_time" onChange={value => {
                            set_expired_time(value.target.value)

                        }}></Input>
                    </Col>
                    <br/>
                    <Col span={24}>
                        <button className={"rainbow"} onClick={() => submit_transaction()}>
                            Stop bet
                        </button>
                    </Col>

                </Row>
            </Drawer>
        </>
    );
}
export default Admin_page;