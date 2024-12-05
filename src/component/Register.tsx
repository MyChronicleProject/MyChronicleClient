import logo from '../logo.png';
import AppBar from './AppBar';
import BottomBar from './BottomBar';

import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import React, { useState } from 'react';
import '../Styles/buttonMenu.css';
import '../Styles/inputFieldsMenu.css';

export default function Register() {

    const [isChecked, setIsChecked] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        login: '',
        password: '',
        password2:'',
    });


    return (
        <div>
            <AppBar />
        <div className="App">
            <img src={logo} className="App-logo" alt="logo"></img>
            <form  className="inputRegister">
                <div>
                    <label>Imię:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                    />
                </div>
                <div>
                    <label>Nazwisko:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                    />
                </div>
                <div>
                    <label>Login:</label>
                    <input
                        type="text"
                        name="login"
                        value={formData.login}
                    />
                </div>
                <div>
                    <label>Hasło:</label>
                    <input
                        type="text"
                        name="password"
                        value={formData.password}
                    />
                </div>
                <div>
                    <label>Powtórz hasło:</label>
                    <input
                        type="text"
                        name="password2"
                        value={formData.password2}
                    />
                </div>
            </form>
                <div>
                <p>
                        <input
                            type="checkbox"
                            checked={isChecked} 
                            //onChange={handleCheckboxChange} 
                        />
                AKCEPTUJĘ POLITYKĘ PRYWATNOŚCI</p>
                <Button as={NavLink} to={`/privacyPolicy`} className="link" >POLITYKA PRYWATNOŚCI</Button>
                   
                </div>
            


            <Button as={NavLink} to={`/login`} className="buttonMenu2" >ZAŁÓŻ KONTO</Button>
        </div>
        <BottomBar />
        </div>
    )
}