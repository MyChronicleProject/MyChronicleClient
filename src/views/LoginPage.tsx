import logo from "../logo.png";
import { Button } from "semantic-ui-react";
import { NavLink, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "../Styles/buttonMenu.css";
import "../Styles/inputFieldsMenu.css";
import AppBar from "../components/AppBars/AppBar";
import BottomBar from "../components/AppBars/BottomBar";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    error: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email === "" && formData.password === "") {
      setFormErrors({
        error: "Wypełnij pola email i hasło",
      });
      return;
    }
    try {
      const response = await axios.post(
        `https://localhost:${process.env.CLIENT_PORT || 7033}/api/Account/login`,
        {
          ...formData,
        }
      );
      const { token, displayName, userName } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("displayName", displayName);
      localStorage.setItem("userName", userName);
      navigate("/openTree");
    } catch (error) {
      setFormErrors({
        error: "Failed login attempt, please check your details and try again",
      });
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
      <div className="App2">
        <img src={logo} className="App-logo" alt="logo"></img>
        <form>
          <label>Email:</label>
          <div className="inputRegister">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <label>Hasło:</label>
          <div className="inputRegister">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </form>
        {formErrors.error && (
          <span className="error">{formErrors.error}</span>
        )}
        <Button onClick={handleSubmit} className="buttonMenu">
          ZALOGUJ SIĘ
        </Button>
        <p>
          NIE MASZ KONTA?
          <Button as={NavLink} to={`/register`} className="link">
            ZAREJESTRUJ SIĘ
          </Button>
        </p>
      </div>
      <BottomBar />
    </div>
  );
}
