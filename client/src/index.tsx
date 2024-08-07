import React from 'react';
import ReactDOM from 'react-dom/client';
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import App from './App';
import "./css_folder/App.css"
import reportWebVitals from './reportWebVitals';
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import './css_folder/global.css';
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import Main_content from "./content/content";
import Swap_page from "./swap_page";
import Bet_page from "./Bet_card/Bet_page";
import Admin_page from "./admin/admin_page";
import Website_page from "./website/website_page";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const wallets = [new PetraWallet()];
root.render(
    <div className={"main-background"}>
        <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
                <React.StrictMode>
                    <Router>
                        <Routes>
                            <Route  index path="/*" element={<App />}/>
                        </Routes>
                        <Routes>
                            <Route  path="/website" element={<Website_page/>}/>
                        </Routes>

                    </Router>
                </React.StrictMode>
            </AptosWalletAdapterProvider>
    </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
