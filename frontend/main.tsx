import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "@/src/App.tsx";

// Internal components
import { Toaster } from "@/components/ui/toaster.tsx";
import { WalletProvider } from "@/components/WalletProvider.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Website_page from "@/src/website/website_page.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
          <React.StrictMode>
              <Router>
                  <Routes>
                      <Route  path="/*" element={<App id={"page-wrap"}/>}/>
                      <Route  path="/website" element={<Website_page/>}/>
                  </Routes>

              </Router>
          </React.StrictMode>
        <Toaster />
      </QueryClientProvider>
    </WalletProvider>
  </React.StrictMode>,
);
