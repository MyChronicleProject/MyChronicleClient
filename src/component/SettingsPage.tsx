import logo from "../logo.svg";
import { Button, Container } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import "../Styles/settingsPageStyle.css";
import AppBar from "./AppBars/AppBar";
import { useState } from "react";

export default function SettingsPage() {
  const [changePassForm, setChangePassForm] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    pass: "",
    newPass: "",
    repPass: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleExit = () => {
    setChangePassForm(false);
  };


  const handleChangePassForm = () => {

  };

  return (
    <div>
      <AppBar />
      <div className="App3">
        <div className="setting-setup">
          <h1 className="setting-item">USERNAME</h1>
          <p className="setting-item">
            <Button onClick={() => setChangePassForm(true)} className="setting-header">
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



        {changePassForm && (
          <>
            <div className="overlayBackground" ></div>
            <form className="overlay">
              <Button onClick={handleExit} className="exitButton">
                x
              </Button>
              <div className="inputBasic">
                <label>Stare hasło:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.pass}
                  onChange={handleChange}
                />

                <div className="inputBasic">
                  <label>Nowe hasło:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.newPass}
                    onChange={handleChange}
                  />
                </div>
                <div className="inputBasic">
                  <label>Powtórz nowe hasło:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.repPass}
                    onChange={handleChange}
                  />
                </div>


                {formErrors.name && (
                  <div className="error-message">{formErrors.name}</div>
                )}
              </div>
              <Button onClick={handleChangePassForm} className="buttonMenu2">
                Zmieńhaslo
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
