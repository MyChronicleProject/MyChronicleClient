import logo from "../logo.svg";
import { Button, Container } from "semantic-ui-react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/settingsPageStyle.css";
import AppBar from "./AppBars/AppBar";
import axios from "axios";

export default function SettingsPage() {
  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("displayName");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const handleRemoveAccount = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Brak tokena. Użytkownik nie jest zalogowany.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .delete(`https://localhost:7033/api/account/deleteaccount`, config)
      .then(() => {
        console.log("AccountDeleted");
        localStorage.removeItem("token");
        localStorage.removeItem("displayName");
        localStorage.removeItem("userName");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Błąd podczas usuwania konta", error);
      });
  };

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
            <Button onClick={handleLogOut} className="setting-header">
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
