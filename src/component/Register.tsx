import logo from '../logo.svg';
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import React, { useState } from 'react';

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
            <img src={logo} className="App-logo" alt="logo"></img>
            <form >
                <div>
                    <label>Imi�:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                    />
                </div>
                <div>
                    <label>Nazwaiko:</label>
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
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isChecked} 
                            //onChange={handleCheckboxChange} 
                        />
                        AKCEPTUJE POLITYK� PRYWATNO�CI <Button as={NavLink} to={`/privacyPolicy`} >POLITYKA PRYWATNO�CI</Button>
                    </label>
                </div>
            </form>


            <Button as={NavLink} to={`/login`} className="button-container" >ZA�ӯ KONTO</Button>
        </div>
    )
}