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
import Down_tree1  from "./last_tree/down_tree1.png";
import Down_tree2 from "./last_tree/down_tree2.png";
import Down_tree3 from "./last_tree/down_tree3.png";
import Down_tree4 from "./last_tree/down_tree4.png";
const Last_tree_on_website: React.FC <{}> = ({}) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            console.log('scroll',scrollPosition);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    const tree1_position = {
        top:"9100px",
        height:"20%",
        width:"auto",
        left:"3%",
        zIndex: 7,
        transform:scrollPosition <= 9500 ?``:`translateY(${(scrollPosition-9500)}px) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 2000))})`
    }
    const tree2_position = {
        top:"9100px",
        height:"20%",
        width:"auto",
        left:"3%",
        zIndex: 10,
        transform:scrollPosition <= 9500 ?``:`translateY(${(scrollPosition-9500)}px) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 2000))})`
    }
    const tree3_position = {
        top:"9080px",
        height:"20%",
        width:"auto",
        left:"3%",
        zIndex: 7,
        transform:scrollPosition <= 9500 ?``:`translateY(${(scrollPosition-9500)}px) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 2000))})`,
    }
    const tree4_position = {
        top:"9100px",
        height:"20%",
        width:"auto",
        left:"3%",
        zIndex: 10,
        transform:scrollPosition <= 9500 ?``:`translateY(${(scrollPosition-9500)}px) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 2000))})`,
    }
    const light1_position = {
        //large
        top:"9020px",
        height:"22%",
        width:"auto",
        left:"3%",
        zIndex: 13,
        transform:scrollPosition <= 9500 ?``:`translateY(${(scrollPosition-9500)}px) scale(${(Math.max(0.8, 1 - (scrollPosition - 9500) / 2000))})`,
    }
    const light2_position = {
        //large
        top:"9020px",
        height:"22%",
        width:"auto",
        left:"3.5%",
        zIndex: 14,
        transform:scrollPosition <= 9500 ?``:`translateY(${(scrollPosition-9500)}px) scale(${(Math.max(0.8, 1 - (scrollPosition - 9500) / 2000))})`,
    }
    const light3_position = {
        top:"9020px",
        height:"22%",
        width:"auto",
        left:"3%",
        zIndex: 11,
        transform:scrollPosition <= 9500 ?``:`translateY(${(scrollPosition-9500)}px) scale(${(Math.max(0.3, 1 - (scrollPosition - 9500) / 2000))})`,
    }
    const light4_position = {
        top:"9020px",
        height:"22%",
        width:"auto",
        left:"3.5%",
        zIndex: 11,
        transform:scrollPosition <= 9500 ?``:`translateY(${(scrollPosition-9500)}px) scale(${(Math.max(0.3, 1 - (scrollPosition - 9500) / 2000))})`,
    }
    const light5_position = {
        //large
        top:"9020px",
        height:"22%",
        width:"auto",
        left:"3.5%",
        zIndex: 11,
        transform:scrollPosition <= 9500 ?``:`translateY(${(scrollPosition-9500)}px) scale(${(Math.max(0.8, 1 - (scrollPosition - 9500) / 2000))})`,
    }
    const down_tree1_position = {
        top:"9100px",
        height:"20%",
        width:"auto",
        left:"3%",
        zIndex: 8,
        transform:scrollPosition <= 9500 ?``:`translateY(${(scrollPosition-9500)}px) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 2000))})`,
    }
    const down_tree2_position = {
        top:"9100px",
        height:"20%",
        width:"auto",
        left:"3.2%",
        zIndex: 7,
        transform:scrollPosition <= 9500 ?``:`translateY(${(scrollPosition-9500)}px) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 2000))})`,
    }
    const down_tree3_position = {
        top:"9100px",
        height:"20%",
        width:"auto",
        left:"3.3%",
        zIndex: 7,
        transform:scrollPosition <= 9500 ?``:`translateY(${(scrollPosition-9500)}px) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 2000))})`,
    }
    const down_tree4_position = {
        top:"9100px",
        height:"20%",
        width:"auto",
        left:"3.3%",
        zIndex: 1,
        transform:scrollPosition <= 9500 ?``:`translateY(${Math.max(scrollPosition-9500,-300)}px) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 2000))})`,
    }
    return (
        <>
            {/*scale(18)*/}
            <div style={{ transform: '' }}>
                <LazyLoadImage
                    src={Tree1}
                    style={{...tree1_position, position: "absolute"}} alt="last tree 1"/>
                <LazyLoadImage
                    src={Tree2}
                    style={{...tree2_position, position: "absolute"}} alt="last tree 2"/>
                <LazyLoadImage
                    src={Tree3}
                    style={{...tree3_position, position: "absolute"}} alt="last tree 3"/>
                <LazyLoadImage
                    src={Tree4}
                    style={{...tree4_position, position: "absolute"}} alt="last tree 4"/>

                <LazyLoadImage
                    src={Light1}
                    style={{...light1_position, position: "absolute"}} alt="last light1"/>
                <LazyLoadImage
                    src={Light2}
                    style={{...light2_position, position: "absolute"}} alt="last light2"/>
                <LazyLoadImage
                    src={Light3}
                    style={{...light3_position, position: "absolute"}} alt="last light3"/>
                <LazyLoadImage
                    src={Light4}
                    style={{...light4_position, position: "absolute"}} alt="last light4"/>
                <LazyLoadImage
                    src={Light5}
                    style={{...light5_position, position: "absolute"}} alt="last light5"/>
                <LazyLoadImage
                    src={Down_tree1}
                    style={{...down_tree1_position, position: "absolute"}} alt="down tree1 "/>
                <LazyLoadImage
                    src={Down_tree2}
                    style={{...down_tree2_position, position: "absolute"}} alt="down tree2 "/>
                <LazyLoadImage
                    src={Down_tree3}
                    style={{...down_tree3_position, position: "absolute"}} alt="down tree3 "/>
                <LazyLoadImage
                    src={Down_tree4}
                    style={{...down_tree4_position, position: "absolute"}} alt="down tree4 "/>
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
            { threshold: 0.05 } // 当图片可见性达到 10% 时加载
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
        <img ref={imgRef} src={isVisible ? src : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="}  alt={alt} style={style} />
    );
};