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
      <Menu.Item
        as={NavLink}
        to={localStorage.getItem("token") ? "/openTree" : "/login"}
      >
        <Button
          style={{
            borderRadius: "12px",
            padding: "10px 20px",
            fontFamily: "Times New Roman, sans-serif", // Use camelCase for font-family
            fontWeight: 500,
            fontSize: 20,
          }}
        >
          MyChronicle
        </Button>
      </Menu.Item>
      <div className="appbar-container">
        <Button as={NavLink} to="/settingsPage" className="username-button">
          {userName}
        </Button>
        <div className="user-icon">{userName.charAt(0).toUpperCase()}</div>
      </div>
    </div>
  );
}
