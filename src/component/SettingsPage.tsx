import logo from "../logo.svg";
import { Button, Container } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import "../Styles/settingsPageStyle.css";
import AppBar from "./AppBars/AppBar";

export default function SettingsPage() {
  return (
    <div>
      <AppBar />
      <div className="App3">
        <div className="setting-setup">
          <h1 className="setting-item">USERNAME</h1>
          <p className="setting-item">
            <Button as={NavLink} to={`/`} className="setting-header">
              ZMIEŃ HASŁO
            </Button>
          </p>
          <p className="setting-item">
            <Button
              as={NavLink}
              to={`/privacyPolicy`}
              className="setting-header"
            >
              POLITYKA PRYWATNOŚCI
            </Button>
          </p>
          <p className="setting-item">
            <Button as={NavLink} to={`/`} className="setting-header">
              WYLOGUJ
            </Button>
          </p>
          <p className="setting-item">
            <Button as={NavLink} to={`/`} className="setting-header">
              USUŃ KONTO
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
