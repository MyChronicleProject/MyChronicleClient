import React from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import AppBar from "./Component/AppBars/AppBar";

function App() {
  const appStyles: React.CSSProperties = {
    backgroundColor: "#D9D9D9",
    minHeight: "100vh",
    margin: 0,
  };
  return (
    <div style={appStyles}>
      <Outlet />
    </div>
  );
}

export default App;
