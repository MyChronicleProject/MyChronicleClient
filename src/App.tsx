import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import  AppBar  from './Component/AppBar';

function App() {
    const appStyles: React.CSSProperties = {
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
        margin: 0,
    };
    return (

        <div style={appStyles}>
            <AppBar />
            <Outlet />
        </div>

    );
}

export default App;