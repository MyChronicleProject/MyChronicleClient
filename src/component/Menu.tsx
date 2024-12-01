import logo from '../logo.svg';
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export default function Menu() {
    return (
        <div>
            <img src={logo} className="App-logo" alt="logo"></img>
            <Button as={NavLink} to={`/login`} >ZALOGUJ SIÊ</Button>
            <p>
                NIE MASZ KONTA? <Button as={NavLink} to={`/register`}  >ZAREJESTRUJ SIÊ</Button>
            </p>
        </div>
    )
}