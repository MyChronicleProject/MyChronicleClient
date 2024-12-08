import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { FamilyTree } from "../Models/FamilyTree";
import { useState, useEffect } from "react";
import axios from "axios";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import "../Styles/buttonMenu.css";
import "../Styles/inputFieldsMenu.css";
import "../Styles/openTreeStyle.css";

export default function OpenTree() {
  const [trees, setTrees] = useState<FamilyTree[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addTreeForm, setAddTreeForm] = useState<boolean>(true);

  const [formData, setFormData] = useState({
    name: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
  });

  useEffect(() => {
    setLoading(true);
    setAddTreeForm(false);
    axios
      .get<FamilyTree[]>("https://localhost:7033/api/FamilyTrees")
      .then((response) => {
        setTrees(response.data);
      })
      .catch(() => {
        setError("Error fetching trees");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateTree = () => {
    if (formData.name.trim() === "") {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        name: "Nazwa jest wymagana",
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        name: "",
      }));
      axios
        .post("https://localhost:7033/api/FamilyTrees", formData)
        .then((response) => {
          console.log("Tree created", response.data);
          setTrees((prevTrees) => [...prevTrees, response.data]);
          setFormData({ name: "" });

          axios
            .get<FamilyTree[]>("https://localhost:7033/api/FamilyTrees")
            .then((response) => {
              setTrees(response.data);
            })
            .catch(() => {
              setError("Error fetching trees");
            });
          setAddTreeForm(false);
        })
        .catch((error) => {
          console.error("Error creating tree:", error);
        });
    }
  };

  const deleteTree = (id: string) => {
    axios
      .delete(`https://localhost:7033/api/FamilyTrees/${id}`)
      .then(() => {
        setTrees((prevTrees) => prevTrees.filter((tree) => tree.id !== id));
        console.log("Tree deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting tree:", error);
      });
  };

  return (
    <div>
      <div className="App4">
        <AppBar />
        <div className="app-container">
          <form className="form-container">
            <h1 className="header">OTWÓRZ Z PLIK JSON</h1>
            <div className="file-setup">
              <input type="file" accept=".json" className="file-input" />
              <Button
                as={NavLink}
                to={`/treeView`}
                className="button open-button"
              >
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
                      <Button
                        as={NavLink}
                        to={`/treeViewEdition/${familyTree.id}`}
                        className="button open-button"
                      >
                        EDYTUJ
                      </Button>
                      <Button
                        as={NavLink}
                        to={`/${familyTree.id}`}
                        className="button open-button"
                      >
                        OTWÓRZ
                      </Button>
                      <Button
                        className="button open-button"
                        onClick={() => deleteTree(familyTree.id)}
                      >
                        USUŃ
                      </Button>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Button onClick={() => setAddTreeForm(true)}>
            Dodaj nowe drzewo
          </Button>
          {addTreeForm && (
            <form>
              <div>
                <label>Nazwa:</label>
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
              <Button onClick={handleCreateTree}>Stwórz nowe drzewo</Button>
            </form>
          )}
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
