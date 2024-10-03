
import {Col, Row, Segmented, message, theme} from "antd";
import React, { useEffect ,useState} from 'react';
import { Carousel,Image } from "antd";
import {Content} from "antd/lib/layout/layout";
import { motion } from "framer-motion";
import {InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import {Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { diffusion } from "../setting";
import Badgex_box from "./badges_box";
import {ArrowLeftOutlined, ArrowRightOutlined, DoubleRightOutlined } from "@ant-design/icons";


const contentStyle: React.CSSProperties = {
    paddingLeft:10,
    height: '400px',
    color: '#fff',
    maxWidth:"98%",
    maxHeight:"400px",
    textAlign: 'center',
    background: '#dfdfdf',
    borderRadius:10,
    width:"98%"
};

interface Badges{
    Name : string;
    url : string;
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
const empty_Badges:Badges = {
    Name:"",
    url:""
}
const aptosConfig = new AptosConfig({ network: Network.TESTNET});
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

    const [status ,set_status]=useState<string>('My Badges');
    const [return_element , set_return_element]=useState<JSX.Element>(<></>);
    const [carousel_return,set_carousel_return]=useState<JSX.Element>(<></>);
     const [isHovered, setIsHovered] = useState<boolean>(false);
     const [user_badges_vector,set_user_badges_vector]=useState<[Badges[]]>([]);
    const [nfts, setNfts] = useState<CurrentTokenOwnership[]>([]);
    const [choose_badges ,set_choose_badges] = useState<Badges>(empty_Badges);
    const [selectedBadge, setSelectedBadge] = useState<Badges>(empty_Badges);
    const [loading, setLoading] = useState(true);
    const [current_page ,set_current_page]=useState(0);
    const [total_page ,set_total_page]=useState(1);
    const [choose,set_choose]=useState('My Badges');
    const handleBadgeClick = (badge: Badges) => {
        setSelectedBadge(badge);
        //console.log("Badge clicked outside :", badge);
    };


    const handleMouseOver = () => {
        console.log(isHovered);
        console.log("Mouse is over the button");
        setIsHovered(true);

    };


    const handleMouseOut = () => {
        console.log(isHovered);
        console.log("Mouse left the button");
        setIsHovered(false);
    };

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
    useEffect(() => {
        if (user_badges_vector.length > 0) {
            set_total_page(user_badges_vector[0].length); // 假设每个 badgesArray 的长度都是相同的
        }

        set_return_element(return_my_badged())
    }, [user_badges_vector]);
    useEffect(() =>{
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
                //console.log(result.data.current_token_ownerships_v2)
            }catch (e:any){
                console.log(e)
            }finally {
                set_return_element(return_nft_vector())
            }
        }
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
        };
        main_fetch()
    },[account])
    useEffect(() => {
        console.log('selectedBadge outside',selectedBadge)
        console.log(selectedBadge.Name)
        console.log(selectedBadge.url)
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
                   let total_page = badgesArray.length;
                   set_total_page( total_page);
                   return (
                       <div key={index}>
                           <h3 style={contentStyle}>
                               <Image
                                   fallback="https://github.com/yue1823/diffusion/blob/main/client/src/art/diffusion4.png?raw=true"
                                   src={badgesArray[current_page].url}
                                   style={{height: "40vmax", width: "inherit"}}
                               >
                               </Image>
                           </h3>
                       </div>
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
                            console.log(value)
                            set_choose(value)
                        }}/>
                    </Col>
                    <Col span={24} style={{paddingLeft: 7}}>
                    <div style={{border: "solid 1px", borderColor: "#ededed", width: "98.5%"}}></div>
                    </Col>
                    {choose === "My Badges" ? <>
                        <Col span={24} style={{padding: 1, height: "71%", paddingLeft: 10}}>
                            <Carousel autoplay style={{height: "100%", maxWidth: "100%", maxHeight: "100%"}}
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
                            <button className={"rainbow"} style={{paddingTop:5}} onClick={() => {
                                // console.log('total page',total_page)
                                // console.log('click left',current_page)
                                set_current_page(prevPage => Math.max(prevPage - 1, 0)); // 保证最小为 0
                            }}>
                                <ArrowLeftOutlined  style={{fontSize: 30}}/>
                            </button>
                        </Col>
                        <Col span={12}></Col>
                        <Col span={6}>
                            <button className={"rainbow"} style={{paddingTop:5}} onClick={() => {
                                console.log('total page',total_page)
                                console.log('click right',current_page)
                                set_current_page(prevPage => Math.min(prevPage + 1, total_page - 1)); // 保证不超过总页数
                            }}>
                                <ArrowRightOutlined style={{fontSize: 30}}/>
                            </button>
                        </Col>
                    </> : <></>}

                </Row>
            </>
        )
    }

    const return_mint_element = (
        <>
            <Row gutter={[24, 6]} style={{padding: 2}} justify="center" align="middle">
                <Col span={24}>
                    <div style={{
                        border: "solid 1px",
                        borderColor: "#ededed",
                        width: "98%",
                        height: "4vmax",
                        borderRadius: 5,
                        paddingTop: "0.5%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: isHovered
                            ? "linear-gradient(90deg, rgba(98, 182, 255, 1) 0%, rgba(153, 102, 255, 1) 100%)"
                            : "linear-gradient(90deg, rgba(255, 153, 102, 1) 0%, rgba(255, 94, 98, 1) 100%)",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "background 0.3s ease",
                        color: "white"
                    }}
                    >
                        <p>
                            Now Mint
                        </p>
                    </div>
                </Col>
                <Col span={24}>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Image
                            fallback="data:image/png;base64,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"
                                src={""}></Image>
                    </div>
                </Col>
                <Col span={24}>
                    <div style={{display: "flex", gap: "10px"}}>
                        {[...Array(4)].map((_, index) => (
                            <div key={index}
                                 style={{
                                     border: "solid 1px",
                                     borderColor: "#ededed",
                                     width: "23%",  // To ensure they all fit in one row
                                     height: "4vmax",
                                     borderRadius: 5,
                                     display: "flex",
                                     justifyContent: "center",
                                     alignItems: "center",
                                     background: isHovered
                                         ? "linear-gradient(90deg, rgba(98, 182, 255, 1) 0%, rgba(153, 102, 255, 1) 100%)"
                                         : "linear-gradient(90deg, rgba(255, 153, 102, 1) 0%, rgba(255, 94, 98, 1) 100%)",
                                     boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                     transition: "background 0.3s ease"
                                 }}
                            >
                                Box {index + 1}
                            </div>
                        ))}
                    </div>
                </Col>
                <Col>
                    <button
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                        style={{padding: "10px 20px", marginBottom: "10px"}}

                    >
                        {isHovered ? "Hovered!" : "Not hovered"}
                    </button>

                </Col>
            </Row>
        </>
    );

    const return_nft_vector = () =>{
        if (loading) {
            return <p>Loading badges...</p>;
        }
        //console.log('before map user_badges_vector',user_badges_vector)
        return (
            <>
                <Row gutter={[24,10]} style={{paddingLeft:20,paddingTop:3,backgroundColor:"#dfdfdf",borderRadius:5,height:580}}>
                    <Col span={13}>
                       <Row gutter={[24,6]} style={{height:550,backgroundColor:"#ededed",borderRadius:5,width:"100%",paddingTop:15,paddingRight:45}}>
                           {/*{user_badges_vector.map((badges, index) => {*/}
                           {/*    //console.log('Mapped badges: ', badges);*/}
                           {/*    // @ts-ignore*/}
                           {/*    return (*/}
                           {/*        <Badgex_box badges={badges[0]} key={index} onBadgeClick={handleBadgeClick} />*/}
                           {/*    );*/}
                           {/*})}*/}
                           {user_badges_vector.map((badgesArray, index) => {
                               return badgesArray.map((badge, badgeIndex) => (
                                   <Badgex_box badges={badge} key={`${index}-${badgeIndex}`} onBadgeClick={handleBadgeClick} />
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
                        <Row gutter={[24,10]} style={{height:550,backgroundColor:"#ededed",borderRadius:5,width:"100%",paddingLeft:15,paddingTop:15}}>
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
                                <button className={"rainbow"} style={{width: "21vmax",right:"1vmax"}} onClick={() => submit_badges_to_nft()}>Genarte NFT</button>


                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        )
    }
    const change_page = (key: string) => {


        if (key == "My Badges") {
            set_return_element(return_my_badged() )
        } else if (key == "Mint") {
            set_return_element(return_mint_element)
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

