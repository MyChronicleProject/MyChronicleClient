import logo from "../logo.svg";
import { Button, Container } from "semantic-ui-react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/settingsPageStyle.css";
import AppBar from "../components/AppBars/AppBar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [changePassForm, setChangePassForm] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("NotLoggedIn");
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    newPassword2: "",
  });

  const [formErrors, setFormErrors] = useState({
    error: "",
    password: "",
    newPassword: "",
    newPassword2: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setFormData({
      password: "",
      newPassword: "",
      newPassword2: "",
    });
  };

  const handleExit = () => {
    setChangePassForm(false);
  };

  useEffect(() => {
    const userNameStorage = localStorage.getItem("userName");
    if (userNameStorage) {
      setUserName(userNameStorage);
    }
  }, []);

  const handleChangePassForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const newFormErrors: any = {};
    console.log("changePassForm state: ", changePassForm);
    let hasError = false;

    for (const [key, value] of Object.entries(formData)) {
      const error = validateField(key, value);
      if (error) {
        console.log("Error: ", key, " ", error);
        newFormErrors[key] = error;
        hasError = true;
      }
    }
    console.log("changePassForm state: ", changePassForm);
    setFormErrors(newFormErrors);
    if (hasError) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Brak tokena. Użytkownik nie jest zalogowany.");
        return;
      }
      console.log("changePassForm state: ", changePassForm);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `https://localhost:${process.env.CLIENT_PORT || 7033}/api/Account/changepassword`,
        {
          ...formData,
        },
        config
      );
      if (response.status === 200) {
        setChangePassForm(false);
        clearForm();
      }
    } catch (error2: any) {
      if (axios.isAxiosError(error2)) {
        console.error("API error:", error2.response?.data);
        setFormErrors((prevState) => ({
          ...prevState,
          error: error2.response?.data || "An unknown API error occurred",
        }));
      } else {
        setFormErrors((prevState) => ({
          ...prevState,
          error: "Unexpected error occurred. Please try again.",
        }));
        console.error("Unexpected error:", error2);
      }
    }
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "password":
        return value.trim() === "" ? "Stare hasło jest wymagane" : "";


      case "newPassword": {
        if (value.trim() === "") {
          return "Hasło jest wymagane";
        }
        const passwordRegex = /(?=.\d)(?=[a-z])(?=[A-Z]).{4,15}$/;
        if (!passwordRegex.test(value.trim())) {
          return "Za słabe hasło";
        }
        return "";
      }
      case "newPassword2": {
        if (value.trim() === "") return "Hasło jest wymagane";
        else if (value.trim() !== formData.newPassword.trim())
          return "Hasła musza być takie same";
        else return "";
      }




      default:
        return "";
    }
  };

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
      .delete(`https://localhost:${process.env.CLIENT_PORT || 7033}/api/account/deleteaccount`, config)
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
          <h1 className="setting-item">{userName.toUpperCase()}</h1>
          <p className="setting-item">
            <Button
              onClick={() => {
                setChangePassForm(true);
                clearForm();
              }}
              className="setting-header"
            >
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
            <Button onClick={handleRemoveAccount} className="setting-header">
              USUŃ KONTO
            </Button>
          </p>
        </div>

        {changePassForm && (
          <>
            <div className="overlayBackground"></div>
            <form className="overlay">
              <Button onClick={handleExit} className="exitButton">
                x
              </Button>
              <div className="inputBasic">
                <label>Stare hasło:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {formErrors.password && (
                  <span className="error">{formErrors.password}</span>
                )}
                <div className="inputBasic">
                  <label>Nowe hasło:</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                  {formErrors.newPassword && (
                    <span className="error">{formErrors.newPassword}</span>
                  )}
                </div>
                <div className="inputBasic">
                  <label>Powtórz nowe hasło:</label>
                  <input
                    type="password"
                    name="newPassword2"
                    value={formData.newPassword2}
                    onChange={handleChange}
                  />
                  {formErrors.newPassword2 && (
                    <span className="error">{formErrors.newPassword2}</span>
                  )}
                </div>

                {formErrors.error && (
                  <div className="error-message">{formErrors.error}</div>
                )}
              </div>
              <Button onClick={handleChangePassForm} className="buttonMenu2">
                Zmień haslo
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
