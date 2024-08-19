
import {Col, Row, theme} from "antd";
import React, {useEffect, useState} from 'react';
import Show_content from "./content/show_content";
import Select_content from "./content/select_content";
import {Content} from "antd/lib/layout/layout";
import Swap_box from "./swap_page/swap_box";


const Swap_page:React.FC<{ }> = ({ }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>

            <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                <Col span={3}></Col>
                <Col span={12}>
                    <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 600,
                                minWidth: 1200,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Swap_box/>
                        </div>
                    </Row>
                </Col>
                <Col span={6}></Col>
            </Row>

        </>
    );
}

export default Swap_page;