import logo from '../logo.png';
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import React, { useState } from 'react';
import '../Styles/buttonMenu.css';

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
        <div className="App">
            <img src={logo} className="App-logo" alt="logo"></img>
            <form  className="inputRegister">
                <div>
                    <label>Imi�:</label>
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
                    <label>Has�o:</label>
                    <input
                        type="text"
                        name="password"
                        value={formData.password}
                    />
                </div>
                <div>
                    <label>Powt�rz has�o:</label>
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
                AKCEPTUJE POLITYK� PRYWATNO�CI</p>
                <Button as={NavLink} to={`/privacyPolicy`} className="link" >POLITYKA PRYWATNO�CI</Button>
                   
                </div>
            


            <Button as={NavLink} to={`/login`} className="buttonMenu2" >ZA�ӯ KONTO</Button>
        </div>
    )
}