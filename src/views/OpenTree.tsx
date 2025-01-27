import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { FamilyTree } from "../models/FamilyTree";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppBar from "../components/AppBars/AppBar";
import BottomBar from "../components/AppBars/BottomBar";
import "../Styles/buttonMenu.css";
import "../Styles/inputFieldsMenu.css";
import "../Styles/openTreeStyle.css";
import "../Styles/openFileStyle.css";
import { Role } from "../models/FamilyTreePermision";
import { getRoleName } from "../models/FamilyTree";

export default function OpenTree() {
  const navigate = useNavigate();
  const [trees, setTrees] = useState<FamilyTree[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addTreeForm, setAddTreeForm] = useState<boolean>(false);
  const [fileContent, setFileContent] = useState<any>(null);
  const [treeData, setTreeData] = useState<any>();
  const [formData, setFormData] = useState({
    name: "",
    layout: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Drzewa: ", trees);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsedData = JSON.parse(reader.result as string) as FamilyTree;
          setFileContent(parsedData);
          console.log("Wczytano plik JSON:", parsedData);
          console.log("FileContent: ", fileContent);
        } catch (error) {
          console.error("Błąd parsowania JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleOpenFile = () => {
    console.log("W metodzie");
    if (fileContent) {
      console.log("Otwarto plik JSON:", fileContent);
      const familyTreeId = fileContent.familyTreeId;
      console.log("ID drzewa:", familyTreeId);
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
        .post(
          `http://localhost:${process.env.REACT_APP_CLIENT_PORT || 7033}/api/FamilyTrees/${familyTreeId}/share`,
          {},
          config
        )
        .then((response) => {
          console.log("Tree adedd", response.data);
          setTrees((prevTrees) => [...prevTrees, response.data]);
          setFormData({ name: "", layout: "" });
        })
        .catch((error) => {
          console.error("Error creating tree:", error);
        });
      navigate(`/treeView/${familyTreeId}`, {
        state: { treeData: fileContent },
      });
    } else {
      console.error("Nie wybrano pliku lub plik jest niepoprawny.");
    }
  };

  const handleOpenFileWithEditMode = () => {
    console.log("W metodzie");
    if (fileContent) {
      console.log("Otwarto plik JSON:", fileContent);
      const familyTreeId = fileContent.familyTreeId;
      console.log("ID drzewa:", familyTreeId);
      navigate(`/treeViewEdition/${familyTreeId}`, {
        state: { treeData: fileContent },
      });
    } else {
      console.error("Nie wybrano pliku lub plik jest niepoprawny.");
    }
  };

  useEffect(() => {
    setLoading(true);
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
      .get<FamilyTree[]>("http://localhost:${process.env.REACT_APP_CLIENT_PORT || 7033}/api/FamilyTrees", config)
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

  const handleCreateTree = async (e: React.FormEvent) => {
    e.preventDefault();
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
        .post("http://localhost:${process.env.REACT_APP_CLIENT_PORT || 7033}/api/FamilyTrees", formData, config)
        .then((response) => {
          console.log("Tree created", response.data);
          setTrees((prevTrees) => [...prevTrees, response.data]);
          setFormData({ name: "", layout: "" });

          axios
            .get<FamilyTree[]>("http://localhost:${process.env.REACT_APP_CLIENT_PORT || 7033}/api/FamilyTrees", config)
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
      // .delete(`http://localhost:${process.env.REACT_APP_CLIENT_PORT || 7033}/api/FamilyTrees/${id}`, config)
      .delete(`http://localhost:${process.env.REACT_APP_CLIENT_PORT || 7033}/api/FamilyTreePermision/${id}`, config)
      .then(() => {
        setTrees((prevTrees) => prevTrees.filter((tree) => tree.id !== id));
        console.log("Tree deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting tree:", error);
      });
  };

  const handleExit = () => {
    setAddTreeForm(false);
  };

  return (
    <div>
      <AppBar />
      <div className="App5">
        <div className="app-container">
          <form className="form-container">
            <h1 className="header">OTWÓRZ Z PLIK JSON</h1>
            <div className="file-setup">
              <input
                type="file"
                accept=".json"
                className="file-input"
                onChange={handleFileChange}
              />

              <Button
                type="button"
                className="button open-button"
                onClick={handleOpenFile}
              >
                OTWÓRZ
              </Button>
              {/* <Button
                type="button"
                className="button open-button"
                onClick={handleOpenFileWithEditMode}
              >
                Edit
              </Button> */}
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
                      {getRoleName(parseInt(familyTree.currentUserRole)) ===
                        Role.Autor && (
                          <Button
                            as={NavLink}
                            to={`/treeViewEdition/${familyTree.id}`}
                            className="button open-button"
                          >
                            EDYTUJ
                          </Button>
                        )}
                      <Button
                        as={NavLink}
                        to={`/treeView/${familyTree.id}`}
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
          <Button onClick={() => setAddTreeForm(true)} className="buttonMenu3">
            Dodaj nowe drzewo
          </Button>
          {addTreeForm && (
            <>
              <div className="overlayBackground"></div>
              <form className="overlay">
                <Button onClick={handleExit} className="exitButton">
                  x
                </Button>
                <div className="inputBasic">
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
                <Button onClick={handleCreateTree} className="buttonMenu2">
                  Stwórz nowe drzewo
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
