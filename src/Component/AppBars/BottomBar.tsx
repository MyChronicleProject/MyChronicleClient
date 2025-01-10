import { Button, Container, Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import "../../Styles/appBarStyle.css";

export default function BottomBar() {
  return (
    <div className="appBarBottom">
      <p className="contact-text">Skontaktuj się z nami! </p>
      <Button as={NavLink} to="/settingsPage" className="username-button">
        Contact email
      </Button>
    </div>
  );
}
