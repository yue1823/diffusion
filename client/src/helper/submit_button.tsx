import React, {useRef, useEffect, useState, forwardRef, useImperativeHandle} from 'react';
import anime from 'animejs';
import '../css_/submit_button.css';
import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {message} from "antd";


const ButtonWithProgress = forwardRef((props, ref) => {
    const { account, signAndSubmitTransaction } =useWallet() ;
    const buttonRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const [period,set_period]=useState(false);

    useImperativeHandle(ref, () => ({
        playAnimation() {
            return new Promise<void>((resolve, reject) => {
        const pathEl = pathRef.current;
        if(pathEl){
            const offset = anime.setDashoffset(pathEl!);
            pathEl?.setAttribute('stroke-dashoffset', offset.toString());

            const basicTimeline = anime.timeline({
                autoplay: false,
            });



            basicTimeline
                .add({

                    targets: textRef.current,
                    duration: 1,
                    opacity: '0'
                })
                .add({
                    targets: buttonRef.current,
                    duration: 2300,
                    height: 10,
                    width: 300,
                    backgroundColor: '#2B2D2F',
                    border: '0',
                    borderRadius: 100
                })
                .add({
                    targets: progressBarRef.current,
                    duration: 2000,
                    width: 800,
                    easing: 'linear'
                })
                .add({
                    targets: buttonRef.current,
                    width: 0,
                    duration: 1
                })
                .add({
                    targets: progressBarRef.current,
                    width: 80,
                    height: 80,
                    delay: 500,
                    duration: 750,
                    borderRadius: 80,
                    backgroundColor: '#71DFBE'
                })
                .add({
                    targets: pathEl,
                    strokeDashoffset: [offset, 0],
                    duration: 200,
                    easing: 'easeInOutSine'
                });


            const handleClick = () => {
                basicTimeline.play();
            };
            basicTimeline.play();
            buttonRef.current?.addEventListener('click', handleClick);
            textRef.current?.addEventListener('click', handleClick);

            return () => {
                buttonRef.current?.removeEventListener('click', handleClick);
                textRef.current?.removeEventListener('click', handleClick);
            };
        }else{console.error('pathRef.current is null');}
            });
        },
    }));

    return (
       <>


                   <div className="button1" ref={buttonRef}>
                       <div className="text1" ref={textRef}>Submit</div>
                   </div>

                   <div className="progress-bar" ref={progressBarRef}></div>
                   <svg viewBox="0 0 25 30" style={{position: "absolute", left: 347, top: -14}}>
                       <path ref={pathRef} className="check st0" d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2"/>
                   </svg>
           {period && (<>
               </>)}


       </>
    );
});

export default ButtonWithProgress;
