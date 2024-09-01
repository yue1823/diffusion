import React, { useState, useEffect } from 'react';

const Star: React.FC <{position1:number,position2:number,position3:number,position4:string,text:string}>= ({position1,position2,position3,position4,text}) => {
    const [opacity, setOpacity] = useState(0); // 控制透明度
    const [visibility, setVisibility] = useState<'hidden' | 'visible'>('hidden'); // 控制可见性

    const handleScroll = () => {
        const position = window.scrollY;
        console.log(position);
        // 星星在800位置出现，900位置最亮
        if (position >= position1 && position <= position2) {
            const newOpacity = (position - position1) / 100; // 计算透明度
            setOpacity(newOpacity);
            setVisibility('visible');
        } else if (position > position3) {
            setOpacity(1); // 完全显示
            setVisibility('visible');
        } else {
            setOpacity(0); // 隐藏
            setVisibility('hidden');
        }
    };

    useEffect(() => {
        const handleScrollThrottled = () => {
            requestAnimationFrame(handleScroll);
        };

        window.addEventListener('scroll', handleScrollThrottled);
        return () => {
            window.removeEventListener('scroll', handleScrollThrottled);
        };
    }, []);

    return (
        <>
            <div style={{height:100,width:100}}>
                <div
                    style={{
                        position: 'fixed',
                        top: '160px',
                        left: '38%',
                        transform: 'translateX(-50%) rotate(0deg)',
                        visibility: visibility, // 控制可见性
                        borderLeft: '30px solid transparent',
                        borderRight: '30px solid transparent',
                        borderBottom: `60px solid rgba(255, 255, 255, ${opacity})`,
                        transition: 'opacity 0.3s',
                        fontSize:200,
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '19px',
                            left: '-31px',
                            width: 0,
                            height: 0,
                            borderLeft: '30px solid transparent',
                            borderRight: '30px solid transparent',
                            borderTop: `60px solid rgba(255, 255, 255, ${opacity})`,
                        }}
                    />
                </div>
            </div>
            <p
            style={{
                opacity:opacity,
                transition: 'opacity 0.5s ease-in-out', // 使透明度变化更平滑
                position: 'fixed', // 让文字固定在某个位置
                top: '22%', // 调整为合适的位置
                left: position4,
                zIndex: 27,
                transform: 'translate(-20%, -20%)',
                fontSize: '30px',
                color: 'white',}}>
                {text}
            </p>
        </>
    );
};

export default Star;
