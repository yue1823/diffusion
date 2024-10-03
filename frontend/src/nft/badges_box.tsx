import {Col ,Image} from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';

interface Badges{
    Name : string;
    url : string;
}
interface BadgexBoxProps {
    badges: Badges;
    onBadgeClick: (badge: Badges) => void;
}
const Badgex_box: React.FC<BadgexBoxProps>= ({ badges, onBadgeClick })=>{
    useEffect(() => {
        console.log('badges click ', badges);
        //
        // console.log("link",badges.url)
        // console.log("name",badges.Name)
    }, [badges]);

    return(
        <>

            <Col span={7} offset={1}
                 style={{}}>


                    <motion.div
                        animate={{x: [null, 100, 0], y: [null, 100, 0]}}
                        whileHover={{scale: [null, 1.1, 1.1], zIndex: 1000, position: 'relative'}}
                        transition={{duration: 0.3}}
                        onClick={() => onBadgeClick(badges)}
                    >
                        <motion.div className={"box"}
                                    whileHover={{scale: 1.03}}
                                    whileTap={{scale: 0.95}}
                                    transition={{type: "spring", stiffness: 400, damping: 25}}

                        >
                            <div style={{
                                backgroundColor: "#dfdfdf",
                                borderRadius: 5,
                                width: "130%",
                                height: 160,
                                padding: 10
                            }}>
                                {badges.url ? (
                                    <Image
                                        fallback="https://github.com/yue1823/diffusion/blob/main/client/src/art/diffusion4.png?raw=true"
                                        src={badges.url}
                                        style={{height: "inherit", width: "inherit"}}
                                        preview={false}
                                    />
                                ) : (
                                    <p>Loading...</p>
                                )}
                                <p>{badges.Name}</p>
                            </div>
                        </motion.div>
                    </motion.div>

            </Col>
        </>
    )
};
export default Badgex_box;