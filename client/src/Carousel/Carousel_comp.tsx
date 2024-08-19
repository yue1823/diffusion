import React from 'react';
import {Carousel, Col, Row} from 'antd';

const contentStyle: React.CSSProperties = {
    height: 100,
    color: '#fff',
    lineHeight: '100px',
    textAlign: 'center',
    background: '#364d79',

};

const Carousel_comp: React.FC = () => (

    <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
        <Col span={24}>
            <Carousel  >
                <div>
                    <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>2</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>3</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>4</h3>
                </div>
            </Carousel>
        </Col>
    </Row>


);

export default Carousel_comp;