import logo from "../../logo.png";
import AppBar from "../AppBars/AppBar";
import BottomBar from "../AppBars/BottomBar";
import { useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../../Styles/buttonMenu.css";
import "../../Styles/inputFieldsMenu.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import PrivacyPolicy from ".././PrivacyPolicy";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    login: "",
    password: "",
    password2: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    lastName: "",
    login: "",
    password: "",
    password2: "",
    privacyPolicy: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name": {
        return value.trim() === "" ? "Imię jest wymagane" : "";
      }
      case "middleName":
        return "";
      case "lastName":
        return value.trim() === "" ? "Nazwisko jest wymagane" : "";
      case "login":
        return value.trim() === "" ? "Login jest wymagany" : "";
      case "password":
        return value.trim() === "" ? "Hasło jest wymagane" : "";
      case "password2": {
        if (value.trim() === "") return "Hasło jest wymagane";
        else if (value.trim() !== formData.password.trim())
          return "Hasła muszą być takie same";
        else return "";
      }
      default:
        return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("W handleSubmit");
    e.preventDefault();

    const newFormErrors: any = {};
    let hasError = false;

    for (const [key, value] of Object.entries(formData)) {
      const error = validateField(key, value);
      if (error) {
        console.log("Error: ", key, " ", error);
        newFormErrors[key] = error;
        hasError = true;
      }
    }

    if (!isChecked) {
      newFormErrors.privacyPolicy = "Musisz zaakceptować politykę prywatności.";
      hasError = true;
    }

    setFormErrors(newFormErrors);
    if (hasError) {
      return;
    }

    try {
      const response = await axios.post(
        `https://localhost:7033/api/Familytrees//persons`,
        {
          ...formData,
        }
      );

      navigate("/treeviewedition");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div>
      <AppBar />
      <div className="App">
        <img src={logo} className="App-logo" alt="logo"></img>
        <form className="inputRegister">
          <div>
            <label>Imię:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && (
              <span className="error">{formErrors.name}</span>
            )}
          </div>
          <div>
            <label>Nazwisko:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            {formErrors.name && (
              <span className="error">{formErrors.lastName}</span>
            )}
          </div>
          <div>
            <label>Login:</label>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
            />
            {formErrors.name && (
              <span className="error">{formErrors.login}</span>
            )}
          </div>
          <div>
            <label>Hasło:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.name && (
              <span className="error">{formErrors.password}</span>
            )}
          </div>
          <div>
            <label>Powtórz hasło:</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
            />
            {formErrors.name && (
              <span className="error">{formErrors.password2}</span>
            )}
          </div>
        </form>
        <div>
          <p>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            AKCEPTUJĘ POLITYKĘ PRYWATNOŚCI
          </p>
          <Button as={NavLink} to={`/privacyPolicy`} className="link">
            POLITYKA PRYWATNOŚCI
          </Button>
          {formErrors.name && (
            <span className="error">{formErrors.privacyPolicy}</span>
          )}
        </div>

        <Button className="buttonMenu2" onClick={handleSubmit}>
          ZAŁÓŻ KONTO
        </Button>
      </div>
      <BottomBar />
    </div>
  );
}
