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
import Down_tree5 from "./last_tree/down_tree5.png";
import Road_light1 from "./last_tree/road_light1.png";
import Road_light2 from "./last_tree/road_light2.png";
import Road_main from "./last_tree/road.png";
import Left_rock1 from "./last_tree/left/rock1_left.png";
import Left_rock2 from "./last_tree/left/rock2_left.png";
import Left_rock3 from "./last_tree/left/rock3_left.png";
import Left_rock4 from "./last_tree/left/rock4_left.png";
import Left_rock5 from "./last_tree/left/rock5_left.png";
import Left_rock6 from "./last_tree/left/rock6_left.png";
import Left_rock7 from "./last_tree/left/rock7_left.png";
import Right_wood from "./last_tree/Right/Right_wood1.png";
import Right_rock1 from "./last_tree/Right/Right_rock1.png";
import Right_rock2 from "./last_tree/Right/Right_rock2.png";
import Right_rock3 from "./last_tree/Right/Right_rock3.png";
import Right_rock4 from "./last_tree/Right/Right_rock4.png";
import Right_rock5 from "./last_tree/Right/Right_rock5.png";
import Right_light from "./last_tree/Right/Right_light1.png";
const Last_tree_on_website: React.FC <{scrollPosition:number}> = ({scrollPosition}) => {
    // const [scrollPosition, setScrollPosition] = useState(0);
    // useEffect(() => {
    //
    //     const handleScroll = () => {
    //         setScrollPosition(window.scrollY);
    //     };
    //     window.addEventListener("scroll", handleScroll);
    //
    //     return () => {
    //         console.log('scroll',scrollPosition);
    //         window.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);
    const tree1_position = {
        transition: 'opacity 0.5s ease-in-out',
        top:"93%",
        height:"120%",
        width:"100%",
        left:"13%",
        zIndex: 7,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-110)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1000))})`
    }
    const tree2_position = {
        transition: 'opacity 0.5s ease-in-out',
        top:"93%",
        height:"120%",
        width:"100%",
        left:"13%",
        zIndex: 10,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const tree3_position = {
        transition: 'opacity 0.5s ease-in-out',
        top:"93%",
        height:"122%",
        width:"100%",
        left:"12.5%",
        zIndex: 7,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const tree4_position = {
        transition: 'opacity 0.5s ease-in-out',
        top:"93%",
        height:"120%",
        width:"100%",
        left:"13%",
        zIndex: 10,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const light1_position = {
        //large
        transition: 'opacity 0.5s ease-in-out',
        top:"93%",
        height:"122%",
        width:"100%",
        left:"13%",
        zIndex: 13,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const light2_position = {
        transition: 'opacity 0.5s ease-in-out',
        //large
        top:"93%",
        height:"122%",
        width:"100%",
        left:"13.5%",
        zIndex: 14,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const light3_position = {
        transition: 'opacity 0.5s ease-in-out',
        top:"93%",
        height:"120%",
        width:"100%",
        left:"13%",
        zIndex: 11,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const light4_position = {
        transition: 'opacity 0.5s ease-in-out',
        top:"93%",
        height:"120%",
        width:"100%",
        left:"13.5%",
        zIndex: 11,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const light5_position = {
        //large
        transition: 'opacity 0.5s ease-in-out',
        top:"93%",
        height:"122%",
        width:"100%",
        left:"13.5%",
        zIndex: 11,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const down_tree1_position = {

        transition: 'opacity 0.5s ease-in-out',
        top:"93.4%",
        height:"120%",
        width:"100%",
        left:"13%",
        zIndex: 8,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const down_tree2_position = {
        transition: 'opacity 0.5s ease-in-out',
        top:"93%",
        height:"120%",
        width:"100%",
        left:"13.2%",
        zIndex: 7,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const down_tree3_position = {
        transition: 'opacity 0.5s ease-in-out',
        top:"93%",
        height:"120%",
        width:"100%",
        left:"13.3%",
        zIndex: 7,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const down_tree4_position = {
        transition: 'opacity 0.5s ease-in-out',
        top:"93%",
        height:"120%",
        width:"100%",
        left:"13.3%",
        zIndex: 1,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const down_tree5_position = {
        // transition: 'opacity 0.5s ease-in-out',
        // top:"94%",
        // height:"150%",
        // width:"auto",
        // left:"5.3%",
        // zIndex: 2,
        // transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.096 ,-90)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-95)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
        transition: 'opacity 0.5s ease-in-out',
        top:"94%",
        height:"120%",
        width:"100%",
        left:"13.3%",
        zIndex: 1,
        transform:scrollPosition <= 9500 ?`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%)`:`translateY(${Math.max((8500 -scrollPosition)*0.1 ,-100)}%) scale(${(Math.max(0.15, 1 - (scrollPosition - 9500) / 1500))})`
    }
    const road_light1_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"22%",
        height:"150%",
        width:"100%",
        left:"-22.7%",
        zIndex: 3,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((scrollPosition-9500)*3.8,-580)}px) translateY(${Math.max((9200 -scrollPosition)*0.2,-50 )}%)`,
    }
    const road_light2_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"23%",
        height:"150%",
        width:"100%",
        left:"48%",
        zIndex: 3,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max(-(scrollPosition-9500)*6.35,-850)}px) translateY(${Math.max((9200 -scrollPosition)*0.2,-50 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const road_main_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"180%",
        width:"100%",
        left:"0%",
        zIndex: 4,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((9200 -scrollPosition)*0.1 ),4}%) translateY(${Math.max((9200 -scrollPosition)*0.145 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const left_rock1_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"180%",
        width:"100%",
        left:"0%",
        zIndex: 4,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((9200 -scrollPosition)*0.1 ),4}%) translateY(${Math.max((9200 -scrollPosition)*0.145 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const left_rock2_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"180%",
        width:"100%",
        left:"0%",
        zIndex: 4,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((9200 -scrollPosition)*0.1 ),4}%) translateY(${Math.max((9200 -scrollPosition)*0.145 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const left_rock3_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"180%",
        width:"100%",
        left:"0%",
        zIndex: 4,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((9200 -scrollPosition)*0.1 ),4}%) translateY(${Math.max((9200 -scrollPosition)*0.145 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const left_rock4_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"180%",
        width:"100%",
        left:"0%",
        zIndex: 4,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((9200 -scrollPosition)*0.1 ),4}%) translateY(${Math.max((9200 -scrollPosition)*0.145 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const left_rock5_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"180%",
        width:"100%",
        left:"0%",
        zIndex: 4,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((9200 -scrollPosition)*0.1 ),4}%) translateY(${Math.max((9200 -scrollPosition)*0.145 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const left_rock6_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"180%",
        width:"100%",
        left:"0%",
        zIndex: 4,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((9200 -scrollPosition)*0.1 ),4}%) translateY(${Math.max((9200 -scrollPosition)*0.145 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const left_rock7_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"180%",
        width:"100%",
        left:"0%",
        zIndex: 4,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((9200 -scrollPosition)*0.1 ),4}%) translateY(${Math.max((9200 -scrollPosition)*0.145 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const right_rock1_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"210%",
        width:"120%",
        left:"-3%",
        zIndex: 3,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((9200 -scrollPosition)*0.1 ),4}%) translateY(${Math.max((9200 -scrollPosition)*0.153 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const right_rock2_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"220%",
        width:"120%",
        left:"-3%",
        zIndex: 5,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((9200 -scrollPosition)*0.1 ),6.6}%) translateY(${Math.max((9200 -scrollPosition)*0.156 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const right_rock3_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"200%",
        width:"100%",
        left:"-4%",
        zIndex: 4,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((9200 -scrollPosition)*0.1 ),4.1}%) translateY(${Math.max((9200 -scrollPosition)*0.151 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const right_rock4_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"230%",
        width:"120%",
        left:"-4%",
        zIndex: 4,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((9200 -scrollPosition)*0.1 ),7.8}%) translateY(${Math.max((9200 -scrollPosition)*0.158)}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const right_rock5_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"29%",
        height:"220%",
        width:"140%",
        left:"-3%",
        zIndex: 3,
        transform:scrollPosition <= 9450 ?``:`rotate(-3deg) translateX(${Math.max((9200 -scrollPosition)*0.1 ),8.9}%) translateY(${Math.max((9200 -scrollPosition)*0.157 )}%)`,
        //translateY(${Math.max((scrollPosition-9500),-100)}px)
    }
    const right_wood_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"22%",
        height:"170%",
        width:"auto",
        left:"-22.7%",
        zIndex: 0,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((scrollPosition-9500)*2.35,-480)}px) translateY(${Math.max((9200 -scrollPosition)*0.2,-30 )}%)`,
    }
    const right_light1_position = {
        transition: 'opacity 0.2s ease-in-out',
        top:"22%",
        height:"140%",
        width:"auto",
        left:"-22.7%",
        zIndex: 0,
        transform:scrollPosition <= 9450 ?``:`translateX(${Math.max((scrollPosition-9500)*2.9,-480)}px) translateY(${Math.max((9200 -scrollPosition)*0.2,-32 )}%) rotate(-5deg)`,
    }
    return (
        <>
            {/*scale(18)*/}
            {scrollPosition >= 8000 && (<>
                <div style={{
                    overflow: "hidden", margin: 0,
                    padding: 0
                }}>
                    <LazyLoadImage
                        src={Tree1}
                        style={{...tree1_position, position: "fixed"}} alt="last tree 1"/>
                    <LazyLoadImage
                        src={Tree2}
                        style={{...tree2_position, position: "fixed"}} alt="last tree 2"/>
                    <LazyLoadImage
                        src={Tree3}
                        style={{...tree3_position, position: "fixed"}} alt="last tree 3"/>
                    <LazyLoadImage
                        src={Tree4}
                        style={{...tree4_position, position: "fixed"}} alt="last tree 4"/>

                    <LazyLoadImage
                        src={Light1}
                        style={{...light1_position, position: "fixed"}} alt="last light1"/>
                    <LazyLoadImage
                        src={Light2}
                        style={{...light2_position, position: "fixed"}} alt="last light2"/>
                    <LazyLoadImage
                        src={Light3}
                        style={{...light3_position, position: "fixed"}} alt="last light3"/>
                    <LazyLoadImage
                        src={Light4}
                        style={{...light4_position, position: "fixed"}} alt="last light4"/>
                    <LazyLoadImage
                        src={Light5}
                        style={{...light5_position, position: "fixed"}} alt="last light5"/>
                    <LazyLoadImage
                        src={Down_tree1}
                        style={{...down_tree1_position, position: "fixed"}} alt="down tree1 "/>
                    <LazyLoadImage
                        src={Down_tree2}
                        style={{...down_tree2_position, position: "fixed"}} alt="down tree2 "/>
                    <LazyLoadImage
                        src={Down_tree3}
                        style={{...down_tree3_position, position: "fixed"}} alt="down tree3 "/>
                    <LazyLoadImage
                        src={Down_tree4}
                        style={{...down_tree4_position, position: "fixed"}} alt="down tree4 "/>
                    <LazyLoadImage
                        src={Down_tree5}
                        style={{...down_tree5_position, position: "fixed"}} alt="down tree5 "/>
                    <LazyLoadImage
                        src={Road_light1}
                        style={{...road_light1_position, position: "fixed"}} alt="Road_light1 "/>
                    <LazyLoadImage
                        src={Road_light2}
                        style={{...road_light2_position, position: "fixed"}} alt="Road_light2"/>
                    <LazyLoadImage
                        src={Road_main}
                        style={{...road_main_position, position: "fixed"}} alt="Road_main"/>
                    <div id={"left"}>
                        <LazyLoadImage
                            src={Left_rock1}
                            style={{...left_rock1_position, position: "fixed"}} alt="left_rock1"/>
                        <LazyLoadImage
                            src={Left_rock2}
                            style={{...left_rock2_position, position: "fixed"}} alt="left_rock2"/>
                        <LazyLoadImage
                            src={Left_rock3}
                            style={{...left_rock3_position, position: "fixed"}} alt="left_rock3"/>
                        <LazyLoadImage
                            src={Left_rock4}
                            style={{...left_rock4_position, position: "fixed"}} alt="left_rock4"/>
                        <LazyLoadImage
                            src={Left_rock5}
                            style={{...left_rock5_position, position: "fixed"}} alt="left_rock5"/>
                        <LazyLoadImage
                            src={Left_rock6}
                            style={{...left_rock6_position, position: "fixed"}} alt="left_rock6"/>
                        <LazyLoadImage
                            src={Left_rock7}
                            style={{...left_rock7_position, position: "fixed"}} alt="left_rock7"/>
                    </div>
                    <div id={"right"}>
                        <LazyLoadImage
                            src={Right_rock1}
                            style={{...right_rock1_position, position: 'fixed' as 'fixed'}} alt="Right_rock1"/>
                        <LazyLoadImage
                            src={Right_rock2}
                            style={{...right_rock2_position, position:'fixed' as 'fixed'}} alt="Right_rock2"/>
                        <LazyLoadImage
                            src={Right_rock3}
                            style={{...right_rock3_position, position: "fixed"}} alt="Right_rock3"/>
                        <LazyLoadImage
                            src={Right_rock4}
                            style={{...right_rock4_position, position: "fixed"}} alt="Right_rock4"/>
                        <LazyLoadImage
                            src={Right_rock5}
                            style={{...right_rock5_position, position: "fixed"}} alt="Right_rock5"/>
                        <LazyLoadImage
                            src={Right_wood}
                            style={{...right_wood_position, position: "fixed"}} alt="right_wood"/>
                        <LazyLoadImage
                            src={Right_light}
                            style={{...right_light1_position, position: "fixed"}} alt="right_light1"/>
                    </div>
                </div>

            </>)}

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
            {threshold: 0.1} // 当图片可见性达到 10% 时加载
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
        <img ref={imgRef} loading={"lazy"} src={isVisible ? src : "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="} alt={alt} style={style}/>
    );
};