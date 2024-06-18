import React, {ReactNode, useEffect, useState} from 'react';
import "../css_folder/heardbar.css"
import { HappyProvider } from '@ant-design/happy-work-theme';
import {
    Alert,
    Button,
    Col,
    ConfigProvider, Drawer,
    Input,
    Layout, message,
    notification,
    NotificationArgsProps,
    Row,
    Select,
    Steps,
    Switch,
    theme
} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {
    CheckOutlined,
    CloseOutlined,
    MinusOutlined,
    PlusOutlined,
    ShareAltOutlined, UserAddOutlined, UserDeleteOutlined,
    UserOutlined
} from "@ant-design/icons";
import Context from '@ant-design/icons/lib/components/Context';


const connect_Wallet = 'Connect Wallet.';
type NotificationPlacement = NotificationArgsProps['placement'];
interface CProps {
    setSharedData: React.Dispatch<React.SetStateAction<number>>;
}


const Select_content:React.FC<{ address:string,index_of_address:number}> = ({ address,index_of_address:number,}) => {
    const [rows, setRows] = useState<number[]>([0]);
    const [steps,set_steps] = useState(0);
    const [share_data,setshare_data] =useState<number>(0);
    const [amount,setamount]=useState<number>(0);
    const [cointype,setcointypr] = useState<string>("")
    const longAddressPattern = /^0x[a-fA-F0-9]{64}$/; // 長地址模式
    const shortAddressPattern = /^0x[a-fA-F0-9]{1,63}$/;
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };
    const button_clixk=()=>{
        const a =document.getElementById('hiddenData') as HTMLImageElement;
        setshare_data(parseInt(a.alt,10));
    }

    // Filter `option.label` match the user type `input`
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    ////////////////////////////////
    const [loadings, setLoadings] = useState<boolean[]>([]);

    const enterLoading = (index: number) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });

        setTimeout(() => {
            setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 6000);
    };
    //button
    //happy work button
    const check_everything=()=>{
        if(steps==4){
            //amount cointype to_address need_garble
            if(longAddressPattern.test(to_address) || shortAddressPattern.test(to_address)){

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
    const [api, contextHolder] = notification.useNotification();
    const check_Coin_disable = ():boolean =>{
        return steps < 3;
    }
    const check_amount_disable = ():boolean =>{
        return steps < 2;
    }

    const openNotification = (placement: NotificationPlacement) => {
        api.info({
            message: `Notification ${placement}`,
            description: <Context.Consumer>{() => `Hello,!`}</Context.Consumer>,
            placement,
        });
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
                        defaultChecked
                        onChange={value => setneed_garble(value)}
                    />
                </Col>
            </Row>
            <br/>
            <Row>
                <Input placeholder="User address" prefix={<UserOutlined/>} disabled={true} value={address}/>
            </Row>
            <br/>
            <Row>Address</Row>
            {rows.map((row, index) => (
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
                        };
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
                        };
                        setcointypr(value as  string);
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
            <Row>

                <HappyProvider>
                    <Button type="primary"  onClick={check_everything} style={{height: 50, width: 190, background: "#f1eddd", color: "black"} }>Happy Work</Button>
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



        </div>
    );
}


const C: React.FC<CProps> = ({setSharedData}) => {
    return (
        <div>
            <Select_content address="some_address" index_of_address={0}  />
        </div>
    );
};
export default Select_content