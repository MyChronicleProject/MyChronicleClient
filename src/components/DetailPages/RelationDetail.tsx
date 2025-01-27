import "../../Styles/appBarStyle.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { RelationType } from "../../models/Relation";
import { Relation, getRelationTypeName } from "../../models/Relation";
import { Person } from "../../models/Person";

export default function AddRelationForm({
  selectedEdgeId,
}: {
  selectedEdgeId: any;
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { familyTreeId } = useParams<{ familyTreeId: string }>();
  const { personId } = useParams<{ personId: string }>();

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

  useEffect(() => {
    console.log("W use efekt");
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Brak tokena. Użytkownik nie jest zalogowany.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get<Person[]>(
        `http://localhost:${process.env.REACT_APP_CLIENT_PORT || 7033}/api/Familytrees/${familyTreeId}/persons`,
        config
      )
      .then((response) => {
        console.log(response.data);
        setPersonList(response.data);
      })
      .catch(() => {
        setError("Error fetching persons");
      })
      .finally(() => {});
    if (selectedEdgeId) {
      console.log("MamId: ", selectedEdgeId);
      const fetchRelation = async () => {
        try {
          const token = localStorage.getItem("token");

          if (!token) {
            console.error("Brak tokena. Użytkownik nie jest zalogowany.");
            return;
          }

          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get<Relation>(
            `http://localhost:${process.env.REACT_APP_CLIENT_PORT || 7033}/api/Familytrees/${familyTreeId}/persons/${selectedEdgeId.personId_1}/relations/${selectedEdgeId.id}`,
            config
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
        }
      };
      fetchRelation();
    }
  }, [selectedEdgeId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <form>
        <h1 className="FileForm-header"> Szczegóły </h1>
        <div className="inputForm">
          <label>Wybierz osobę:</label>
          <select
            name="personId_1"
            value={formData.personId_1}
            disabled
            className="non-editable"
          >
            {personList.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} {person.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="inputForm">
          <label>Osoba 1:</label>
          <select
            name="personId_2"
            value={formData.personId_2}
            disabled
            className="non-editable"
          >
            {personList.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} {person.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="inputForm">
          <label>Data rozpoczęcia:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate.slice(0, 10)}
            readOnly
          />
        </div>
        <div className="inputForm">
          <label>Data zakończenia:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate.slice(0, 10)}
            readOnly
          />
        </div>
        <div className="inputForm">
          <label>Relacja:</label>
          <select
            name="relationType"
            value={formData.relationType}
            disabled
            className="non-editable"
          >
            {Object.values(RelationType).map((relationType) => (
              <option key={relationType} value={relationType}>
                {relationType}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
}
