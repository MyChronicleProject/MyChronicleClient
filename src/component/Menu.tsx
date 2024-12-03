import logo from '../logo.png';
import '../Styles/buttonMenu.css';
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import AppBar from '../Component/AppBar';
import BottomBar from './BottomBar';

export default function Menu() {
    return (
        <div>
         <AppBar />
        <div className="App2" >
           
            <img src={logo} className="App-logo" alt="logo"></img>
            <p>            <Button as={NavLink} to={`/login`} className="buttonMenu" >ZALOGUJ SI�</Button>  </p>

            <p>
                NIE MASZ KONTA? <Button as={NavLink} to={`/register`}  className="link">ZAREJESTRUJ SI�</Button>
            </p>
            </div>
        <BottomBar/>
        </div>
    )
}