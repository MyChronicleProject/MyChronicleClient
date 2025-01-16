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
    displayName: "",
    userName: "",
    email: "",
    password: "",
    password2: "",
  });

  const [formErrors, setFormErrors] = useState({
    displayName: "",
    userName: "",
    email: "",
    password: "",
    password2: "",
    privacyPolicy: "",
    error: "",
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
      case "displayName": {
        return value.trim() === "" ? "Imię i nazwisko jest wymagane" : "";
      }
      case "userName":
        return value.trim() === "" ? "Nazwa użytkownika jest wymagana" : "";
      case "email":
        if (value.trim() === "") {
          return "Email is required";
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]+|\d+)$/;

        if (!emailRegex.test(value.trim())) {
          return "Please enter a valid email address";
        }
        return "";
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
        `https://localhost:7033/api/Account/register`,
        {
          ...formData,
        }
      );
      const { token, displayName, userName } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("displayName", displayName);
      localStorage.setItem("userName", userName);
      navigate("/openTree");
    } catch (error2: any) {
      if (axios.isAxiosError(error2)) {
        console.error("API error:", error2.response?.data);
        setFormErrors((prevState) => ({
          ...prevState,
          error: error2.response?.data || "An unknown API error occurred",
        }));
        console.log("Error: ", formErrors);
      } else {
        setFormErrors((prevState) => ({
          ...prevState,
          error: "Unexpected error occurred. Please try again.",
        }));
        console.error("Unexpected error:", error2);
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
            <label>Imię i nazwisko</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
            />
            {formErrors.displayName && (
              <span className="error">{formErrors.displayName}</span>
            )}
          </div>
          <div>
            <label>Nazwa użytkownika:</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
            />
            {formErrors.userName && (
              <span className="error">{formErrors.userName}</span>
            )}
          </div>
          <div>
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <span className="error">{formErrors.email}</span>
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
            {formErrors.password && (
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
            {formErrors.password2 && (
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
        </div> {formErrors.privacyPolicy && (
          <span className="error">{formErrors.privacyPolicy}</span>
        )}
        {formErrors.error && <span className="error">{formErrors.error}</span>}

        <Button className="buttonMenu2" onClick={handleSubmit}>
          ZAŁÓŻ KONTO
        </Button>
      </div>
      <BottomBar />
    </div>
  );
}
