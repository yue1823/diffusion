import React, {useEffect, useState} from 'react';
import {Col, Row} from "antd";
import NotificationBoxes from "./cute_card";
import CountdownTimer from "./Count_time";
interface SavePair {
    can_bet:boolean;
    expired_time: string;
    left: string;
    left2: string;
    left_url: string;
    middle: string;
    middle2: string;
    pair_name: string;
    pair_type: string;
    right: string;
    right2: string;
    right_url: string;
}
interface Bet_card_data{
    a_win:string;
    b_win:string;
    c_win:string;
    bet:string;
    expired_time:string;
    pair:SavePair;
    time:string;
    which:string;
}
interface Result_Data{
    save_data1:Bet_card_data;
    save_can_claim:boolean;
    save_result:string;
}interface Bet_card_data{
    a_win:string;
    b_win:string;
    c_win:string;
    bet:string;
    expired_time:string;
    pair:SavePair;
    time:string;
    which:string;
}
interface Badges{
    name : string;
    url : string;
}
interface Profile{
    save_icon:{
        icon:string;
        name:string;
    };
    save_bet_card:Bet_card_data[];
    save_badges:Badges[];
    save_level:{
        diffusion_point:string;
        level:string;
        lose:string;
        win:string;
    }

}
const Flip_card_big:React.FC<{result_data:Result_Data,profile_data:Profile,random_url:string}> = ({result_data,profile_data,random_url,}) =>{

    const [real_url ,set_url ] =useState<string>('');
    const [balance ,set_balance]=useState<string>('');
    const [choose,set_choose]=useState<string>('');
    const [firstPart, secondPart] = result_data.save_data1.pair.pair_name.split(" vs ");
    const [expired_data,set_expired]=useState<string>('');
    const [right_or_wrong,set_right_or_wrong]=useState<boolean>(false);
    const [can_claim_ornot ,set_can_claim_ornot ]=useState<boolean>(false);
    const [win_price,set_win_price]=useState<string>('0');
    const [real_result , set_real_result]=useState('9');
    const deal_with_data = () =>{
        if(result_data.save_data1.which == "1"){
            set_url(result_data.save_data1.pair.left_url);
            set_choose(firstPart);
        }else if (result_data.save_data1.which  == "3"){
            set_url(result_data.save_data1.pair.right_url);
            set_choose(secondPart);
        }else if (result_data.save_data1.which  == "2"){
            set_url("data:image/png;base64,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");
            set_choose("middle")
        }
        set_real_result(result_data.save_result)
        set_balance((parseFloat(result_data.save_data1.bet)/100000000).toFixed(2).toString())
        const day = result_data.save_data1.pair.expired_time.substring(0, 2);
        const month = result_data.save_data1.pair.expired_time.substring(2, 4);
        const year = result_data.save_data1.pair.expired_time.substring(4);
        set_expired(`${day}/${month}/${year}`)
        if(result_data.save_data1.which == result_data.save_result){
            set_right_or_wrong(true);
            if(result_data.save_result =="1"){
                set_win_price((parseFloat(result_data.save_data1.a_win)/100000000).toFixed(2).toString());
            }else if(result_data.save_result =="2"){
                set_win_price((parseFloat(result_data.save_data1.b_win)/100000000).toFixed(2).toString());
            }else if(result_data.save_result =="3"){
                set_win_price((parseFloat(result_data.save_data1.c_win)/100000000).toFixed(2).toString());
            }
        }
        const day1 = parseInt(result_data.save_data1.expired_time.slice(0,2),10);
        const month1 =parseInt(result_data.save_data1.expired_time.slice(2,4),10)-1;
        const year1 =parseInt(result_data.save_data1.expired_time.slice(4,8),10);
        const target_data = new Date(year1,month1,day1);
        const today = new Date();
        // console.log(`expired_data : ${result_data.save_data1.expired_time}`)
        // console.log(`target_data : ${target_data}`)
        // console.log(`today : ${today}`)

        if(today > target_data){
            set_can_claim_ornot(true);
        }
    }
    const flipCardContainerStyle: React.CSSProperties = {
        perspective: '1000px',
        display: 'inline-block',
        width: 340,
        height: 440,
        margin: 35,
        position:"absolute",
        left:450
    };

    const flipCardStyle: React.CSSProperties = {
        width: 510,
        height: 700,
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        left:0,
        position: 'relative'
    };

    const flipCardContainerHoverFocus: React.CSSProperties = {
        transform: 'rotateY(180deg)',
    };
    useEffect(() => {
        deal_with_data();
        //console.log(result_data.save_data1.which)
    },[]);
    return(<>
        <div className="flip-card-container"style={flipCardContainerStyle}
             onMouseEnter={(e) => {
                 (e.currentTarget.querySelector('.flip-card') as HTMLElement).style.transform = 'rotateY(180deg)';
             }}
             onMouseLeave={(e) => {
                 (e.currentTarget.querySelector('.flip-card') as HTMLElement).style.transform = 'rotateY(0deg)';
             }}>
            <div className="flip-card" style={flipCardStyle}>

                <div className="card-front" style={{ position: 'absolute', backfaceVisibility: 'hidden' }}>
                    <figure>

                        <img
                            src={random_url}
                            alt="Brohm Lake"
                            style={{left: 0, width: "100%", position: "absolute"}}/>
                        <figcaption
                            style={{fontSize: 5, position: "relative", right: -15, top: 10, width: 60, height: 40}}>
                            <img alt={"1"} src={real_url} style={{
                                width: 300,
                                height: 300,
                                borderRadius: 3,
                                position: "relative",
                                right: -70,
                                top: 75
                            }}></img></figcaption>
                        <figcaption style={{fontSize: 35}}>{profile_data.save_icon.name}</figcaption>
                    </figure>

                    <ul style={{
                        paddingTop: '40%',
                        margin: '10% auto',
                        width: '80%',
                        height: '100%',
                        listStyle: 'none',
                        color: 'var(--white-1)',
                        display: 'flex', // 添加 `display: flex`，因为你使用了 `justify-content` 和 `align-items`
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}>
                        <li style={{
                            width: '100%',
                            marginTop: '2%',
                            paddingBottom: '2%',
                            display: 'flex',
                            fontSize: '100%',
                            textAlign: 'center',
                            top: '20%',
                            position: 'relative'
                        }}>Pair name : <span style={{
                            display: 'inline-block',
                            width: '60%',
                            textAlign: 'right',
                            position: "relative",
                            right: "-7%",
                            color:"hsla(0,100%,100%,0.9)"
                        }}>
                                                                    {result_data.save_data1.pair.pair_name}
                                                                  </span></li>
                        <li style={{
                            width: '100%',
                            marginTop: '2%',
                            paddingBottom: '2%',
                            display: 'flex',
                            fontSize: '100%',
                            textAlign: 'center',
                            top: '20%',
                            position: 'relative'
                        }}>Bet Amount: <span style={{
                            display: 'inline-block',
                            width: '40%',
                            textAlign: 'right',
                            position: "relative",
                            right: "-25%",
                            color:"hsla(0,100%,100%,0.9)"
                        }}>
                                                                    {balance}
                                                                  </span></li>
                        <li style={{
                            width: '100%',
                            marginTop: '2%',
                            paddingBottom: '2%',
                            display: 'flex',
                            fontSize: '100%',
                            textAlign: 'center',
                            top: '20%',
                            position: 'relative',
                            color:"hsla(0,100%,100%,0.9)"
                        }}>Choose : <span style={{
                            display: 'inline-block',
                            width: '40%',
                            textAlign: 'right',
                            position: "relative",
                            right: "-31%",
                            color:"hsla(0,100%,100%,0.9)"
                        }}>
                                                                            {choose}
                                                                          </span></li>
                        <li style={{
                            width: '100%',
                            marginTop: '2%',
                            paddingBottom: '2%',
                            display: 'flex',
                            fontSize: '100%',
                            textAlign: 'center',
                            top: '20%',
                            position: 'relative',
                            color:"hsla(0,100%,100%,0.9)"
                        }}>Expired Time : <span
                            style={{
                                display: 'inline-block',
                                width: '40%',
                                textAlign: 'right',
                                position: "relative",
                                right: "-22%",
                                color:"hsla(0,100%,100%,0.9)"
                            }}>
                                                {expired_data}
                                              </span>
                        </li>
                    </ul>
                </div>
                <div className="card-back"
                     style={{position: 'absolute', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>
                    <figure>
                        <div className="img-bg"></div>
                        <img
                            src={random_url}
                            alt="Brohm Lake" style={{position: "absolute", left: 1, width: 550}}/>
                    </figure>
                    {/*style={{position:"relative",left:215,top:-30}}*/}
                    {right_or_wrong && (<button style={{zIndex: 4,color:"hsla(0,100%,100%,0.9)"}} onClick={() =>{} }>Claim</button>)}
                    {!right_or_wrong && (<button style={{zIndex: 4,color:"hsla(0,100%,100%,0.9)"}}>Claim</button>)}


                    {/*<ul style={{*/}
                    {/*    paddingTop: '40%',*/}
                    {/*    position: 'relative',*/}
                    {/*    margin: '10% auto',*/}
                    {/*    width: '80%',*/}
                    {/*    height: '100%',*/}
                    {/*    listStyle: 'none',*/}
                    {/*    color: 'var(--white-1)',*/}
                    {/*    display: 'flex', // 添加 `display: flex`，因为你使用了 `justify-content` 和 `align-items`*/}
                    {/*    justifyContent: 'center',*/}
                    {/*    alignItems: 'center',*/}
                    {/*    flexDirection: 'column'*/}
                    {/*}}>*/}
                    {/*    <li style={{*/}
                    {/*        width: '100%',*/}
                    {/*        marginTop: '2%',*/}
                    {/*        paddingBottom: '2%',*/}
                    {/*        display: 'flex',*/}
                    {/*        fontSize: '100%',*/}
                    {/*        textAlign: 'center',*/}
                    {/*        top: '20%',*/}
                    {/*        position: 'relative'*/}
                    {/*    }}>Pair name : <span style={{*/}
                    {/*        display: 'inline-block',*/}
                    {/*        width: '60%',*/}
                    {/*        textAlign: 'right',*/}
                    {/*        position: "absolute",*/}
                    {/*        right: "-7%"*/}
                    {/*    }}>*/}
                    {/*                                                {result_data.save_data1.pair.pair_name}*/}
                    {/*                                              </span></li>*/}
                    {/*    <li style={{*/}
                    {/*        width: '100%',*/}
                    {/*        marginTop: '2%',*/}
                    {/*        paddingBottom: '2%',*/}
                    {/*        display: 'flex',*/}
                    {/*        fontSize: '100%',*/}
                    {/*        textAlign: 'center',*/}
                    {/*        top: '20%',*/}
                    {/*        position: 'relative'*/}
                    {/*    }}>Pair name : <span style={{*/}
                    {/*        display: 'inline-block',*/}
                    {/*        width: '60%',*/}
                    {/*        textAlign: 'right',*/}
                    {/*        position: "absolute",*/}
                    {/*        right: "-7%"*/}
                    {/*    }}>*/}
                    {/*                                                {result_data.save_data1.pair.pair_name}*/}
                    {/*                                              </span></li>*/}
                    {/*</ul>*/}

                    <div className="design-container" style={{zIndex:3}}>
                        <span className="design design--1"  ></span>
                        <span className="design design--2" ></span>
                        <span className="design design--3"></span>
                        <span className="design design--4"></span>
                        <span className="design design--5" ></span>
                        <span className="design design--6" ></span>
                        <span className="design design--7" ></span>
                        <span className="design design--8" ></span>

                    </div>
                    <Row style={{position:"absolute",top:320 ,zIndex:2}}>
                        <Col span={24} >
                            <div style={{ width: 240, height: 120,borderRadius:6,position:"absolute",top:70,left:-115}}>
                                {/*<h1 style={{fontSize: 100, color: "white"}}>aaaaa</h1>*/}
                                {can_claim_ornot ?  <>
                                        {right_or_wrong  ?
                                             <>
                                                 {real_result == "9" ? <>
                                                     <span style={{
                                                         position: "relative",
                                                         top: -370,
                                                         left: -90
                                                     }}>  <NotificationBoxes
                                                         right={right_or_wrong} price={win_price}
                                                         expire_or_not={false}/></span>
                                                                         <span style={{
                                                                             backgroundColor: "hsl(0, 0%, 50%,0.9)",
                                                                             width: 400,
                                                                             height: 80,
                                                                             borderRadius: 8,
                                                                             position: "relative",
                                                                             top: -210
                                                                         }}>
                                                          <CountdownTimer expiredDate={result_data.save_data1.expired_time} yes_or_not={false}/>
                                                        </span>
                                                     </>
                                                     :
                                                     <>
                                                           <span style={{
                                                               position: "relative",
                                                               top: -370,
                                                               left: -90
                                                           }}>  <NotificationBoxes
                                                               right={right_or_wrong} price={win_price}
                                                               expire_or_not={can_claim_ornot}/></span>
                                                     </>}
                                             </>
                                            :
                                            <>
                                                {real_result == "9" ? <>
                                                <span style={{
                                                    position: "relative",
                                                    top: -370,
                                                    left: -90
                                                }}>  <NotificationBoxes
                                                    right={right_or_wrong} price={win_price}
                                                    expire_or_not={false}/></span>
                                                    <span style={{
                                                        backgroundColor: "hsl(0, 0%, 50%,0.9)",
                                                        width: 400,
                                                        height: 80,
                                                        borderRadius: 8,
                                                        position: "relative",
                                                        top: -210
                                                    }}>
                                                          <CountdownTimer
                                                              expiredDate={result_data.save_data1.expired_time} yes_or_not={true}/>
                                                        </span>

                                                </> : <>
                                                <span style={{
                                                    position: "relative",
                                                    top: -370,
                                                    left: -376
                                                }}>  <NotificationBoxes
                                                    right={right_or_wrong} price={win_price}
                                                    expire_or_not={can_claim_ornot}/></span>
                                                </>}

                                            </>}
                                    </>
                                    :
                                    <>
                                         <span
                                             style={{position: "relative", top: -370, left: -90}}>  <NotificationBoxes
                                             right={false} price={win_price} expire_or_not={false}/></span>

                                        <span style={{
                                            backgroundColor: "hsl(0, 0%, 50%,0.9)",
                                            width: 400,
                                            height: 80,
                                            borderRadius: 8,
                                            position: "relative",
                                            top: -210
                                        }}>
                                          <CountdownTimer expiredDate={result_data.save_data1.expired_time} yes_or_not={true}/>
                                        </span>
                                    </>
                                }

                            </div>
                        </Col>
                    </Row>

                </div>

            </div>
        </div>
        </>
    )

};

export default Flip_card_big;