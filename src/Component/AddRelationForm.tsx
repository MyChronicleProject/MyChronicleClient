import { Button, Container, Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import "../Styles/appBarStyle.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { RelationType } from "../Models/Relation";
import {
  Relation,
  getRelationTypeNumber,
  getRelationTypeName,
} from "../Models/Relation";
import { Person } from "../Models/Person";

export default function AddRelationForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { familyTreeId } = useParams<{ familyTreeId: string }>();
  const { personId } = useParams<{ personId: string }>();
  const [isChecked, setIsChecked] = useState(false);
  const [theSameError, setTheSameError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [formName, setFormName] = useState<string>("");
  const [buttonSubmitName, setButtonSubmitName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [personList, setPersonList] = useState<Person[]>([]);

  const [formData, setFormData] = useState({
    personId_1: "",
    personId_2: "",
    relationType: "Child",
    startDate: "",
    endDate: "",
  });

  const resetForm = () => {
    setFormData({
      personId_1: "",
      personId_2: "",
      relationType: "Child",
      startDate: "",
      endDate: "",
    });
  };

  const [formErrors, setFormErrors] = useState({
    personId_1: "",
    personId_2: "",
    relationType: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    console.log("W use efekt");
    resetForm();
    axios
      .get<Person[]>(
        `https://localhost:7033/api/Familytrees/${familyTreeId}/persons`
      )
      .then((response) => {
        console.log(response.data);
        setPersonList(response.data);
      })
      .catch(() => {
        setError("Error fetching persons");
      })
      .finally(() => {
        setLoading(false);
      });
    if (id) {
      setFormName("Edycja relacji");
      setButtonSubmitName("Edytuj relacje");
      console.log("MamId");
      const fetchRelation = async () => {
        try {
          const response = await axios.get<Relation>(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${personId}/relations/${id}`
          );
          const relationData = response.data;

          console.log("Request Payload:", relationData);
          setFormData({
            personId_1: relationData.personId_1,
            personId_2: relationData.personId_2 || "",
            relationType: getRelationTypeName(
              parseInt(relationData.relationType)
            ),
            startDate: relationData.startDate.slice(0.1),
            endDate: relationData.endDate
              ? relationData.endDate.slice(0, 10)
              : "",
          });
        } catch (err) {
          setError("Failed to fetch relation data");
        } finally {
          setLoading(false);
        }
      };
      fetchRelation();
    } else {
      setFormName("Dodawanie relacji");
      setButtonSubmitName("Dodaj relacje");
      if (personId) {
        setFormData((prevData) => ({
          ...prevData,
          personId_1: personId,
          personId_2: personId,
        }));
        console.log("Person1 z link: ", personId);
        console.log("Person2 z link: ", personId);
      }
      setLoading(false);
    }
  }, [id]);

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
      case "personId_1":
        console.log("PersonId_1: ", value);
        return value.trim() === "" ? "Wybór osoby jest wymagany" : "";
      case "personId_2":
        console.log("PersonId_2: ", value);
        return value.trim() === "" ? "Wybór osoby jest wymagany" : "";
      case "endDate":
        return "";
      case "startDate":
        return value.trim() === ""
          ? "Data rozpoczęcia relacji jest wymagana"
          : "";
      case "relationType":
        return "";
      default:
        return "";
    }
  };

  const getFormattedDate = (date: string | null | undefined) => {
    return date ? date.split("T")[0] : "";
  };

  const ifTheSame = async () => {
    const response = await axios.get<Relation>(
      `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${personId}/relations/${id}`
    );
    const relationData = response.data;
    if (formData.personId_1 != relationData.personId_1) {
      console.log("ID1");
      return false;
    }
    if (formData.personId_2 != relationData.personId_2) {
      console.log("ID2");
      return false;
    }
    if (formData.startDate !== relationData.startDate.split("T")[0]) {
      console.log("startdate");
      return false;
    }
    if (relationData.startDate && relationData.endDate.includes("T")) {
      if (formData.startDate !== relationData.endDate.split("T")[0]) {
        console.log("enddate");
        return false;
      }
    }
    if (
      getRelationTypeNumber(formData.relationType).toString() !==
      relationData.relationType.toString()
    ) {
      console.log("relation");
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
      if (id) {
        if (await ifTheSame()) {
          setTheSameError("Nie zmieniono żadnej wartości");
          return;
        }
        const response = await axios.put(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${personId}/relations/${id}`,
          {
            ...formData,
            id: id,
            startDate: formData.startDate.split("T")[0],
            endDate: formData.endDate
              ? formData.endDate.split("T")[0]
              : undefined,
            relationType: getRelationTypeNumber(formData.relationType),
          }
        );
      } else {
        const response = await axios.post(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${personId}/relations`,
          {
            ...formData,
            startDate: formData.startDate.split("T")[0],
            endDate: formData.endDate
              ? formData.endDate.split("T")[0]
              : undefined,
            relationType: getRelationTypeNumber(formData.relationType),
          }
        );
      }
      navigate("/treeviewedition");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1> {formName} </h1>
        {theSameError && <div className="error-message">{theSameError}</div>}
        <div>
          <label>Wybierz osobę:</label>
          <select
            name="personId_1"
            value={formData.personId_1}
            onChange={handleChange}
          >
            {personList.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} {person.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Wybierz osobę2:</label>
          <select
            name="personId_2"
            value={formData.personId_2}
            onChange={handleChange}
          >
            {personList.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} {person.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Data rozpoczęcia:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate.slice(0, 10)}
            onChange={handleChange}
          />
          {formErrors.startDate && (
            <div className="error-message">{formErrors.startDate}</div>
          )}
        </div>
        <div>
          <label>Data zakończenia:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate.slice(0, 10)}
            onChange={handleChange}
          />
          {formErrors.endDate && (
            <div className="error-message">{formErrors.endDate}</div>
          )}
        </div>
        <div>
          <label>Relacja:</label>
          <select
            name="relationType"
            value={formData.relationType}
            onChange={handleChange}
          >
            {Object.values(RelationType).map((relationType) => (
              <option key={relationType} value={relationType}>
                {relationType}
              </option>
            ))}
          </select>
        </div>
        <button type="submit"> {buttonSubmitName} </button>
      </form>
    </div>
  );
}
