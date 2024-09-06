import App from "@/src/App.tsx";
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Website_page from './website/website_page';
import Tel_create_bet from "./telegrame_page/telegrame_create_bet";

// import { isTMA } from '@tma.js/sdk';

const TelegramDetection: React.FC <{}>= ({}) => {
    const [isTelegram, setIsTelegram] = useState(false);
    
    // const a = async () => {
    //     // setIsTelegram(await isTMA())
    //
    // }

    useEffect(() => {
        setIsTelegram(false)
        console.log(`telegrame : ${isTelegram}`)
    }
    , [isTelegram]);

    return (
        <>
            {isTelegram === null ? (
                <></> // 或者你可以放一些占位符
            ) : isTelegram ? (
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
        </>
    );
};

export default TelegramDetection;
