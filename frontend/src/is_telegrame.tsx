import App from "@/src/App.tsx";
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Website_page from './website/website_page';
import Tel_create_bet from "./telegrame_page/telegrame_create_bet";
import {isMobile} from 'react-device-detect';

import { isTMA } from '@tma.js/sdk';
import Is_telegrame_web_app from "./telegrame_page/is_telegrame_web_app";
import { ToastContainer } from "react-toastify";

const TelegramDetection: React.FC <{}>= ({}) => {
    const [isTelegram, setIsTelegram] = useState(false);
    const [is_mobile,set_is_mobile]=useState(false);
    const a = async () => {
        setIsTelegram(await isTMA())
        console.log(`enter to telegrame `)
        setIsTelegram(true)
    }

    const check_is_mobile =async () =>{
        if(isMobile){
            set_is_mobile(true)
        }
     }
    useEffect(() => {
        check_is_mobile()
        a()
        //setIsTelegram(true)

    }
    , [isTelegram]);

    return (
        <>
            {isTelegram?<>
            <Is_telegrame_web_app/>
            </>:<>
                    {is_mobile === null ? (
                        <></> // 或者你可以放一些占位符
                    ) : is_mobile ? (
                        <>
                            <Tel_create_bet/>
                        </>
                    ) : (
                        <>
                            <Router>
                                <Routes>
                                    <Route path="/*" element={<App id={"page-wrap"}/>}/>
                                    <Route path="/diffusion/website" element={<Website_page/>}/>
                                </Routes>
                            </Router>
                        </>
                    )}
            </>}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default TelegramDetection;
