import React, { useEffect } from 'react';
import Kinet from 'kinet';
import "../css_/firefly_button.css";
const KinetComponent: React.FC = () => {
    useEffect(() => {
        // 创建 Kinet 实例
        const kinet = new Kinet({
            acceleration: 0.02,
            friction: 0.25,
            names: ['x', 'y'],
        });

        // 获取 circle 元素
        const circle = document.getElementById('circle') as HTMLElement;

        // 在 Kinet tick 事件上设置处理程序
        kinet.on('tick', (instances: any) => {
            if (circle) {
                circle.style.transform = `translate3d(${instances.x.current}px, ${instances.y.current}px, 0) rotateX(${instances.x.velocity / 2}deg) rotateY(${instances.y.velocity / 2}deg)`;
            }
        });

        // 监听鼠标移动事件，并调用 Kinet 动画方法
        const onMouseMove = (event: MouseEvent) => {
            const offsetY = 405;
            const offsetX = 810;
            kinet.animate('x', event.clientX +offsetX- window.innerWidth / 2);
            kinet.animate('y', event.clientY +offsetY- window.innerHeight / 2 );
        };

        document.addEventListener('mousemove', onMouseMove);

        // 清理事件监听器
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <>
            {/*<a className="button-wrapper">*/}
            {/*    <span className="dot dot-1"></span>*/}
            {/*    <span className="dot dot-2"></span>*/}
            {/*    <span className="dot dot-3"></span>*/}
            {/*    <span className="dot dot-4"></span>*/}
            {/*    <span className="dot dot-5"></span>*/}
            {/*    <span className="dot dot-6"></span>*/}
            {/*    <span className="dot dot-7"></span>*/}
            {/*    <span className="button">Button</span>*/}

            {/*</a>*/}

            <div id="circle" className="circle"></div>
        </>
    );
};

export default KinetComponent;


