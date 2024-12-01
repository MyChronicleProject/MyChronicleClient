import logo from '../logo.svg';
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
export default function ChoiceOfActionPage() {
    return (
        <div>
            <h1>WITAJ USERNAME</h1>
            <img src={logo} className="App-logo" alt="logo"></img>
            <Button as={NavLink} to={`/login`} >PRZEGL¥DAJ DRZEWO GENEALOGICZNE</Button>
            <Button as={NavLink} to={`/login`} >STWÓRZ W£ASNE DRZEWO GENEALOGICZNE</Button>
        </div>
    )
}