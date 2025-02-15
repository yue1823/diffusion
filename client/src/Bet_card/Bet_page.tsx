import React, {useEffect, useState} from 'react';
import {Content} from "antd/lib/layout/layout";
import Swap_box from "../swap_page/swap_box";
import {Router} from "react-router-dom";
import {Card, Col, ConfigProvider, Row ,Tree} from "antd";
import Aka from "../Small_box/aka";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
import type { TreeDataNode } from 'antd';

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

const module_address="0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa";
const resources_type ="0x1::account::Account";

const Bet_page:React.FC<{}> = ({}) =>{
        const [tree_data,set_tree_data]=useState<string[]>([]);
        const [check ,setcheck] =useState<string>('');
    const onCheck = (checkedKeysValue: any) => {
        checkedKeysValue.map((key: React.SetStateAction<string>) => ( setcheck(key)));
        tree_data.push(check);
    };
        const fetch_data_from_aptos=()=>{



        }



    useEffect(() => {
        const fetch_pair_resources = () =>{
            const https = `https://aptos-mainnet.nodit.io/v1/accounts/${module_address}/resource/${resources_type}`
            try{
                //fetch(https,https_required).then(respone => respone.json());
            }catch (e:any){
                console.log(e);
            }
        }


    },[])
    return(
        <>
            <Content style={{padding: '15px 30px'}}>

                    <div
                        style={{
                            padding: 20,
                            minHeight: 600,
                            minWidth: 600,
                            background: "#ffffff",
                            borderRadius: 10,
                        }}
                    >

                        <Row gutter={24}>
                            <Col span={4}>

                                <div
                                    style={{
                                        padding: 0,
                                        height: 600,
                                        width: 170,
                                        background: "#EBE5DF",
                                        borderRadius: 10,
                                        textAlign: 'center',
                                    }}
                                >
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Card: {
                                                    headerBg:"#EBE5DF",
                                                    actionsBg:"#EBE5DF",
                                                    /* 这里是你的组件 token */
                                                },
                                            },
                                        }}
                                    >
                                        <Card title="Tags" bordered={false} style={{backgroundColor:"#EBE5DF"}}>
                                            <Tree
                                                checkable
                                                defaultSelectedKeys={['0-1']}
                                                defaultExpandAll
                                                treeData={treeData}
                                                blockNode
                                                style={{backgroundColor:"#EBE5DF"}}
                                                onCheck={onCheck } />
                                        </Card>
                                    </ConfigProvider>


                                </div>
                            </Col>
                            <Col span={18}>
                                <div
                                    style={{
                                        padding: 0,
                                        height: 600,
                                        width: 960,
                                        background: "#EBE5DF",
                                        borderRadius: 10,
                                        textAlign: 'center',
                                    }}
                                >
                                    <Row  gutter={[16, 16]}>
                                        {/*<Col span={11}>*/}
                                        {/*    <Aka */}
                                        {/*        left_preview={}*/}
                                        {/*        right_preview={}*/}
                                        {/*        left={}*/}
                                        {/*        middle={}*/}
                                        {/*        right={}*/}
                                        {/*        left_name={}*/}
                                        {/*        right_name={}*/}
                                        {/*            disable={}*/}
                                        {/*    ></Aka>*/}
                                        {/*</Col>*/}
                                        {/*<Col span={1}></Col>*/}
                                        <Col span={12}>
                                            <Aka
                                                left_preview={"https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/640px-Donald_Trump_official_portrait.jpg"}
                                                right_preview={"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/800px-Joe_Biden_presidential_portrait.jpg"}
                                                left={2} middle={8} right={3} left_name={"Trump"} right_name={"Biden"} disable={false}/>
                                        </Col>
                                        <Col span={12}>
                                            <Aka
                                                left_preview={"data:image/jpeg;base64,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"}
                                                right_preview={"data:image/png;base64,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"}
                                                left={1.5} middle={4} right={2} left_name={"T1"} right_name={"GEN"} disable={false}/>
                                        </Col>
                                        {/*<Col span={1}></Col>*/}
                                        <Col span={12}>
                                            <Aka
                                                left_preview={"data:image/png;base64,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"}
                                                right_preview={"data:image/png;base64,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"}
                                                left={1.8}
                                                middle={2.5}
                                                right={2.1}
                                                left_name={"Brazil"}
                                                right_name={"Argentina"}
                                                disable={false}
                                            ></Aka>
                                        </Col>
                                        <Col span={12}>
                                            <Aka
                                                left_preview={"data:image/jpeg;base64,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"}
                                                right_preview={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzgOPe_WyDGy8uHXFoKyvf73JR5FU3UmmPqw&s"}
                                                left={12}
                                                middle={1}
                                                right={13}
                                                left_name={"Mo Shaikh"}
                                                right_name={"Avery Ching"}
                                                disable={false}
                                            ></Aka>
                                        </Col>

                                    </Row>

                                </div>
                            </Col>


                        </Row>


                    </div>
                <Row>
                    <p> {tree_data} </p>

                </Row>
            </Content>

        </>
    );
}
const treeData: TreeDataNode[] = [
    {
        title: 'All',
        key: 'All',
        children: [
            {
                title: 'Game',
                key: 'Game',

            },
            {
                title: 'Sport',
                key: 'Sport',

            },
            {
                title: 'Unexpect',
                key: 'Unexpect',

            },
        ],
    },
];
export default Bet_page;