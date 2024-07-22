
import {Row, theme} from "antd";
import React, {useEffect, useState} from 'react';

import {Content} from "antd/lib/layout/layout";



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

                    </div>
                </Row>
            </Content>
        </>
    );
}

export default NFT_page;