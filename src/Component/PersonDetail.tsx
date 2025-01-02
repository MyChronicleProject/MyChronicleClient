import logo from "../logo.png";
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../Styles/buttonMenu.css";
import React, { useState, useEffect } from "react";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import { Gender } from "../Models/Person";
import axios from "axios";
import { Person, getGenderNumber, getGenderName } from "../Models/Person";

export default function PersonDetail({
  selectedNodeId,
}: {
  selectedNodeId: any;
}) {
  const [error, setError] = useState<string | null>(null);
  const { familyTreeId } = useParams<{ familyTreeId: string }>();
  const [formData, setFormData] = useState({
    name: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    deathDate: "",
    birthPlace: "",
    deathPlace: "",
    gender: "male",
    occupation: "",
    note: "",
  });

  useEffect(() => {
    if (selectedNodeId) {
      const fetchPerson = async () => {
        try {
          const response = await axios.get<Person>(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${selectedNodeId}`
          );
          const personData = response.data;

          console.log("Request Payload:", personData);

          setFormData({
            name: personData.name,
            middleName: personData.middleName || "",
            lastName: personData.lastName || "",
            birthDate: personData.birthDate.slice(0.1),
            deathDate: personData.deathDate
              ? personData.deathDate.slice(0, 10)
              : "",
            birthPlace: personData.birthPlace || "",
            deathPlace: personData.deathPlace || "",
            gender: getGenderName(parseInt(personData.gender)),
            occupation: personData.occupation || "",
            note: personData.note || "",
          });
        } catch (err) {
          setError("Failed to fetch person data");
        } finally {
        }
      };

      fetchPerson();
    } else {
    }
  }, [selectedNodeId]);

  return (
    <div>
      <form>
        <h1> SZCZEGÓŁY </h1>
        <div>
          <label>Imię:</label>
          <input type="text" name="name" value={formData.name} readOnly />
        </div>
        <div>
          <label>Drugie imie:</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            readOnly
          />
        </div>
        <div>
          <label>Nazwisko:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            readOnly
          />
        </div>
        <div>
          <label>Data urodzenia:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate.slice(0, 10)}
            readOnly
          />
        </div>
        <div>
          <label>Data śmierci:</label>
          <input
            type="date"
            name="deathDate"
            value={formData.deathDate.slice(0, 10)}
            readOnly
          />
        </div>
        <div>
          <label>Miejsce urodzenia:</label>
          <input
            type="text"
            name="birthPlace"
            value={formData.birthPlace}
            readOnly
          />
        </div>
        <div>
          <label>Miejsce śmierci:</label>
          <input
            type="text"
            name="deathPlace"
            value={formData.deathPlace}
            readOnly
          />
        </div>
        <div>
          <label>Płeć:</label>
          <select name="gender" value={formData.gender} disabled>
            {Object.values(Gender).map((gender) => (
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
            readOnly
          />
        </div>
        <div>
          <label>Notatka:</label>
          <input type="text" name="note" value={formData.note} readOnly />
        </div>
      </form>
    </div>
  );
}
