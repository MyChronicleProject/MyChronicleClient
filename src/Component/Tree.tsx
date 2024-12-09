import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Person } from '../models/Person';
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";


export default function Tree() {
    const [person, setPerson] = useState<Person[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        axios.get<Person[]>('https://localhost:7033/api/Familytrees/08dd0676-a7e3-49ab-84dc-0417de93a67e/persons')
            .then((response) => {
                console.log(response.data);
                setPerson(response.data);
            })
            .catch(() => {
                setError('Error fetching cars');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
       
        <div >
            <h1>Drzewo</h1>
            <ul>
                {person.map(person => (
                    <li key={person.id}>
                        <h2><center>{person.name} {person.lastName}</center></h2>
                        <div>
                            <center>
                                <NavLink to={`/treeviewedition/${person.id}`} className="button nav-link">
                                    Edit
                                </NavLink>
                            </center>
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
}