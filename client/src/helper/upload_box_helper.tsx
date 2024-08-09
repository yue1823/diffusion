
import {Col, Collapse, Row, theme, Image, Card, Segmented, Button} from "antd";
import React, {ReactNode, useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import { ToastContainer, toast } from "react-toastify";
import {  Container } from "reactstrap"; // 假設你使用了 reactstrap
import {Content} from "antd/lib/layout/layout";
import APT_logo from "../logo/aptos-apt-logo.svg"
import '../css_/rainbow_button.css';
import { motion } from "framer-motion";
import {Box} from "@mui/material";
const box_style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    borderRadius: 10,
    bgcolor: 'background.paper',
    backgroundColor:"#aaa9a9",
    height:450,
    boxShadow: 2,
    p: 4,
};
const Helper_upload_box:React.FC<{left_url:string,right_url:string }> = ({ left_url,right_url}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return(
        <>
            <Col span={8}>
                <motion.div
                    animate={{x: [null, 100, 0],y:[null, 100, 0]}}
                    whileHover={{ scale: [null, 1.5, 1.4],zIndex: 1000,position: 'relative'   }}
                    transition={{ duration: 0.3 }}
                >
                        <Card style={{height: 180}} onClick={value=>{setOpen(true)}}>
                            <Row>
                                <Col>

                                </Col>
                            </Row>
                        </Card>
                </motion.div>
                <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                    <Box sx={box_style}>
                        <ContextExample/>
                    </Box>
                </Modal>
            </Col>
        </>
    );
};
type CountContextType = [number, React.Dispatch<React.SetStateAction<number>>];

// 使用 React.createContext 創建上下文，並設置默認值為 null
const CountContext = React.createContext<CountContextType | null>(null);

// 自定義 hook，方便從上下文中獲取值
function useCount() {
    const context = React.useContext(CountContext);
    if (!context) {
        throw new Error("useCount must be used within a CountProvider");
    }
    return context;
}

// 定義 CountProvider 組件的 props 類型
interface CountProviderProps {
    children: ReactNode;
}

function CountProvider({ children }: CountProviderProps) {
    const [count, setCount] = React.useState<number>(0);

    return (
        <CountContext.Provider value={[count, setCount]}>
            {children}
        </CountContext.Provider>
    );
}

function Counter() {
    const [count, setCount] = useCount();
    const increment = () => setCount((c) => c + 1);

    return <Button onClick={increment}>Increment {count}</Button>;
}

function CountDisplay() {
    const [count] = useCount();
    return <div>The current counter count is {count}</div>;
}

 const ContextExample = () => {
    const displayToast = () => {
        toast(<CountDisplay />);
    };

    return (
        <CountProvider>
            <Container>
                <Counter />
                <button onClick={displayToast} className={"rainbow"}>
                    Display toast
                </button>
            </Container>
            <ToastContainer autoClose={false} draggable={false} />
        </CountProvider>
    );
};
export default Helper_upload_box;