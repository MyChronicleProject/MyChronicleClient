import logo from '../logo.svg';
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import React, { useState } from 'react';

export default function LoginPage() {

    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });


    return (
        <div>
            <img src={logo} className="App-logo" alt="logo"></img>
            <form >
                <div>
                    <label>Login:</label>
                    <input
                        type="text"
                        name="login"
                        value={formData.login}
                    />
                </div>
                <div>
                    <label>Has³o:</label>
                    <input
                        type="text"
                        name="password"
                        value={formData.password}
                    />
                </div>
            </form>


            <Button as={NavLink} to={`/login`} className="button-container" >ZALOGUJ SIÊ</Button>
        </div>
    )
}