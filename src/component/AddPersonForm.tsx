import logo from "../logo.svg";
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Gender } from "../Models/Person";
import axios from "axios";
import { Person, getGenderNumber, getGenderName } from "../Models/Person";
import { useNavigate } from "react-router-dom";

export default function AddPersonForm({
  selectedNode,
  personAdded,
}: {
  selectedNode: any;
  personAdded: (person: any) => void;
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [theSameError, setTheSameError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [formName, setFormName] = useState<string>("");
  const [buttonSubmitName, setButtonSubmitName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { familyTreeId } = useParams<{ familyTreeId: string }>();
  const [image, setImage] = useState<string | null>(null);

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

  const resetForm = () => {
    setFormData({
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
  };

  const [formErrors, setFormErrors] = useState({
    name: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    deathDate: "",
    birthPlace: "",
    deathPlace: "",
    gender: "",
    occupation: "",
    note: "",
  });

  useEffect(() => {
    resetForm();
    if (selectedNode) {
      setFormName("Edycja osoby");
      setButtonSubmitName("Edytuj osobę");

      const fetchPerson = async () => {
        try {
          const response = await axios.get<Person>(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${selectedNode}`
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
          setLoading(false);
        }
      };

      fetchPerson();
    } else {
      setFormName("Dodawanie osoby");
      setButtonSubmitName("Dodaj osobę");
      setLoading(false);
      console.log("TreeID: ", familyTreeId);
    }
  }, [selectedNode]);

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
      case "name": {
        return value.trim() === "" ? "Imię jest wymagane" : "";
      }
      case "middleName":
        return "";
      case "lastName":
        return value.trim() === "" ? "Nazwisko jest wymagane" : "";
      case "birthDate":
        return value.trim() === "" ? "Data urodzenia jest wymagana" : "";
      case "deathDate":
        return "";
      case "birthPlace":
        return value.trim() === "" ? "Miejsce urodznia jest wymagane" : "";
      case "deathPlace":
        return "";
      case "gender":
        return "";
      case "occupation":
        return "";
      case "note":
        return "";
      default:
        return "";
    }
  };

  const getFormattedDate = (date: string | null | undefined) => {
    return date ? date.split("T")[0] : "";
  };

  const ifTheSame = async () => {
    const response = await axios.get<Person>(
      `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${selectedNode}`
    );
    const personData = response.data;
    if (formData.name != personData.name) {
      console.log("name");
      return false;
    }
    if (personData.middleName || formData.middleName)
      if (formData.middleName !== personData.middleName) {
        console.log("middlename");
        return false;
      }
    if (formData.lastName !== personData.lastName) {
      console.log("lastname");
      return false;
    }
    if (formData.birthPlace !== personData.birthPlace) {
      console.log("birthplace");
      return false;
    }
    if (formData.deathPlace || personData.deathPlace)
      if (formData.deathPlace !== personData.deathPlace) {
        console.log("deathplace");
        return false;
      }
    if (formData.birthDate !== personData.birthDate.split("T")[0]) {
      console.log("birthdate");
      return false;
    }
    if (personData.deathDate && personData.deathDate.includes("T")) {
      if (formData.deathDate !== personData.deathDate.split("T")[0]) {
        console.log("dethdate");
        return false;
      }
    }
    if (formData.occupation || personData.occupation)
      if (formData.occupation !== personData.occupation) {
        console.log("occupation");
        return false;
      }
    if (formData.note || personData.note)
      if (formData.note !== personData.note) {
        console.log("note");
        return false;
      }
    if (
      getGenderNumber(formData.gender).toString() !==
      personData.gender.toString()
    ) {
      console.log("gender");
      return false;
    }
    return true;
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

    setFormErrors(newFormErrors);
    if (hasError) {
      return;
    }

    try {
      if (selectedNode) {
        if (await ifTheSame()) {
          setTheSameError("Nie wprowadzono żadnych zmian");
          return;
        }
        const response = await axios.put(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${selectedNode}`,
          {
            ...formData,
            id: selectedNode,
            birthDate: formData.birthDate.split("T")[0],
            deathDate: formData.deathDate
              ? formData.deathDate.split("T")[0]
              : null,
            gender: getGenderNumber(formData.gender),
            familyTreeId: familyTreeId,
          }
        );
      } else {
        const response = await axios.post(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons`,
          {
            ...formData,
            birthDate: formData.birthDate
              ? formData.birthDate.split("T")[0]
              : null,
            deathDate: formData.deathDate
              ? formData.deathDate.split("T")[0]
              : null,
            gender: getGenderNumber(formData.gender),
            familyTreeId: familyTreeId,
          }
        );

        if (response.status === 200 && response.data) {
          const addedPersonId = response.data;
          const updatedFormData = {
            ...formData,
            id: addedPersonId,
          };
          if (image) {
            const responseFoto = await axios.post(
              `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${updatedFormData.id}/files`,
              {
                name: "",
                fileType: 0,
                content: image,
                fileExtension: 0,
                personId: updatedFormData.id,
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          }
          setImage(null);
          personAdded(updatedFormData);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64String = (reader.result as string).split(",")[1];
          setImage(base64String);
          console.log("Obraz załadowany jako Base64:", base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1> {formName} </h1>
        {theSameError && <div className="error-message">{theSameError}</div>}
        <input
          type="file"
          accept=".jpg, .png"
          className="file-input"
          onChange={handleFileChange}
        />
        <div>
          <label>Imię:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {formErrors.name && (
            <div className="error-message">{formErrors.name}</div>
          )}
        </div>
        <div>
          <label>Drugie imie:</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
          {formErrors.middleName && (
            <div className="error-message">{formErrors.middleName}</div>
          )}
        </div>
        <div>
          <label>Nazwisko:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {formErrors.lastName && (
            <div className="error-message">{formErrors.lastName}</div>
          )}
        </div>
        <div>
          <label>Data urodzenia:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate.slice(0, 10)}
            onChange={handleChange}
          />
          {formErrors.birthDate && (
            <div className="error-message">{formErrors.birthDate}</div>
          )}
        </div>
        <div>
          <label>Data śmierci:</label>
          <input
            type="date"
            name="deathDate"
            value={formData.deathDate.slice(0, 10)}
            onChange={handleChange}
          />
          {formErrors.deathDate && (
            <div className="error-message">{formErrors.deathDate}</div>
          )}
        </div>
        <div>
          <label>Miejsce urodzenia:</label>
          <input
            type="text"
            name="birthPlace"
            value={formData.birthPlace}
            onChange={handleChange}
          />
          {formErrors.birthPlace && (
            <div className="error-message">{formErrors.birthPlace}</div>
          )}
        </div>
        <div>
          <label>Miejsce śmierci:</label>
          <input
            type="text"
            name="deathPlace"
            value={formData.deathPlace}
            onChange={handleChange}
          />
          {formErrors.deathPlace && (
            <div className="error-message">{formErrors.deathPlace}</div>
          )}
        </div>
        <div>
          <label>Płeć:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
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
            onChange={handleChange}
          />
          {formErrors.occupation && (
            <div className="error-message">{formErrors.occupation}</div>
          )}
        </div>
        <div>
          <label>Notatka:</label>
          <input
            type="text"
            name="note"
            value={formData.note}
            onChange={handleChange}
          />
          {formErrors.note && (
            <div className="error-message">{formErrors.note}</div>
          )}
        </div>
        <button type="submit"> {buttonSubmitName} </button>
      </form>
    </div>
  );
}
