import React, { CSSProperties }  from  'react';

const Sleepy_cat: React.FC = () => {
    // const containerStyle: React.CSSProperties = {
    //     margin: 0,
    //     padding: 0,
    //     width: '100%',
    //     height: '100%',
    //     overflow: 'hidden',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     fontFamily: "'Ubuntu', sans-serif",
    // };



    // const h1Style: React.CSSProperties = {
    //     fontSize: '3vw',
    //     color: '#556F80',
    // };
    //
    // const pStyle: React.CSSProperties = {
    //     color: '#98AEBE',
    //     fontSize: '2vw',
    //     lineHeight: '1.8em',
    //     marginTop: '10px',
    // };



    return(
        <>
            <Sleepy_cat_v2/>
            <div style={{
                border: "solid 0.1px",
                position: "relative",
                top: "23.9vmax",
                height: "2.4vmax",
                width: "23.7vmax",
                left: "3.1vmax",
                borderColor: "#fff",
                backgroundColor: "#fff"
            }}></div>
            <div style={{
                border: "solid 0.1px",
                position: "relative",
                top: "3.6vmax",
                height: "18.4vmax",
                width: "2.4vmax",
                left: "5vmax",
                borderColor: "#fff",
                backgroundColor: "#fff"
            }}></div>
            <div style={{
                border: "solid 0.1px",
                position: "relative",
                top: "-7vmax",
                height: "2.4vmax",
                width: "11.7vmax",
                left: "7vmax",
                borderColor: "#fff",
                backgroundColor: "#fff"
            }}></div>
            <div style={{border:"solid 0.3px" ,height:"6vmax", borderColor:"rgba(195,193,193,0.94)",position:"relative",top:"-17vmax",width:"0.5vmax",left:"25vmax",backgroundColor:"rgba(195,193,193,0.94)",borderRadius:5}}></div>
            <p style={{color:"#fff",fontSize:35,top:"-22.5vmax",position:"relative",right:"1vmax"}}>
                APT
            </p>
        </>
    )
}
export {Sleepy_cat_v2, Sleepy_cat};
interface SleepyCatProps {
    style?: CSSProperties;  // 可选的 CSS 样式
}
const Sleepy_cat_v2: React.FC<SleepyCatProps>  = ({style}) => {
    const boxStyle: React.CSSProperties = {
        width: '80%',
        margin: '0 auto',
        textAlign: 'center',
    };
    const svgStyle: React.CSSProperties = {
        cursor: 'pointer',
    };
    const defaultStyle: CSSProperties = {
        transform: "scale(18)",
        position: "relative",
        left: "166vmax",
        top: "-5vmax"
    };
    // const combinedTransform = `${defaultStyle.transform} ${style?.transform || ''}`.trim();
    const combinedStyle = {
        ...boxStyle,
        ...defaultStyle,   // 保留默认样式
        ...style,          // 覆盖默认样式
        transform: style?.transform || defaultStyle.transform
    };
    return (
        <div style={{...combinedStyle}}>
            <svg style={svgStyle} viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"
                 clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="1.5">
                <g id={"window"}>
                    <g clip-path="url(#_clip1)">
                        <path id="window__base" fill="#fff" d="M287.918 401.069h224.164v22.23H287.918z"/>

                    </g>
                    <path id="right-hand"
                          d="M331.488 386.954s-27.273-1.471-26.23 7.167c.766 6.338 8.295 7.357 14.469 7.772 6.174.416 36.055.929 11.761-14.939z"
                          fill="#98aebe"/>
                    <path id="body"
                          d="M352.39 365.252s81.405-40.993 98.905-.68c11.659 26.856-7.929 42.029-43.527 42.029-23.361 0-43.863-1.589-52.67-5.837-8.806-4.248-2.708-35.512-2.708-35.512z"
                          fill="#98aebe"/>
                    <clipPath id="_clip2">
                        <path
                            d="M352.39 365.252s81.405-40.993 98.905-.68c11.659 26.856-7.929 42.029-43.527 42.029-23.361 0-43.863-1.589-52.67-5.837-8.806-4.248-2.708-35.512-2.708-35.512z"/>
                    </clipPath>
                    <g clip-path="url(#_clip2)" fill="#556f80">
                        <ellipse cx="387.298" cy="348.073" rx="6.745" ry="21.523"/>
                        <ellipse cx="405.01" cy="345.617" rx="6.745" ry="21.523"/>
                        <ellipse cx="421.309" cy="342.364" rx="6.745" ry="21.523"/>
                    </g>
                    <g id={"face"}>
                        <path
                            d="M364.317 400.424s11.226-4.284 15.647-9.691c6.564-8.027 3.892-15.747 3.892-15.747l-11.031.387-8.508 25.051z"
                            fill="#303853" fill-opacity=".2"/>
                        <path id="head"
                              d="M351 346.994c18.134 0 32.856 12.256 32.856 27.351 0 15.096-5.681 27.352-32.856 27.352s-32.856-12.256-32.856-27.352c0-15.095 14.722-27.351 32.856-27.351z"
                              fill="#98aebe"/>
                        <clipPath id="_clip3">
                            <path id="head1"
                                  d="M351 346.994c18.134 0 32.856 12.256 32.856 27.351 0 15.096-5.681 27.352-32.856 27.352s-32.856-12.256-32.856-27.352c0-15.095 14.722-27.351 32.856-27.351z"/>
                        </clipPath>
                        <g clip-path="url(#_clip3)">
                            <ellipse id="head__mark" cx="352.146" cy="341.559" rx="6.738" ry="21.523"
                                     fill="#556f80"/>
                        </g>
                        <g id={"ear_left"}>
                            <path
                                d="M329.297 344.831c1.229-1.448 3.397-1.633 4.854-.414 5.049 4.184 8.243 8.982 9.656 14.354.415 1.603-.359 3.277-1.849 4-5.62 2.725-11.188 3.166-16.711 1.657-1.627-.446-2.699-1.995-2.544-3.675.628-6.08 2.837-11.38 6.594-15.922z"
                                fill="#98aebe"/>
                            <path
                                d="M329.582 351.25a3.3964 3.3964 0 012.573-1.627c1.066-.106 2.12.298 2.843 1.088 1.11 1.065 1.923 2.266 2.509 3.539a3.4906 3.4906 0 01-2.203 4.826c-1.44.422-2.872.558-4.298.426a3.4897 3.4897 0 01-2.508-1.416 3.4889 3.4889 0 01-.591-2.819c.411-1.425.944-2.769 1.675-4.017z"
                                fill="#d7edee"/>
                        </g>
                        <g id={"ear_right"}>
                            <path
                                d="M371.927 344.794c1.657-.929 3.754-.346 4.693 1.305 3.274 5.682 4.595 11.292 4.046 16.819-.17 1.648-1.479 2.947-3.127 3.105-6.218.595-11.591-.934-16.241-4.274-1.369-.985-1.834-2.811-1.103-4.331 2.709-5.48 6.627-9.677 11.732-12.624z"
                                fill="#98aebe"/>
                            <path
                                d="M370.019 350.745a3.3997 3.3997 0 012.96-.605 3.3971 3.3971 0 012.273 1.991c.726 1.497 1.094 3.016 1.194 4.522a3.4903 3.4903 0 01-3.717 3.729c-1.618-.099-3.114-.5-4.498-1.183a3.491 3.491 0 01-1.832-2.189c-.271-.957-.12-1.985.415-2.824.936-1.303 1.984-2.463 3.205-3.441z"
                                fill="#d7edee"/>
                        </g>
                        <g id={"face_details"}>
                            <path d="M336.292 387.714s-4.319-1.775-9.465-.34" fill="none" stroke="#556f80"
                                  stroke-width="2"/>
                            <path d="M362.652 387.714s4.319-1.775 9.465-.34" fill="none" stroke="#556f80"
                                  stroke-width="2"/>
                            <path d="M336.575 390.032s-3.765-.486-8.735 2.944" fill="none" stroke="#556f80"
                                  stroke-width="2"/>
                            <path d="M362.369 390.032s3.765-.486 8.735 2.944" fill="none" stroke="#556f80"
                                  stroke-width="2"/>
                            <path
                                d="M349.873 386.424c.392-.242.89-.232 1.273.025.165.106.317.227.457.355.443.399.599 1.027.393 1.586-.206.56-.732.937-1.327.953a6.271 6.271 0 01-.434-.01 1.4684 1.4684 0 01-.872-2.576c.164-.108.329-.224.51-.333z"
                                fill="#556f80"/>
                            <path id="eye__left__close"
                                  d="M332.463 377.656c.993 1.432 3.476 2.14 5.122 2.13 1.987-.011 4.014-.609 5.028-2.13"
                                  fill="none" stroke="#556f80" stroke-width="2"/>
                            <path id="eye__right__close"
                                  d="M357.174 377.656c.992 1.432 3.475 2.14 5.121 2.13 1.987-.011 4.015-.609 5.028-2.13"
                                  fill="none" stroke="#556f80" stroke-width="2"/>
                            <g id="eye__right__open">
                                <ellipse cx="362.196" cy="377.815" rx="4.942" ry="6.515" fill="#d7edee"/>
                                <ellipse id="eye__right__open__p" cx="362.196" cy="377.815" rx="3.56" ry="4.82"
                                         fill="#556f80"/>
                            </g>
                            <g id="eye__left__open">
                                <ellipse cx="337.566" cy="377.815" rx="4.942" ry="6.515" fill="#d7edee"/>
                                <ellipse id="eye__left__open__p" cx="337.566" cy="377.815" rx="3.56" ry="4.82"
                                         fill="#556f80"/>
                            </g>
                        </g>
                    </g>
                    <path id="leg"
                          d="M434.587 386.268s41.571-.431 39.44 10.421c-1.563 7.963-13.079 8.856-22.495 9.058-9.416.202-54.893-.712-16.945-19.479z"
                          fill="#98aebe"/>
                    <g id="tails" fill="none" stroke="#98aebe" stroke-width="14">

                        <path id="tail" d="M447.606 379.471v24.772s-.061 26.915-28.211 26.915"/>

                    </g>
                    <path id="left-hand"
                          d="M367.154 392.352s-15.939 22.18-8.101 25.956c5.751 2.772 10.668-3.021 14.346-7.998 3.677-4.976 20.216-29.868-6.245-17.958z"
                          fill="#98aebe"/>
                </g>
            </svg>

        </div>
    )
}