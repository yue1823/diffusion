
import {Row, theme} from "antd";
import React from 'react';

import {Content} from "antd/lib/layout/layout";

import CountdownTimer from "../user/Count_time";



const NFT_page:React.FC<{ }> = ({ }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>
            <Content style={{padding: '15px 30px'}}>
                <Row>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 600,
                            minWidth: 1200,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <CountdownTimer expiredDate={"30092024"} yes_or_not={true}/>
                    </div>
                </Row>
            </Content>
        </>
    );
}

export default NFT_page;