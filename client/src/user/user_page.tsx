import {Card, Col, ProgressProps, Row, theme} from "antd";
import React, {useEffect, useState} from 'react';

import {Content} from "antd/lib/layout/layout";



const User_page:React.FC<{ }> = ({ }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>
            <Content style={{padding: '15px 30px'}}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                    <Col span={24}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 600,
                                minWidth: 1200,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={6}>
                                    <Card title={"User"} style={{height:550}}>

                                    </Card>
                                </Col>
                                <Col span={18}>
                                    <Card  style={{height:550}}>

                                    </Card>
                                </Col>

                            </Row>
                        </div>
                    </Col>
                </Row>
            </Content>
        </>
    );
}

export default User_page;