import logo from '../logo.svg';
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import React, { useState } from 'react';
import { Gender } from '../Models/Person'

export default function AddPersonForm() {

    const [isChecked, setIsChecked] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        middleName: '',
        lastName: '',
        birthDate: '',
        deathDate: '',
        birthPlace: '',
        deathPlace: '',
        gender: '',
        occupation: '',
        note: '',
    });


    return (
        <div>
            <form >
                <h1>DODAWANIE OSOBY</h1>
                <input type="file" accept=".jpg, .png" />
                <div>
                    <label>Imiê:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                    />
                </div>
                <div>
                    <label>Drugie imie:</label>
                    <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                    />
                </div>
                <div>
                    <label>Nazwisko:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                    />
                </div>
                <div>
                    <label>Data urodzenia:</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate.slice(0, 10)}
                    />
                </div>
                <div>
                    <label>Data œmierci:</label>
                    <input
                        type="date"
                        name="deathDate"
                        value={formData.deathDate.slice(0, 10)}
                    />
                </div>
                <div>
                    <label>Miejsce urodzenia:</label>
                    <input
                        type="text"
                        name="birthPlace"
                        value={formData.birthDate}
                    />
                </div>
                <div>
                    <label>Miejsce œmierci:</label>
                    <input
                        type="text"
                        name="deathPlace"
                        value={formData.deathPlace}
                    />
                </div>
                <div>
                    <label>P³eæ:</label>
                    <select
                        name="gender"
                        value={formData.gender}
                    >
                        {Object.values(Gender).map(gender => (
                            <option key={gender} value={gender}>
                                {gender}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Zawód:</label>
                    <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                    />
                </div>
                <div>
                    <label>Notatka:</label>
                    <input
                        type="note"
                        name="occupation"
                        value={formData.note}
                    />
                </div>
            </form>


            <Button as={NavLink} to={`/`} className="button-container" >DODAJ DO DRZEWA</Button>
        </div>
    )
}