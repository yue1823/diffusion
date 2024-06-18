import React, {useEffect, useState} from 'react';
import "../css_folder/heardbar.css"
import {Badge, Card, Col, ConfigProvider, Layout, Row, Space, theme} from "antd";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import User_address_box from "./user_address_box";
import Resource_address_box from "./resource_address_box";
import {ArrowRightOutlined, ReloadOutlined, UserOutlined} from "@ant-design/icons";
import "../css_folder/Content.css"
import To_address_box from "./to_address_box";
import "../css_folder/Content.css"


const Show_content:React.FC<{ address:string,index_of_address:number}> = ({ address,index_of_address:number}) =>  {
    const [user_address_box,setuser_address_box]=useState<boolean>(false);
    const [sharedData, setSharedData] = useState<number | null>(null);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
        const Get_simulater = () =>{
            const hiddenElement = document.getElementById('hiddenData') as HTMLImageElement;
            if (hiddenElement  ) {
                    setSharedData(parseInt(hiddenElement.alt, 10));
        }}

    const check_shared_not_null=()=>{
        if(sharedData != null){
            return <To_address_box address={address} row_index={sharedData}/>
        }else{console.log(sharedData)}
    }




    useEffect(() => {
        if(address != "User address"){setuser_address_box(true)}
        Get_simulater()
    },[address,sharedData]);
    return (
        <div
            style={{
                padding: 24,
                minHeight: 400,
                minWidth: 800,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
        >
            {user_address_box && (
                <div className={"Reload_logo"}><ReloadOutlined style={{fontSize: 30, height: 30}}
                                                               onClick={Get_simulater}/></div>
            )}
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

            <Space direction="vertical" size="middle" style={{width: '100%'}}>

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


                </Row>
                {user_address_box && (
                    <Row>
                        {check_shared_not_null()}
                    </Row>
                )}

            </Space>


        </div>
    );
}

export default Show_content