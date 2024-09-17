import React, {useEffect, useRef, useState } from 'react';
import Tree1 from "./last_tree/tree1.png";
import Tree2 from  "./last_tree/tree2.png";
import Tree3 from "./last_tree/tree3.png";
import Tree4 from "./last_tree/tree4.png";
import Light1 from "./last_tree/light1.png";
import Light2 from "./last_tree/light2.png";
import Light3 from "./last_tree/light3.png";
import Light4 from "./last_tree/light4.png";
import Light5 from "./last_tree/light5.png";
const Last_tree_on_website: React.FC <{}> = ({}) => {

    const tree1_position = {
        top:"9100px",
        height:"20%",
        width:"auto",
        left:"3%",
        zIndex: 7,
    }
    const tree2_position = {
        top:"9100px",
        height:"20%",
        width:"auto",
        left:"3%",
        zIndex: 10,
    }
    const tree3_position = {
        top:"9080px",
        height:"20%",
        width:"auto",
        left:"3%",
        zIndex: 7,
    }
    const tree4_position = {
        top:"9100px",
        height:"20%",
        width:"auto",
        left:"3%",
        zIndex: 10,
    }
    const light1_position = {
        top:"9060px",
        height:"22%",
        width:"auto",
        left:"4%",
        zIndex: 13,
    }
    const light2_position = {
        top:"9060px",
        height:"22%",
        width:"auto",
        left:"4%",
        zIndex: 13,
    }
    const light3_position = {
        top:"9060px",
        height:"22%",
        width:"auto",
        left:"4%",
        zIndex: 11,
    }
    const light4_position = {
        top:"9060px",
        height:"22%",
        width:"auto",
        left:"4%",
        zIndex: 11,
    }
    const light5_position = {
        top:"9060px",
        height:"22%",
        width:"auto",
        left:"4%",
        zIndex: 11,
    }
    return (
        <>
            <LazyLoadImage
                src={Tree1}
                style={{...tree1_position,position:"absolute"}} alt="last tree 1"/>
            <LazyLoadImage
                src={Tree2}
                style={{...tree2_position,position:"absolute"}} alt="last tree 2"/>
            <LazyLoadImage
                src={Tree3}
                style={{...tree3_position,position:"absolute"}} alt="last tree 3"/>
            <LazyLoadImage
                src={Tree4}
                style={{...tree4_position,position:"absolute"}} alt="last tree 4"/>
            <div >
                <LazyLoadImage
                    src={Light1}
                    style={{...light1_position,position:"absolute"}} alt="last light1"/>
                <LazyLoadImage
                    src={Light2}
                    style={{...light2_position,position:"absolute"}} alt="last light2"/>
                <LazyLoadImage
                    src={Light3}
                    style={{...light3_position,position:"absolute"}} alt="last light3"/>
                <LazyLoadImage
                    src={Light4}
                    style={{...light4_position,position:"absolute"}} alt="last light4"/>
                <LazyLoadImage
                    src={Light5}
                    style={{...light5_position,position:"absolute"}} alt="last light5"/>
            </div>

        </>
    )
}
export default Last_tree_on_website;

const LazyLoadImage = ({src, alt, style}: { src: string; alt: string; style: React.CSSProperties }) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect(); // 加载完毕后断开观察
                    }
                });
            },
            { threshold: 0.1 } // 当图片可见性达到 10% 时加载
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    return (
        <img ref={imgRef} src={isVisible ? src : undefined} alt={alt} style={style} />
    );
};