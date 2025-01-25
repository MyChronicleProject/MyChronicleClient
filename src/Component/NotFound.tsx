import logo from "../logo.png";
import { Button, Container } from "semantic-ui-react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/settingsPageStyle.css";
import axios from "axios";
import { useEffect, useState } from "react";
import AppBar from "./AppBars/AppBar";
import { color } from "html2canvas/dist/types/css/types/color";


export default function NotFound() {
    return (

        <div className="App2">
            <AppBar />

            <div>
                <img src={logo} className="App-logo1" alt="logo"></img>
                <h1 style={{ color: "white", fontSize: "36px", fontFamily: "Times New Roman, sans-serif", textShadow: "1px 1px 0px black, -1px 1px 0px black, 1px -1px 0px black, -1px -1px 0px black", marginTop: "30px" }}>
                    Page Not Found
                </h1>
                <h2 style={{ color: "white", fontSize: "20px", fontFamily: "Times New Roman, sans-serif", marginTop: "0px" }}>
                    Return to previous page
                </h2>

            </div>

        </div>


    )
}