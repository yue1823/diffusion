import React from 'react';
import ReactDOM from 'react-dom/client';
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import App from './App';
import "./css_folder/App.css"
import reportWebVitals from './reportWebVitals';
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import './css_folder/global.css';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const wallets = [new PetraWallet()];
root.render(
    <div className={"main-background"}>
        <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
                <React.StrictMode>

                </React.StrictMode>
                <App />
            </AptosWalletAdapterProvider>
    </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
