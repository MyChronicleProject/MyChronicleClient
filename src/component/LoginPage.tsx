import logo from "../logo.png";
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import "../Styles/buttonMenu.css";
import "../Styles/inputFieldsMenu.css";
import AppBar from "./AppBars/AppBar";
import BottomBar from "./AppBars/BottomBar";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  return (
    <div>
      <AppBar />
      <div className="App2">
        <img src={logo} className="App-logo" alt="logo"></img>
        <form>
          <label>Login:</label>
          <div className="inputRegister">
            <input type="text" name="login" value={formData.login} />
          </div>
          <label>Hasło:</label>
          <div className="inputRegister">
            <input type="text" name="password" value={formData.password} />
          </div>
        </form>

        <Button as={NavLink} to={`/choiceOfActionPage`} className="buttonMenu">
          ZALOGUJ SIĘ
        </Button>
      </div>
      <BottomBar />
    </div>
  );
}
