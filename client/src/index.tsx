import React from 'react';
import ReactDOM from 'react-dom/client';
import { PetraWallet } from "petra-plugin-wallet-adapter";
// import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

// import { PontemWalletAdapter } from '@pontem/aptos-wallet-adapter';

//     HippoWalletAdapter,
//     AptosWalletAdapter,
//     HippoExtensionWalletAdapter,
//     MartianWalletAdapter,
//     FewchaWalletAdapter,
//     SpikaWalletAdapter,
//     RiseWalletAdapter,
//     FletchWalletAdapter,
//     WalletProvider

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
import {pushRotate as Menu} from "react-burger-menu";
import Website_page from "./website/website_page";

import {AptosWalletAdapterProvider} from "@aptos-labs/wallet-adapter-react";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
 const wallets = [new PetraWallet()];
// const wallets = [
//     new PontemWalletAdapter(),
//     new HippoWalletAdapter(),
//     new MartianWalletAdapter(),
//     new AptosWalletAdapter(),
//     new FewchaWalletAdapter(),
//     new HippoExtensionWalletAdapter(),
//     new SpikaWalletAdapter(),
//     new RiseWalletAdapter(),
//     new FletchWalletAdapter()
// ];
root.render(
    <div className={"main-background"}>
        {/*<AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>*/}
        {/*    <WalletProvider*/}
        {/*        wallets={wallets}*/}
        {/*        autoConnect={true | false} /** allow auto wallet connection or not */}
        {/*        onError={(error: Error) => {*/}
        {/*            console.log('Handle Error Message', error);*/}
        {/*        }}>*/}

        <AptosWalletAdapterProvider plugins={wallets}>
                <React.StrictMode>
                        <Router>

                            <Routes>
                                <Route  index path="/*" element={<App id={"page-wrap"}/>}/>


                                <Route  path="/website" element={<Website_page/>}/>
                            </Routes>

                        </Router>
                </React.StrictMode>
        </AptosWalletAdapterProvider>
                {/* your website */}
            {/*// </WalletProvider>*/}

            {/*</AptosWalletAdapterProvider>*/}
    </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
