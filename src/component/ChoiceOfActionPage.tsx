import logo from '../logo.png';
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import React, { useState } from 'react';

export default function ChoiceOfActionPage() {
    const [userName, setUserName] = useState<string>('NotLoggedIn');
    return (
        <div className="App2">
            <img src={logo} className="App-logo" alt="logo"></img>
            <h1>Witaj {userName} </h1>
            <p><Button as={NavLink} to={`/login`} className="buttonMenu" >PRZEGL¥DAJ DRZEWO GENEALOGICZNE</Button></p>
            <p><Button as={NavLink} to={`/login`} className="buttonMenu">STWÓRZ W£ASNE DRZEWO GENEALOGICZNE</Button></p>
        </div>
    )
}