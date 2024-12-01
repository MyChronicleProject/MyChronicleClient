import logo from '../logo.svg';
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
export default function SettingsPage() {
    return (
        <div>
            <h1>USERNAME</h1>
            <Button as={NavLink} to={`/`} >ZMIE� HAS�O</Button>
            <Button as={NavLink} to={`/privacyPolicy`} >POLITYKA PRYWATNO�CI</Button>
            <Button as={NavLink} to={`/`} >WYLOGUJ</Button>
            <Button as={NavLink} to={`/`} >USU� KONTO</Button>
        </div>
    )
}