import logo from '../logo.svg';
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export default function SettingsPage() {
    return (
        <div className='App3'>
            <h1>USERNAME</h1>
            <p><Button as={NavLink} to={`/`} >ZMIEŃ HASŁO</Button></p>
            <p><Button as={NavLink} to={`/privacyPolicy`} >POLITYKA PRYWATNOŚCI</Button></p>
            <p><Button as={NavLink} to={`/`} >WYLOGUJ</Button></p>
            <p><Button as={NavLink} to={`/`} >USUŃ KONTO</Button></p>
        </div>
    )
}