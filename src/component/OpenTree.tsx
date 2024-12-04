import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { FamilyTree } from '../Models/FamilyTree'
import { useState, useEffect } from 'react';
import axios from 'axios';
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import '../Styles/buttonMenu.css';
import '../Styles/inputFieldsMenu.css';
import '../Styles/openTreeStyle.css';

export default function OpenTree() {
    const [trees, setTrees] = useState<FamilyTree[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        axios.get<FamilyTree[]>('https://localhost:7033/api/FamilyTrees')
            .then((response) => {
                setTrees(response.data);
            })
            .catch(() => {
                setError('Error fetching trees');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="App4">
            <AppBar />
            <div className="app-container">
                <form className="form-container">
                    <h1 className="header">OTWÓRZ Z PLIK JSON</h1>
                    <div className="file-setup">
                    <input type="file" accept=".json" className="file-input" />
                    <Button as={NavLink} to={`/`} className="button open-button">
                        OTWÓRZ
                    </Button>
                    </div>
                   
                </form>
                <h1 className="header">TWOJE PLIKI</h1>
                <div className="file-container">
                    <ul className="file-list">
                        {trees.map((familyTree) => (
                            <li key={familyTree.id} className="file-item">
                                <div className="file-details">
                                    <h2 className="file-name">{familyTree.name}</h2>
                                    <p>
                                    <Button as={NavLink} to={`/`} className="button open-button">
                                        EDYTUJ
                                    </Button>
                                    <Button as={NavLink} to={`/`} className="button open-button">
                                        OTWÓRZ
                                    </Button>
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <BottomBar />
        </div>
    );
};
