import App from "@/src/App.tsx";
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Website_page from './website/website_page';
import Tel_create_bet from "./telegrame_page/telegrame_create_bet";
declare global {
    interface Window {
        opera?: any; // 如果 `pera` 是可选的，用 `?` 标记它
    }
}
const TelegramDetection: React.FC <{}>= ({}) => {
    const [isTelegram, setIsTelegram] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (userAgent.includes('Telegram')) {
            setIsTelegram(true);
        }
    }, []);

    return (
        <div>
            {isTelegram ? (
                <Tel_create_bet/>
            ) : (
                <Router >
                    <Routes>
                        <Route path="/*" element={<App id={"page-wrap"}/>}/>
                        <Route path="/website" element={<Website_page/>}/>
                    </Routes>
                </Router>
            )}
        </div>
    );
};

export default TelegramDetection;
