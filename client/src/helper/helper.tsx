
import {Col, Collapse, Row, theme,Image } from "antd";
import React, {useEffect, useState} from 'react';
import Prove_of_helper from "../art/Prove of Helper.png";
import {Content} from "antd/lib/layout/layout";

const text1 = `
  If you are our diffusion helper , you can help us to upload correct result.
`;

const Helper_page:React.FC<{ }> = ({ }) => {
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

                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Collpse_this_page/>
                    </div>
                    </Col>
                </Row>
            </Content>
        </>
    );
}

const Collpse_this_page = () =>{

    return(
        <>
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 },{ xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={24}>
                    <Collapse
                        size="small"
                        items={[{ key: '1', label: 'This is small size panel header', children: <p>{text1}</p> }]}
                    />
                </Col>
                <Col  span={24}>
                    <Collapse
                        size="small"
                        items={[{ key: '1', label: 'This is small size panel header', children: <p>{text1}
                                <Collapse  items={[{
                                    key: '1', label: 'How it work', children: <p>
                                        <Image  src={Prove_of_helper}/>
                                    </p> }]}
                                />
                            </p>}]}

                    />
                </Col>
            </Row>
        </>
    );
}

export default Helper_page;