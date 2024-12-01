import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { FamilyTree } from '../Models/FamilyTree'
import { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div>
            <h1>OTWÓRZ Z PLIK JSON</h1>
            <input type="file" accept=".json" />
            <Button as={NavLink} to={`/`}>OTWÓRZ</Button>
            <h1> TWOJE PLIKI</h1>

            <div>
                <ul>
                    {trees.map(familyTree => (
                        <li key={familyTree.id}>
                            <div>
                                <h2>{familyTree.name}</h2>
                                <Button as={NavLink} to={`/`}>OTWÓRZ </Button>
                                <Button as={NavLink} to={`/`}>EDYTUJ</Button>
                            </div>
                        </li>
                    ))}
                </ul>

            </div>

        </div>
    )
}