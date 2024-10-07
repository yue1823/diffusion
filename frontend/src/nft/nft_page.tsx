
import {Col, Dropdown, Row, Segmented, message,Steps, theme, Badge} from "antd";
import React, { useEffect ,useState} from 'react';
import { Carousel,Image } from "antd";
import {Content} from "antd/lib/layout/layout";
import { motion } from "framer-motion";
import {InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import {Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { diffusion } from "../setting";
import Badgex_box from "./badges_box";
import {ArrowLeftOutlined, ArrowRightOutlined, DoubleRightOutlined, InfoCircleOutlined, LeftOutlined,
    RedoOutlined, RightOutlined } from "@ant-design/icons";
import "../css_/進度.css";

import type { MenuProps } from 'antd';

const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <p>
                You can turn your NFT (Diffusino Badges Collision) to diffusion Badges
            </p>
        ),
    },]
const contentStyle: React.CSSProperties = {
    paddingLeft: 10,
    height: '400px',
    color: '#fff',
    maxWidth: "98%",
    maxHeight: "400px",
    textAlign: 'center',
    background: '#dfdfdf',
    borderRadius: 10,
    width: "98%"
};
interface Fetch_mint_badges{
    save_Badges:Badges,
    save_allow_list: string[],
    save_can_mint:boolean,
    save_list: any
}
interface Badges {
    Name: string;
    url: string;
}

interface TokenData {
    collection_id: string;
    current_collection: {
        collection_name: string;
        creator_address: string;
        uri: string;
    };
    token_name: string;
    token_data_id: string;
    token_uri: string;
}

interface CurrentTokenOwnership {
    current_token_data: TokenData;
    owner_address: string;
    amount: number;
}

interface GraphQLResponse {
    data: {
        current_token_ownerships_v2: CurrentTokenOwnership[];
    };
}

const empty_Badges: Badges = {
    Name: "",
    url: ""
}
const aptosConfig = new AptosConfig({network: Network.TESTNET});
const aptos = new Aptos(aptosConfig);
const NFT_page:React.FC<{}> = ({ }) => {
    const { account, signAndSubmitTransaction } =useWallet() ;
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const text_style = {
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '2px 4px 6px rgba(0, 0, 0, 0.3)', // 陰影效果
        transform: 'translateY(-2px)', // 上升一點點的效果
        transition: 'transform 0.2s ease', // 增加平滑過渡效果
    };
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [button_loading, set_button_Loading] = useState(false);
    const [result, setResult] = useState<null | boolean>(null);
    const [anime_finish_load,set_anime_finish_load] =useState(false);
    const handleClick =  async () => {
        if (!account) return [];
        if (fetch_mint_data[current_mint_page].save_can_mint == undefined) {
            return;
        }
        if (fetch_mint_data[current_mint_page].save_can_mint == false) {
            message.error("This badges not private mint")
            return;
        }
        // set_return_element(return_mint_element())
        set_button_Loading(true); // 开始加载动画
        setResult(null);  // 重置结果
        const MIN_LOADING_TIME = 1000;
        const startTime = Date.now();
        const elapsedTime = Date.now() - startTime;
        const delay = Math.max(MIN_LOADING_TIME - elapsedTime, 0);
        // const delayPromise = new Promise((resolve) => setTimeout(resolve, 2000)); // 固定2秒的延迟
        try {
            //模拟异步操作，例如sync数据
            await aptos.view({
                payload: {
                    function: diffusion.function.check_is_white_list(),
                    functionArguments: [account.address, fetch_mint_data[current_mint_page].save_Badges.Name]
                }
            }).then(respone => {
                console.log("white list", respone)

                setTimeout(() => {
                    setResult(respone[0] as boolean);
                    set_button_Loading(false);
                    set_anime_finish_load(true)
                }, delay);
            });
            // setResult(true);
        } catch (error) {
            setResult(false); // 错误处理
        } finally {
        }

        // 动画完成
        // set_return_element(return_mint_element())
    };
    useEffect(() => {
        set_return_element(return_mint_element())
        set_anime_finish_load(false)
    }, [result]);
    // const handleClick = () => {
    //     set_button_Loading(true); // 设置为加载状态
    //     setResult(null); // 重置结果
    //
    //     const MIN_LOADING_TIME = 2000; // 最小加载时间
    //
    //     const startTime = Date.now();
    //     const elapsedTime = Date.now() - startTime;
    //     const delay = Math.max(MIN_LOADING_TIME - elapsedTime, 0);
    //
    //     setTimeout(() => {
    //         setResult(true);
    //         set_button_Loading(false); // 加载结束
    //     }, delay);
    //
    // };
    const mint_badges = async() =>{
        if (!account)return[];
        if(fetch_mint_data[current_mint_page].save_Badges.Name == undefined)return;
        if(fetch_mint_data.length == 0 )return ;
        if(fetch_mint_data[current_mint_page].save_can_mint == true){
            let whitelist_ = await aptos.view({payload:{
                    function:diffusion.function.check_is_white_list(),
                    functionArguments:[account.address, fetch_mint_data[current_mint_page].save_Badges.Name]
                }})
            if(whitelist_[0] === false){
                message.error("Sorry you are not eligble")
                return
            }
        }
        const transaction: InputTransactionData = {
            data: {
                function:diffusion.function.mint_badges(),
                typeArguments:[],
                functionArguments:[fetch_mint_data[current_mint_page].save_Badges.Name]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;

            message.success(
                <span>
                            hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                        </span>
            )
        } catch (error: any) {
            message.error(`please try again`)
        }finally {
            set_return_element(return_mint_element())
            set_anime_finish_load(false)
        }
    }

    const contentStyle_steps: React.CSSProperties = {
        lineHeight: '160px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 10,
        height:"200px"
    };
    const [status ,set_status]=useState<string>('My Badges');
    const [return_element , set_return_element]=useState<JSX.Element>(<></>);
     //const [isHovered, setIsHovered] = useState<boolean>(false);
     const [user_badges_vector,set_user_badges_vector]=useState<[Badges[]]>([[{Name:'',url:''}]]);
    const [nfts, setNfts] = useState<CurrentTokenOwnership[]>([]);
    const [selectedBadge, setSelectedBadge] = useState<Badges>(empty_Badges);
    const [loading, setLoading] = useState(true);
    const [current_page ,set_current_page]=useState(0);
    const [total_page ,set_total_page]=useState(1);
    const [choose,set_choose]=useState('My Badges');
    const [select_nft,set_select_nft]=useState<CurrentTokenOwnership>();
    const [current_mint_page,set_current_mint_page]=useState(0);
    const [total_mint_page,set_total_mint_page]=useState(0);
    const [fetch_mint_data,set_fetch_mint_data]=useState<Fetch_mint_badges[]>([]);
    const click_next_mint_page = (key:number) =>{
        // console.log('current page key',key,current_mint_page)
        // console.log('current page total page',current_mint_page,total_mint_page)
        if(key === -1){
            set_current_mint_page(Math.max(current_mint_page-1,0))
        }else if (key === 1){
            set_current_mint_page( Math.min(current_mint_page+1,total_mint_page-1))
        }
    }
    useEffect(() => {
        set_return_element(return_mint_element())
        setResult(null);  // 重置结果
    }, [current_mint_page]);
    const handleBadgeClick = (badge: Badges) => {
        setSelectedBadge(badge);
        //console.log("Badge clicked outside :", badge);
    };
    const return_mint_badges_list = async() =>{
        let respone = await aptos.view({
            payload:{
                function:diffusion.function.return_mint_badges_list(),
                functionArguments:[]
            }});
        respone.map((data,_) => {

            set_total_mint_page((data  as Fetch_mint_badges[]).length);
            set_fetch_mint_data((data  as Fetch_mint_badges[]));
            console.log('mint badges list',data)
        })
    }


    const steps = [
        {
            title: 'First',
            content: <>
                <div style={{paddingTop:20,paddingLeft:50}}>
                    <div style={{
                        width: "100px",
                        height: "130px",
                        backgroundColor: "rgba(244,244,244,0.91)",
                        borderRadius: 5,
                        paddingTop: 7,
                        paddingLeft: 7,

                    }}>
                        <Image style={{width: "90%", height: "90%", position: "relative", top: -1}} preview={false}
                               fallback="https://github.com/yue1823/diffusion/blob/main/client/src/art/diffusion4.png?raw=true"

                        ></Image>
                        <h1 style={{
                            right: 4,
                            top: "-110%",
                            position: "relative",
                            color: "black",
                            fontSize: 20,

                        }}>Badges</h1>
                    </div>
                    <p style={{top: "-150px",
                        position: "relative",}}>Select a Nft</p>
                    <p style={{top: "-220px",right:10,
                        position: "relative",}}>(We will turn it to be a badges ,  then save it to your account)</p>
                </div>

            </>,
        },
        {
            title: 'Second',
            content: <>
                Submit Transaction
                <br></br>
                <motion.div className={"box"}
                            whileHover={{scale: 1.03}}
                            whileTap={{scale: 0.95}}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 50
                            }}
                            onClick={() => {on_click_submit_nft_to_badges()}}
                >
                    <button className={"rainbow"} style={{position: "relative", top: "-100px", left: 1}}>Submit</button>
                </motion.div>

            </>,
        },
        {
            title: 'Last',
            content: <>
                Congulateion, you turned it to NFT.
                <br></br>
                <motion.div className={"box"}
                            whileHover={{scale: 1.03}}
                            whileTap={{scale: 0.95}}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 50
                            }}
                            onClick={() => {
                                set_return_element(return_nft_vector())
                            }}
                >
                   <p style={{top: "-220px",right:10,
                       position: "relative",color:"rgba(5,39,189,0.94)"}}>View</p>
                </motion.div>

            </>,
        },
    ];
    const items_steps = steps.map((item) => ({key: item.title, title: item.title}));
    const on_click_submit_nft_to_badges = async () => {
        if (select_nft == undefined) return [];
        if (!account) return [];
        const transaction: InputTransactionData = {
            data: {
                function:diffusion.function.turn_nft_to_badges(),
                typeArguments:[],
                functionArguments:[select_nft.current_token_data.token_data_id]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;


            message.success(
                <span>
                            hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                        </span>
            )
        } catch (error: any) {
            message.error(`please try again`)
        }finally {
            fetchNFTs();
            set_return_element(return_my_badged())
            setCurrent(2)
        }
    }

    const submit_badges_to_nft = async() =>{
        if(!account) return[];
        if(selectedBadge === empty_Badges) return ;
        const transaction:InputTransactionData = {
            data: {
                function:diffusion.function.turn_badges_to_nft(),
                typeArguments:[],
                functionArguments:[selectedBadge.Name]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;


            message.success(
                <span>
                            hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                        </span>
            )
        } catch (error: any) {
            message.error(`please try again`)
        }finally {
             await view_user_bedges()
             await fetchNFTs()
             set_return_element(return_nft_vector())
        }
    }
    const view_user_bedges = async() =>{
        if (!account) return [];
        try{
            const  respone = await aptos.view(
                {payload:{
                                function: diffusion.function.user_view_badges(),
                                functionArguments:[account.address],
                }})

            set_user_badges_vector(respone as [Badges[]]);
            //console.log('badges vector',user_badges_vector);
        }catch (e:any){console.log(e)}

    }
    const fetchNFTs = async () => {
        if (!account) return [];
        const query = `
                query GetAccountNfts {
                  current_token_ownerships_v2(
                    where: {amount: {_gt: "0"}, current_token_data: {collection_id: {_eq: "0xdbad00114d36b9a0ac892dfdb6fd98c683237fce3ffe56d75df2f19f463d6631"}}, owner_address: {_eq: "${account.address}"}}
                  ) {
                    current_token_data {
                      collection_id
                      current_collection {
                        collection_name
                        creator_address
                        uri
                      }
                      token_name
                      token_data_id
                      token_uri
                    }
                    owner_address
                    amount
                  }
                }
              `;

        try{
            const response = await fetch(diffusion.indexer_fetch_endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });
            const result: GraphQLResponse = await response.json();
            setNfts(result.data.current_token_ownerships_v2);
            console.log(result.data.current_token_ownerships_v2)
        }catch (e:any){
            console.log(e)
        }finally {
            set_return_element(return_my_badged())
        }
    }
    useEffect(() => {
        if (user_badges_vector.length > 0) {
            set_total_page(user_badges_vector[0].length); // 假设每个 badgesArray 的长度都是相同的
        }
        set_return_element(return_nft_vector())
        // set_return_element(return_my_badged())
    }, [user_badges_vector]);
    useEffect(() => {
        set_return_element(return_my_badged())
    }, [select_nft]);
    useEffect(() => {

    }, [return_element]);
    useEffect(() =>{

        const main_fetch = async () => {
            setLoading(true); // 設置 loading 為 true，開始加載
            try {
                await fetchNFTs(); // 等待 NFT 數據加載完成
                await view_user_bedges(); // 等待 badges 數據加載完成
            } catch (error) {
                console.error('Error loading data:', error); // 處理異常
            } finally {
                setLoading(false); // 所有數據加載完成後，設置 loading 為 false
            }
            return_mint_badges_list()
            setCurrent(0)
        };
        main_fetch()
    },[account])
    useEffect(() => {
        // console.log('selectedBadge outside',selectedBadge)
        // console.log(selectedBadge.Name)
        // console.log(selectedBadge.url)
        set_return_element(return_nft_vector())
    }, [selectedBadge]);

    useEffect(() => {
       // console.log('Updated current page:', current_page);
        set_return_element(return_my_badged() )
    }, [current_page]);
    const return_crousel =()=> {
        //console.log('return crousel',user_badges_vector)

       return(
           <>
               {/*{user_badges_vector.map((badges,index) => {*/}
               {/*    //console.log('map badges' , badges);*/}
               {/*    return (*/}
               {/*        <h3 style={contentStyle} key={index}>*/}
               {/*            <Image*/}
               {/*                fallback="https://github.com/yue1823/diffusion/blob/main/client/src/art/diffusion4.png?raw=true"*/}
               {/*                src={''}>*/}
               {/*            </Image>*/}
               {/*        </h3>*/}
               {/*    );*/}
               {/*})*/}
               {/*}*/}


               {user_badges_vector.map((badgesArray, index) => {
                    console.log('user_badges_vector map',badgesArray)
                   let total_page = badgesArray.length;
                   set_total_page( total_page);
                   return (
                       <>
                           {(badgesArray.length !=0) && (<div key={index}>
                               <h3 style={contentStyle}>
                                   <Image
                                       fallback="https://github.com/yue1823/diffusion/blob/main/client/src/art/diffusion4.png?raw=true"
                                       src={badgesArray[current_page].url}
                                       style={{height: "25vmax", width: "inherit"}}
                                   >
                                   </Image>
                               </h3>
                           </div>)
                           }
                           {(badgesArray.length ==0) && (<div key={index}>
                               <h3 style={contentStyle}>
                                   <Image
                                       fallback="https://github.com/yue1823/diffusion/blob/main/client/src/art/diffusion4.png?raw=true"
                                       style={{height: "25vmax", width: "inherit"}}
                                   >
                                   </Image>
                               </h3>
                           </div>)
                           }
                       </>
                   );
               })}
           </>
       )
    }
    useEffect(() => {
        set_return_element(return_my_badged())
    }, [choose]);
    const return_my_badged = () => {
        return (
            <>
                <Row gutter={[24, 10]}
                     style={{backgroundColor: "#dfdfdf", height: "inherit", borderRadius: 5, padding: 5}}>
                    <Col span={24} style={{height: "6.5%", paddingTop: 8, paddingLeft: 5}}>
                        <Segmented options={["My Badges", "Change"]} block style={{width: "99%"}} onChange={(value) => {
                            //console.log(value)
                            set_choose(value)
                        }}/>
                    </Col>
                    <Col span={24} style={{paddingLeft: 7}}>
                    <div style={{border: "solid 1px", borderColor: "#ededed", width: "98.5%"}}></div>
                    </Col>
                    {choose === "My Badges" ? <>
                        <Col span={24} style={{padding: 1, height: "71%", paddingLeft: 10}}>

                            <Carousel autoplay style={{height: "100%", maxWidth: "100%", maxHeight: "100%", zIndex:100}}
                                      draggable={true}>

                                {return_crousel()}
                                {/*<div>*/}
                                {/*    <h3 style={contentStyle}>*/}
                                {/*        <Image*/}
                                {/*            fallback="https://github.com/yue1823/diffusion/blob/main/client/src/art/diffusion4.png?raw=true"*/}
                                {/*            src={""}*/}
                                {/*            style={{height: "400px", width:"100%",objectFit: "cover"}}*/}
                                {/*        >*/}
                                {/*            1*/}
                                {/*        </Image>*/}
                                {/*    </h3>*/}
                                {/*</div>*/}

                                {/*<div>*/}
                                {/*    <h3 style={contentStyle}>*/}
                                {/*        /!*<Image*!/*/}
                                {/*        /!*    fallback="https://github.com/yue1823/diffusion/blob/main/client/src/art/diffusion4.png?raw=true"*!/*/}
                                {/*        /!*    src={""}*!/*/}
                                {/*        /!*    style={{height: "400px", width: "100%",objectFit: "cover"}}*!/*/}
                                {/*        /!*>*!/*/}
                                {/*        /!*    1*!/*/}
                                {/*        /!*</Image>*!/*/}
                                {/*        2*/}
                                {/*    </h3>*/}
                                {/*</div>*/}
                            </Carousel>

                        </Col>
                        <Col span={24}>
                            <div style={{border: "solid 1px", borderColor: "#ededed", width: "98.5%"}}></div>
                        </Col>
                        <Col span={6}>
                            <button className={"rainbow"} style={{paddingTop:5}} disabled={total_page==0?true:false} onClick={() => {
                                // console.log('total page',total_page)
                                // console.log('click left',current_page)
                                set_current_page(prevPage => Math.max(prevPage - 1, 0)); // 保证最小为 0
                            }}>
                                <ArrowLeftOutlined  style={{fontSize: 30}}/>
                            </button>
                        </Col>
                        <Col span={12}>
                            <h1 style={{
                                position: "relative",
                                top: "4px",
                                right: "40px"
                            }}>{current_page + 1}</h1>
                            <div style={{
                                border: "solid 1px",
                                borderColor: "#706f6f",
                                width: 1,
                                height: "50px",
                                transform: "rotate(40deg)",
                                position: "relative",
                                top: "-13px",
                                left: "200px"
                            }}></div>
                            <h1 style={{
                                position: "relative",
                                top: "-30px",
                                left: "10px"
                            }}>{total_page}</h1>
                            <div style={{position: "absolute", top: "-10px"}}>
                                <motion.div
                                    animate={{x: [null, 101, 0], y: [null, 101, 0]}}
                                    whileHover={{scale: [null, 1, 1], zIndex: 1000, position: 'relative'}}
                                    transition={{duration: 0.3}}
                                    onClick={() => {
                                        view_user_bedges();
                                        //set_return_element(return_my_badged())
                                    }}
                                >
                                    <motion.div className={"box"}
                                                whileHover={{scale: 1.03}}
                                                whileTap={{scale: 0.90}}
                                                transition={{type: "spring", stiffness: 300, damping: 25}}
                                    ><RedoOutlined style={{fontSize: 90}}/></motion.div>
                                </motion.div>
                            </div>


                        </Col>
                        <Col span={6} style={{left: 20}}>
                            <button className={"rainbow"} style={{paddingTop: 5}}
                                    disabled={total_page == 0 ? true : false} onClick={() => {
                                // console.log('total page',total_page)
                                // console.log('click right',current_page)
                                set_current_page(prevPage => Math.min(prevPage + 1, total_page - 1)); // 保证不超过总页数
                            }}>
                                <ArrowRightOutlined style={{fontSize: 30}}/>
                            </button>
                        </Col>
                    </> : <>
                        <Col span={24} style={{height: "93.5%", paddingLeft: 10, left: 10,}}>
                            <Row gutter={[24, 6]} style={{
                        backgroundColor: "#ededed",
                        height: "inherit",
                        width: "99%",
                        borderRadius:10,padding:10,paddingLeft:15}}>
                                <Col span={24}  style={{height:"7%"}}>
                                    <h1 style={{textAlign: "left", fontSize: 20}}>NFT Collision</h1>
                                    <div style={{border: "solid 1px", borderColor: "#b5b3b3", width: "15%"}}></div>
                                    <Dropdown menu={{items}} placement="bottom">
                                        <div style={{textAlign: "right", top: -28, position: "relative", fontSize: 20}}>
                                            <InfoCircleOutlined/></div>
                                    </Dropdown>

                                </Col>
                                <div style={{width:"inherit",height:"inherit",position:"inherit"}}>
                                    <Col span={24} style={{height:"40%"}}>
                                        <div style={{
                                            // border: "solid 10px",

                                            // borderColor: "#9d7553",
                                            backgroundColor: "#ffffff",
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: 5,
                                            overflow: "hidden",
                                            zIndex: 2,
                                            // backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnqnsvxlWf8tf1qQ-OeN6-fdEEg67woR4gyQ&s)",
                                            // backgroundSize: "cover",  // 确保图片覆盖整个 div
                                            // backgroundPosition: "center",  // 让图片居中显示
                                            // backgroundRepeat: "no-repeat",// 防止图片重复
                                            // filter: "brightness(50%)"
                                        }}>
                                            <div style={{
                                                border: "4mm ridge #A98B73",
                                                content: '""',
                                                backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnqnsvxlWf8tf1qQ-OeN6-fdEEg67woR4gyQ&s)",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                                filter: "brightness(50%)",
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                zIndex: 0,  // 确保背景不覆盖内容
                                            }}></div>
                                            {/*<div style={{*/}
                                            {/*    backgroundColor: "rgba(218,218,218,0.5)",  // 白色，透明度50%*/}
                                            {/*    position: "absolute",*/}
                                            {/*    top: 0,*/}
                                            {/*    left: 0,*/}
                                            {/*    width: "100%",*/}
                                            {/*    height: "100%",*/}
                                            {/*    paddingTop: 5,*/}
                                            {/*    paddingLeft: 8*/}
                                            {/*}}></div>*/}
                                            <div style={{ zIndex: 1, paddingTop: 25,paddingLeft: 10}}>
                                                <Row gutter={[24, 6]} style={{paddingRight: 20}}>
                                                    {nfts.map((token, index) => {
                                                        // console.log('token data',token);
                                                        // console.log('token url',token.current_token_data.token_uri)
                                                        return (
                                                            <>
                                                                <Col span={4} >
                                                                    <motion.div
                                                                        animate={{x: [null, 100, 0], y: [null, 100, 0]}}
                                                                        whileHover={{
                                                                            scale: [null, 1.1, 1.1],
                                                                            zIndex: 1000,
                                                                            position: 'relative'
                                                                        }}
                                                                        transition={{duration: 0.3}}
                                                                        onClick={() =>{
                                                                            //console.log('select token',token)
                                                                            if (token != undefined){
                                                                                set_select_nft(token)
                                                                                setCurrent(1)
                                                                            }
                                                                        }}
                                                                    >
                                                                        <motion.div className={"box"}
                                                                                    whileHover={{scale: 1.03}}
                                                                                    whileTap={{scale: 0.95}}
                                                                                    transition={{
                                                                                        type: "spring",
                                                                                        stiffness: 400,
                                                                                        damping: 25
                                                                                    }}

                                                                        >
                                                                            <div style={{
                                                                                width: "inherit",
                                                                                height: "130px",
                                                                                backgroundColor: "rgba(244,244,244,0.91)",
                                                                                borderRadius: 5,
                                                                                paddingTop:7,
                                                                                paddingLeft:7,

                                                                            }}>
                                                                               <Image style={{width:"92%",height:"92%"}} preview={false} fallback="https://github.com/yue1823/diffusion/blob/main/client/src/art/diffusion4.png?raw=true" key={index} src={token.current_token_data.token_uri}></Image>
                                                                                <h1 style={{right:4,top:-3,position:"relative"}}>{token.current_token_data.token_name.slice(17,)}</h1>
                                                                            </div>
                                                                        </motion.div>
                                                                    </motion.div>
                                                                </Col>
                                                            </>
                                                        )
                                                    })}
                                                </Row>
                                            </div>
                                        </div>
                                    </Col>
                                </div>
                                <Col span={7} style={{height: "260px",position:"relative",top:"-56%"}}>
                                    <div style={{

                                        width: "260px",
                                        height: "260px",

                                    }}>
                                        <div style={{
                                            border: "",
                                            backgroundImage: "url(data:image/jpeg;base64,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)",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            backgroundRepeat: "no-repeat",
                                            transform: "scale(1)",
                                            filter: "brightness(70%)",
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "260px",
                                            height: "260px",
                                            zIndex: 0,  // 确保背景不覆盖内容
                                            borderRadius: "100%"
                                        }}></div>
                                        <div style={{
                                            zIndex: 1,
                                            backgroundColor: "rgba(248,248,248,0.88)",
                                            width: "70px",
                                            height: "90px",
                                            left: "32%",
                                            top: "34%",
                                            position: "relative",
                                            borderRadius: 5
                                        }}>
                                            {current == 1 && select_nft != undefined && (
                                                <>
                                                    <Image style={{width: "inherit", height: "70px"}} preview={false}
                                                           fallback="https://github.com/yue1823/diffusion/blob/main/client/src/art/diffusion4.png?raw=true"
                                                           src={select_nft?.current_token_data.token_uri}
                                                    ></Image>
                                                    <h1 style={{top:-6,position:"relative"}}>{select_nft?.current_token_data.token_name.slice(17,)}</h1>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                                <Col span={1} style={{paddingLeft:20}}>
                                    <div style={{border:"solid 1px",height:"230px",width:"1px",backgroundColor:"#c11313",borderColor:"rgba(161,161,161,0.96)",position:"relative",top:"-97%"}}></div>
                                </Col>
                                <Col span={16} >
                                    <Steps current={current} items={items_steps} style={{position:"relative",top:"-99%"}}/>
                                    <div style={{...contentStyle_steps,position:"relative",top:"-99%"}}>{steps[current].content}</div>
                                </Col>

                            </Row>
                        </Col>

                    </>}

                </Row>
            </>
        )
    }

    const return_mint_element =() =>{
        return (
            <>
                <Row gutter={[24, 6]} style={{padding: 2}} justify="center" align="middle">
                    <Col span={24} style={{}}>

                        <Row>
                            <div style={{
                                border: "solid 1px",
                                borderColor: "#ededed",
                                width: "100%",
                                height: "505px",
                                borderRadius: 5,
                                paddingTop: "0.5%",
                                display: "flex",
                                background: "linear-gradient(90deg, rgba(255, 153, 102, 1) 0%, rgba(255, 94, 98, 1) 100%)",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                transition: "background 0.3s ease",
                                color: "white"
                            }}
                            >
                                <Col span={24} style={{position: "absolute",paddingLeft:20,paddingTop:5}}>
                                    <div style={{position:"absolute",left:"70px",width:"100px",top:"-2px"}}>
                                        {fetch_mint_data.length != 0 && (
                                            <>
                                                {fetch_mint_data[current_mint_page].save_can_mint == false && fetch_mint_data[current_mint_page].save_can_mint !=undefined ? <>
                                                    <Badge status="processing" text="Public mint" color="#0ED51AFF" style={{fontSize:20,transform:"scale(2)",color:"white"}} />
                                                </>:<>
                                                    <Badge status="processing" text="Private mint" color="gold" style={{fontSize:20,transform:"scale(2)",color:"white"}} />
                                                </>}
                                            </>
                                        )}

                                    </div>
                                    <div style={{
                                        position:"inherit",
                                        border: "solid 1px",
                                        width: "850px",
                                        display: "inherit",
                                        height: "1px",
                                        borderColor: "#dfdfdf",
                                        top:"40px"
                                    }}></div>
                                </Col>
                                <Col span={2} style={{justifyContent: "left", display: "flex", paddingLeft: 10, alignItems: "center",}}>
                                    <motion.div
                                        animate={{x: [null, 115, 0], y: [null, 115, 0]}}
                                        whileHover={{scale: [null, 1.2, 1.2], zIndex: 1000, position: 'relative'}}
                                        transition={{duration: 0.3}}
                                        onClick={() => {
                                            click_next_mint_page(-1)
                                        }}
                                    >
                                        <motion.div className={"box"}
                                                    whileHover={{scale: 1.3}}
                                                    whileTap={{scale: 0.90}}
                                                    transition={{type: "spring", stiffness: 300, damping: 25}}
                                        >
                                            <LeftOutlined style={{fontSize: 50}}/>
                                        </motion.div>
                                    </motion.div>
                                </Col>
                                <Col span={20} style={{display: "flex", justifyContent: "center", alignItems: "center",}}>
                                    <Row style={{display: "inherit", justifyContent: "inherit", alignItems: "inherit",}}>
                                        <Col span={24} style={{display: "inherit", justifyContent: "inherit", alignItems: "inherit",top:"-20px"}}>
                                            <div style={{
                                                display: "inherit",
                                                justifyContent: "inherit",
                                                alignItems: "inherit",
                                            }}>
                                                {/*<p style={{fontSize: 40}}>You are not eligble</p>*/}
                                                {/*<div style={{*/}
                                                {/*    placeItems: "center",*/}
                                                {/*    color: "white",*/}
                                                {/*    background: "#02040c",*/}
                                                {/*    fontFamily: "Inter, sans-serif",*/}
                                                {/*    fontOpticalSizing: "auto",*/}
                                                {/*    fontWeight: 500,*/}
                                                {/*    fontStyle: "normal",*/}
                                                {/*    WebkitFontSmoothing: " antialiased"*/}
                                                {/*}}>*/}

                                                {/*</div>*/}
                                                <Row>
                                                    {fetch_mint_data.length !=0 &&  (
                                                        <>
                                                            {fetch_mint_data[current_mint_page].save_can_mint == false ? <></>: <>
                                                                <Col span={24} >
                                                                    <button
                                                                        className={`shiny-cta ${button_loading ? 'loading' : ''} ${result === true ? 'checked' : ''} ${result === false ? 'error' : ''}`}
                                                                        onClick={handleClick}
                                                                        disabled={button_loading} // 在 loading 时按钮不可点击
                                                                        style={anime_finish_load == false ?{zIndex: 50}: result === true?{zIndex: 50,left:"125px"}:{zIndex: 50,left:"100px"}}
                                                                    >
                                                                        <span>{button_loading ? 'Syncing...' : result === true ? '' : result === false ? '' : 'Check Whitelist'}</span>
                                                                    </button>
                                                                </Col>
                                                                <Col span={24}>
                                                                    {anime_finish_load === false ? <></> : <>
                                                                        {result === true ? <><p>Congratulation you are
                                                                            eligible</p></> : <><p style={{}}>Sorry you are
                                                                            not eligble</p></>}
                                                                    </>}
                                                                </Col>
                                                            </>}
                                                        </>
                                                    )}
                                                </Row>

                                                {fetch_mint_data.length == 0 && (
                                                    <p>Loading ....</p>
                                                )}
                                            </div>
                                        </Col>
                                        <Col span={24} style={{
                                            display: "inherit",
                                            justifyContent: "inherit",
                                            alignItems: "inherit",
                                        }}>
                                        {fetch_mint_data.length !=0 &&  (
                                                <Image
                                                    style={{width: "270px", height: "270px"}}
                                                    fallback="data:image/png;base64,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"
                                                    src={fetch_mint_data[current_mint_page].save_Badges.url}></Image>
                                            )}
                                            {fetch_mint_data.length ==0 &&  (
                                                <p>Loading ....</p>
                                            )}

                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={2} style={{justifyContent: "right", display: "flex", paddingRight: 10, alignItems: "center",}}>
                                    <motion.div
                                        animate={{x: [null, 115, 0], y: [null, 115, 0]}}
                                        whileHover={{scale: [null, 1.2, 1.2], zIndex: 1000, position: 'relative'}}
                                        transition={{duration: 0.3}}
                                        onClick={() => {
                                            click_next_mint_page(1)
                                        }}
                                    >
                                        <motion.div className={"box"}
                                                    whileHover={{scale: 1.3}}
                                                    whileTap={{scale: 0.90}}
                                                    transition={{type: "spring", stiffness: 300, damping: 25}}
                                        >
                                            <RightOutlined style={{fontSize: 35}}/>
                                        </motion.div>
                                    </motion.div>

                                </Col>
                            </div>
                        </Row>


                    </Col>


                    <Col span={24}>
                        <motion.div className={"box"}
                                    whileHover={{scale: 1.01}}
                                    whileTap={{scale: 0.95}}
                                    transition={{
                                        type: "spring",
                                        stiffness: 250,
                                        damping: 40
                                    }}
                                    onClick={()=>{mint_badges()}}
                        >
                            <button
                                style={{marginBottom: "10px", width: "890px"}}
                                className={"rainbow"}
                            >
                               Mint
                            </button>
                        </motion.div>
                    </Col>
                </Row>
            </>
    );
    }

    const return_nft_vector = () => {
        if (loading) {
            return <p>Loading badges...</p>;
        }
        //console.log('before map user_badges_vector',user_badges_vector)
        return (
            <>
                <Row gutter={[24, 10]}
                     style={{paddingLeft: 20, paddingTop: 3, backgroundColor: "#dfdfdf", borderRadius: 5, height: 580}}>
                    <Col span={13}>
                        <Row gutter={[24, 6]} style={{
                            height: 550,
                            backgroundColor: "#ededed",
                            borderRadius: 5,
                            width: "100%",
                            paddingTop: 15,
                            paddingRight: 45
                        }}>
                            {/*{user_badges_vector.map((badges, index) => {*/}
                            {/*    //console.log('Mapped badges: ', badges);*/}
                            {/*    // @ts-ignore*/}
                            {/*    return (*/}
                            {/*        <Badgex_box badges={badges[0]} key={index} onBadgeClick={handleBadgeClick} />*/}
                            {/*    );*/}
                            {/*})}*/}
                            {user_badges_vector.map((badgesArray, index) => {
                                return badgesArray.map((badge, badgeIndex) => (
                                    <Badgex_box badges={badge} key={`${index}-${badgeIndex}`}
                                                onBadgeClick={handleBadgeClick}/>
                                ));
                            })}
                        </Row>
                    </Col>
                    <Col span={2}>
                        <DoubleRightOutlined style={{fontSize: 30}}/>
                        <br/>
                        <DoubleRightOutlined style={{fontSize: 30}}/>
                        <br/>
                        <DoubleRightOutlined style={{fontSize: 30}}/>
                    </Col>
                    <Col span={9}>
                        <Row gutter={[24, 10]} style={{
                            height: 550,
                            backgroundColor: "#ededed",
                            borderRadius: 5,
                            width: "100%",
                            paddingLeft: 15,
                            paddingTop: 15
                        }}>
                            <Col span={24}>
                                <Row gutter={[24, 2]} style={{
                                    width: "104%",
                                    backgroundColor: "#686868",
                                    height: "30vmax",
                                    borderRadius: 5,
                                    padding: 7,
                                    paddingTop: 15
                                }}>
                                    <Col span={24} style={{width: "inherit"}}>
                                        <Image src={selectedBadge.url}
                                               fallback={"https://github.com/yue1823/diffusion/blob/main/client/src/art/diffusion4.png?raw=true"}
                                               style={{height: "inherit", width: "inherit", borderRadius: 5}}></Image>
                                    </Col>
                                    <Col span={24} style={{
                                        backgroundColor: "#dfdfdf",
                                        height: "9.5vmax",
                                        borderRadius: 4,
                                        width: "inherit",
                                        paddingTop: 8
                                    }}>
                                        <span style={{
                                            textAlign: "left",
                                            fontSize: 15
                                        }}><h3>Diffusion Badges NFT</h3></span>
                                        <div style={{border: "solid 1px", width: "65%", borderColor: "#959595"}}></div>
                                        <br/>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%"
                                        }}>
                                            <h3 style={{textAlign: "left", fontSize: 13}}>Name :</h3>
                                            <h3 style={{textAlign: "right", fontSize: 13}}>{selectedBadge.Name}</h3>
                                        </div>
                                        <div style={{border: "solid 1px", width: "100%", borderColor: "#959595"}}></div>
                                        <br/>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%"
                                        }}>
                                            <h3 style={{textAlign: "left", fontSize: 13}}>Owner :</h3>
                                            <h3 style={{
                                                textAlign: "right",
                                                fontSize: 13
                                            }}>{account?.address.slice(0, 10)}....{account?.address.slice(55, 66)}</h3>
                                        </div>
                                        <div style={{border: "solid 1px", width: "100%", borderColor: "#959595"}}></div>
                                    </Col>

                                </Row>
                                <br/>
                                <button className={"rainbow"} style={{width: "290px",right:"10px",position:"relative",top:-9}} onClick={() => submit_badges_to_nft()}>Genarte NFT</button>


                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        )
    }
    const change_page = (key: string) => {


        if (key == "My Badges") {
            set_return_element(return_my_badged())
        } else if (key == "Mint") {
            set_return_element(return_mint_element())
        } else if (key == "NFT") {
            set_return_element(return_nft_vector())
        }
    }
    //
    // useEffect(() => {
    //     //console.log(badges_vector.length)
    // }, [badges_vector]);

    return (
        <>
            <Content style={{padding: '15px ', paddingLeft: "3.5%",objectFit: "cover"}}>
                <Row>
                    <Col span={21}>
                        <div
                            style={{

                                minHeight: 580,

                                background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Row gutter={[24,12]} style={{padding:"1%"}}>
                            <Col span={24} style={{paddingLeft:"2%"}}>
                                <p>Badges</p>
                                <div style={{border:"solid 1px",borderColor:"#dfdfdf",width:"99%"}}></div>
                            </Col>
                            <Col span={6} style={{paddingLeft:"3%"}}>
                                <Row gutter={[24,24]} style={{backgroundColor:"#dfdfdf",borderRadius:5,width:"100%",height :580,paddingTop:"6%"}}>
                                    <Col span={24} >
                                        <p style={{...text_style}}>{status}</p>
                                        <div style={{border: "solid 1px", borderColor: "#ededed", width: "98%"}}></div>
                                    </Col>
                                    <Col span={24}>
                                        <motion.div
                                            animate={{x: [null, 100, 0], y: [null, 100, 0]}}
                                            whileHover={{scale: [null, 1.1, 1.1], zIndex: 1000, position: 'relative'}}
                                            transition={{duration: 0.3}}
                                        >
                                            <motion.div className={"box"}
                                                        whileHover={{scale: 1.03}}
                                                        whileTap={{scale: 0.95}}
                                                        transition={{type: "spring", stiffness: 400, damping: 25}}
                                                        onClick={() => {set_status("My Badges");;change_page("My Badges")}}
                                            >
                                                <p style={{...text_style}}>My Badges</p>
                                            </motion.div>
                                        </motion.div>
                                    </Col>
                                    <Col span={24}>
                                        <motion.div
                                            animate={{x: [null, 100, 0], y: [null, 100, 0]}}
                                            whileHover={{scale: [null, 1.1, 1.1], zIndex: 1000, position: 'relative'}}
                                            transition={{duration: 0.3}}
                                        >
                                            <motion.div className={"box"}
                                                        whileHover={{scale: 1.03}}
                                                        whileTap={{scale: 0.95}}
                                                        transition={{type: "spring", stiffness: 400, damping: 25}}
                                                        onClick={() => {set_status("Mint");change_page("Mint");}}
                                            >
                                                <p style={{...text_style}}>Mint</p>
                                            </motion.div>
                                        </motion.div>
                                    </Col>
                                    <Col span={24}>
                                        <motion.div
                                            animate={{x: [null, 100, 0], y: [null, 100, 0]}}
                                            whileHover={{scale: [null, 1.1, 1.1], zIndex: 1000, position: 'relative'}}
                                            transition={{duration: 0.3}}
                                        >
                                            <motion.div className={"box"}
                                                        whileHover={{scale: 1.03}}
                                                        whileTap={{scale: 0.95}}
                                                        transition={{type: "spring", stiffness: 400, damping: 25}}
                                                        onClick={() => {set_status("NFT");change_page("NFT");}}
                                            >
                                                <p style={{...text_style}}>NFT</p>
                                            </motion.div>
                                        </motion.div>
                                    </Col>
                                </Row>


                            </Col>
                            <Col span={18} style={{height: 580, paddingRight: "3%"}}>
                                {return_element}
                            </Col>
                        </Row>

                    </div>
                    </Col>
                </Row>
            </Content>
        </>
    );
}

export default NFT_page;



