import React, { useEffect } from "react";
import gsap from "gsap";
import "../css_/letter.css";
import "../css_/candy_button.css";
import {Col, Row} from "antd";
import {DiscordFilled, GithubFilled, TwitterCircleFilled} from "@ant-design/icons";
import {Link} from "react-router-dom";

// Variables
const mobileMediaQuery = window.matchMedia("(max-width: 400px)");
const tabletMediaQuery = window.matchMedia(
    "(min-width: 400px) and (max-width: 600px)"
);

// Function that resets the size of the notes.
const resizeNotes = (notes: NodeListOf<Element>): void => {
    notes.forEach((note) => {
        if (note.classList.contains("active")) {
            note.classList.remove("active");
            gsap.set(note, {
                height: "30%",
                clearProps: "all",
            });
        }
    });
};

// Main function that enables all the notes.
const notesReady = (notes: NodeListOf<Element>): void => {
    gsap.to(".js-envelop-content", {
        height: "110%",
        duration: 0.5,
    });

    notes.forEach((note, i) => {
        note.addEventListener("click", function () {
            if (mobileMediaQuery.matches) {
                if (note.classList.contains("active")) {
                    note.classList.remove("active");
                    gsap.set(note, {
                        height: "30%",
                        clearProps: "all",
                    });
                } else {
                    notes.forEach((n) => {
                        if (n.classList.contains("active")) {
                            n.classList.remove("active");
                            gsap.set(n, {
                                height: "30%",
                                clearProps: "all",
                            });
                        }
                    });
                    note.classList.add("active");
                    gsap.set(note, {
                        height: `${125 + 40 * i}%`,
                    });
                }
            } else if (tabletMediaQuery.matches) {
                if (note.classList.contains("active")) {
                    note.classList.remove("active");
                    gsap.set(note, {
                        height: "30%",
                        clearProps: "all",
                    });
                } else {
                    notes.forEach((n) => {
                        if (n.classList.contains("active")) {
                            n.classList.remove("active");
                            gsap.set(n, {
                                height: "30%",
                                clearProps: "all",
                            });
                        }
                    });
                    note.classList.add("active");
                    gsap.set(note, {
                        height: `${80 + 21 * i}%`,
                    });
                }
            } else {
                if (note.classList.contains("active")) {
                    note.classList.remove("active");
                    gsap.set(note, {
                        height: "30%",
                        clearProps: "all",
                    });
                } else {
                    notes.forEach((n) => {
                        if (n.classList.contains("active")) {
                            n.classList.remove("active");
                            gsap.set(n, {
                                height: "30%",
                                clearProps: "all",
                            });
                        }
                    });
                    note.classList.add("active");
                    gsap.set(note, {
                        height: `${70 + 20 * i}%`,
                    });
                }
            }
        });
    });
};

// Function that sets up the up paper of the envelope.
const setupPaper = (notes: NodeListOf<Element>): void => {
    const arr: number[] = [0, 0, 100, 0, 50, 61];
    gsap.set(".js-up-paper", {
        bottom: "97%",
        rotation: 180,
        zIndex: 200,
        clipPath: `polygon(${arr[0]}% ${arr[1]}%, ${arr[2]}% ${arr[3]}%, ${arr[4]}% ${arr[5]}%)`,
        onComplete: () => notesReady(notes),
    });
};

// Function that starts the up paper transition.
const envelopTransition = (notes: NodeListOf<Element>): void => {
    gsap.to(".js-up-paper", {
        bottom: "1%",
        duration: 0.25,
        onComplete: () => setupPaper(notes),
    });

    const upPaperElement = document.querySelector(".js-up-paper");
    if (upPaperElement) {
        upPaperElement.removeEventListener("click", () => envelopTransition(notes));
        upPaperElement.classList.remove("cursor");
    }
};

// Function that allows cutting the sticker.
const sticker = (notes: NodeListOf<Element>): void => {
    gsap.set(".js-sticker", { width: "20%", left: "-80%" });
    document.body.classList.remove("scissors");

    const stickerElement = document.querySelector(".js-sticker");
    const upPaperElement = document.querySelector(".js-up-paper");

    if (stickerElement) {
        stickerElement.removeEventListener("click", () => sticker(notes));
    }
    if (upPaperElement) {
        upPaperElement.addEventListener("click", () => envelopTransition(notes));
        upPaperElement.classList.add("cursor");
    }
};

// React Component
const EnvelopeComponent: React.FC = () => {
    useEffect(() => {
        const notes = document.querySelectorAll(".js-note");

        const stickerElement = document.querySelector(".js-sticker");
        if (stickerElement) {
            stickerElement.addEventListener("click", () => sticker(notes));
        }

        window.onresize = () => resizeNotes(notes);

        return () => {
            window.onresize = null;
        };
    }, []);

    return (
        <div className="envelop">
            <div className="envelop__front-paper"></div>
            <div className="envelop__back-paper"></div>
            <div className="envelop__up-paper js-up-paper"></div>
            <div className="envelop__sticker js-sticker"></div>
            <div className="envelop__false-sticker"></div>
            <div className="envelop__content js-envelop-content">
                <div className="love-notes">
                    <div className="note js-note">
                        <div className="note__text">
                            <Row>
                                <Col span={20} offset={2}>
                                    <p>
                                    Sorry , You are Not helper
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={20} offset={2}>
                                    <p>welcome to join our community</p>
                                </Col>
                            </Row>
                            <Row>

                                <Col span={4} offset={4} style={{fontSize: 50}}>
                                    <a href={""}>
                                        <TwitterCircleFilled/>
                                    </a>
                                </Col>

                                <Col span={4} offset={2} style={{fontSize: 50}}>
                                    <a href={""}>
                                        <DiscordFilled/>
                                    </a>
                                </Col>

                                <Col span={4} offset={2} style={{fontSize: 50}}>
                                    <a href={"https://github.com/yue1823/diffusion"}>
                                        <GithubFilled/>
                                    </a>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="note js-note">
                        <div className="note__text">
                            <Row>
                                <Col span={20} offset={4}>
                                    <Link to={"/Bet"}>
                                         <button className="custom-btn btn-6"><span style={{fontSize:17,position:"relative",top:7}}>Go To Bet Card</span></button>
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    {/*<div className="note js-note">*/}
                    {/*    <div className="note__text">*/}
                    {/*        <p>você é a melhor coisa que me aconteceu, obrigado por me escolher todos os dias.</p>*/}
                    {/*        <p>Te amo muito! &hearts;.</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
};

export default EnvelopeComponent;
