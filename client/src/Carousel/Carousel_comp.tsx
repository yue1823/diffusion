import React from 'react';
import { Carousel } from 'antd';

const contentStyle: React.CSSProperties = {
    height: 100,
    color: '#fff',
    lineHeight: '1000px',
    textAlign: 'center',
    background: '#364d79',

};

const Carousel_comp: React.FC = () => (
    <Carousel >
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
);

export default Carousel_comp;