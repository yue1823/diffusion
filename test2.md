``` Css
.rainbow::after {
    z-index: -1;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgb(17, 17, 17);
    left: 0px;
    top: 0px;
}

.rainbow {
    cursor: pointer;
    display: inline-block;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    height: 2.8rem;
    letter-spacing: 0.1rem;
    line-height: 2.8rem;
    padding: 0px 1.8rem;
    text-align: center;
    text-decoration: none;
    white-space: nowrap;
    position: relative;
    z-index: 0;
    color: rgb(255, 255, 255);
    border-color: transparent;
}
.rainbow::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    z-index: -1;
    filter: blur(5px);
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation-timeline: auto;
    animation-range-start: normal;
    animation-range-end: normal;
    opacity: 0;
    background: linear-gradient(45deg, rgb(255, 0, 0), rgb(255, 115, 0), rgb(255, 251, 0), rgb(72, 255, 0), rgb(0, 255, 213), rgb(0, 43, 255), rgb(122, 0, 255), rgb(255, 0, 200), rgb(255, 0, 0)) 0% 0% / 400%;
    animation: 20s linear 0s infinite normal none running rainbow-animation;
    transition: opacity 0.3s ease-in-out;
}
button {
    font-style: ;
    font-variant-ligatures: ;
    font-variant-caps: ;
    font-variant-numeric: ;
    font-variant-east-asian: ;
    font-variant-alternates: ;
    font-variant-position: ;
    font-weight: ;
    font-stretch: ;
    font-size: ;
    font-family: ;
    font-optical-sizing: ;
    font-size-adjust: ;
    font-kerning: ;
    font-feature-settings: ;
    font-variation-settings: ;
    text-rendering: auto;
    color: buttontext;
    letter-spacing: normal;
    word-spacing: normal;
    line-height: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    text-align: center;
    cursor: default;
}
.rainbow:hover::before {
    opacity: 1; /* 鼠标悬停时显示彩虹光 */
}
@keyframes rainbow-animation {
0% {
    background-position: 0px 0px;
}
50% {
    background-position: 400% 0px;
}
100% {
    background-position: 0px 0px;
}
}
```
