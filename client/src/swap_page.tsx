
import {Row, theme} from "antd";
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
                            <Swap_box/>
                    </div>
                </Row>
            </Content>
        </>
);
}

export default Swap_page;