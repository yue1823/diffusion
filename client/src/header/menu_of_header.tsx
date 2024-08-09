import React, {Component, useState} from 'react';
import {pushRotate as Menu} from "react-burger-menu";
import "./mymenu.css";
import {createStore, combineReducers} from 'redux';
// @ts-ignore
import {reducer as burgerMenu} from 'redux-burger-menu';

const reducers = {
    // Your other reducers go here
    burgerMenu // Must be mounted at 'burgerMenu'
};

const reducer = combineReducers(reducers);
const store = createStore(reducer);
const items = [<h2 key="0">
    <i className="fa fa-fw fa-inbox fa-2x"/>
    <span>Sidebar</span>
</h2>,
    <a key="1" href="">
        <i className="fa fa-fw fa-database"/>
        <span>Data Management</span>
    </a>,
    <a key="2" href="">
        <i className="fa fa-fw fa-map-marker"/>
        <span>Location</span>
    </a>,
    <a key="3" href="">
        <i className="fa fa-fw fa-mortar-board"/>
        <span>Study</span>
    </a>,
    <a key="4" href="">
        <i className="fa fa-fw fa-picture-o"/>
        <span>Collections</span>
    </a>,
    <a key="5" href="">
        <i className="fa fa-fw fa-money"/>
        <span>Credits</span>
    </a>];
const MyMenu: React.FC = () => {
    const click_button =() =>{

    }
    return (
        <>

            <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
                <a id="home" className="menu-item" href="/">Home</a>
                <a id="about" className="menu-item" href="/about">About</a>
                <a id="contact" className="menu-item" href="/contact">Contact</a>
                <a onClick={click_button} className="menu-item--small" href="">Settings</a>
            </Menu>
        </>
    );
};
class Example extends React.Component {
    showSettings (event: { preventDefault: () => void; }) {
        event.preventDefault();
    }

    render () {
        // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
        return (
            <Menu>
                <a id="home" className="menu-item" href="/">Home</a>
                <a id="about" className="menu-item" href="/about">About</a>
                <a id="contact" className="menu-item" href="/contact">Contact</a>
                <a onClick={ this.showSettings } className="menu-item--small" href="">Settings</a>
            </Menu>
        );
    }
}
export default MyMenu;