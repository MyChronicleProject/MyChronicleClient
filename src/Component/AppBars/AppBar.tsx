import { Button, Container, Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../../Styles/appBarStyle.css";

export default function AppBar() {
  const [userName, setUserName] = useState<string>("NotLoggedIn");

  useEffect(() => {
    const userNameStorage = localStorage.getItem("userName");
    if (userNameStorage) {
      setUserName(userNameStorage);
    }
  }, []);

  return (
    <div className="appbar">
      <div className="appbar-container">
        <Button as={NavLink} to="/settingsPage" className="username-button">
          {userName}
        </Button>
        <div className="user-icon" />
      </div>
    </div>
  );
}
