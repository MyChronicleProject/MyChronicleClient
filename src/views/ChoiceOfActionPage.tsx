import logo from "../logo.png";
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import "../Styles/buttonMenu.css";
import AppBar from "../components/AppBars/AppBar";
import BottomBar from "../components/AppBars/BottomBar";

export default function ChoiceOfActionPage() {
  const [userName, setUserName] = useState<string>("NotLoggedIn");
  return (
    <div>
      <AppBar />
      <div className="App2">
        <img src={logo} className="App-logo" alt="logo"></img>
        <h1 className="welcome-text">Witaj {userName} </h1>
        <p>
          <Button as={NavLink} to={`/openTree`} className="buttonMenu2">
            PRZEGLĄDAJ DRZEWO GENEALOGICZNE
          </Button>
        </p>
        <p>
          <Button as={NavLink} to={`/login`} className="buttonMenu2">
            STWÓRZ WŁASNE DRZEWO GENEALOGICZNE
          </Button>
        </p>
      </div>
      <BottomBar />
    </div>
  );
}
