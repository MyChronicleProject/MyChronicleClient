import ReactFlow, { MiniMap, Controls, Background, addEdge } from "reactflow";
import "reactflow/dist/style.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Person } from "../Models/Person";
import {
  Relation,
  getRelationTypeNumber,
  RelationType,
} from "../Models/Relation";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";
import ReactDOM from "react-dom/client";
import useZoomPanHelper from "react-flow-renderer";
import "../Styles/buttonMenu.css";
import { Button } from "semantic-ui-react";
import CustomNode from "./CustomNode";
import CustomNodeSpouse from "./CustomNodeSpouse";
const generateEdgeId = () => crypto.randomUUID();

const PlaceholderNode = ({ data }: any) => {
  return (
    <div
      style={{
        padding: "5px",
        width: "15px",
        height: "flex",
        border: "2px solid #9D8772",
        borderLeft: "none",
        borderBottom: "none",
        backgroundColor: "transparent",
        textAlign: "center",
        pointerEvents: "none",
        borderRadius: "8px",
      }}
    >
      {data.label}
    </div>
  );
};

const DeleteNode = ({ data }: any) => {
  return (
    <div
      style={{
        padding: "5px",
        width: "15px",
        height: "flex",
        border: "2px solid #9D8772",
        borderRight: "none",
        borderBottom: "none",
        backgroundColor: "transparent",
        textAlign: "center",
        pointerEvents: "none",
        borderRadius: "8px",
      }}
    >
      {data.label}
    </div>
  );
};

const nodeTypes = {
  placeholder: PlaceholderNode,
  custom: CustomNode,
  delete: DeleteNode,
  customSpouse: CustomNodeSpouse,
};

export default function Tree({
  onNodeClick,
  onEdgeClick,
  onStartView,
  selectedPersonInTree,
  handlePersonAdded,
  handleAddedPersonWithRelation,
  handleRelationAdded,
  handleAddedRelation,
  handleEditedPerson,
}: {
  onNodeClick: (node: any) => void;
  onEdgeClick: (edge: any[]) => void;
  selectedPersonInTree: (personId: any) => void;
  onStartView: (startView: boolean) => void;
  handlePersonAdded: any;
  handleAddedPersonWithRelation: any;
  handleAddedRelation: any;
  handleRelationAdded: (ids: any[]) => void;
  handleEditedPerson: any;
}) {
  const [nodeHeight, setNodeHeight] = useState(0);
  const [person, setPerson] = useState<Person[]>([]);
  const [personAdded, setPersonAdded] = useState<any>();
  const [canCreateNode, setCanCreateNode] = useState<boolean>(false);
  const [relation, setRelation] = useState<Relation[]>([]);
  const [treeExists, setTreeExists] = useState(false);
  const [tree, setTree] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { familyTreeId } = useParams<{ familyTreeId: string }>();
  const [treeData, setTreeData] = useState<any>(null);
  const [isParentIdsFilled, setIsParentIdsFilled] = useState(false);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [downloadRelation, setDownloadRelation] = useState(false);
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const [updateKey, setUpdateKey] = useState(0);
  const { state } = useLocation();

  const [addRelationToExistPerson, setAddRelationToExistsPerson] =
    useState(false);
  let relationId = 0;
  const handleTreeData = state?.treeData;

  useEffect(() => {
    setUpdateKey((prev) => prev + 1);
  }, [nodes]);

  const downloadPDF = () => {
    const input = pdfRef.current;
    if (!input) {
      console.error("pdfRef is not assigned to any element.");
      return;
    }
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("test.pdf");
    });
  };

  const saveTreeToFile = () => {
    const sanitizedNodes = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        label:
          typeof node.data.label === "string"
            ? node.data.label
            : convertLabelToText(node.data.label),
      },
    }));

    const sanitizedEdges = edges.map((edge) => ({
      ...edge,
    }));

    const treeData = {
      familyTreeId,
      nodes: sanitizedNodes,
      edges: sanitizedEdges,
    };

    const blob = new Blob([JSON.stringify(treeData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "familyTree.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const convertLabelToText = (label: any): string => {
    if (React.isValidElement(label)) {
      const extractTextFromElement = (element: React.ReactNode): string => {
        if (typeof element === "string") {
          return element;
        }
        if (Array.isArray(element)) {
          return element.map(extractTextFromElement).join("");
        }
        if (React.isValidElement(element)) {
          if (element.type === "br") {
            return "\\n";
          }
          return extractTextFromElement(element.props.children);
        }
        return "";
      };

      return extractTextFromElement(label);
    }

    return String(label);
  };

  useEffect(() => {
    if (treeData) {
      const { nodes, edges } = treeData;

      setNodes(nodes);
      setEdges(edges);
    }
  }, [treeData]);

  useEffect(() => {
    console.log("TreeData: ", handleTreeData);
    if (handleTreeData) {
      if (handleTreeData.nodes && handleTreeData.edges) {
        const updatedNodes = handleTreeData.nodes.map((node: any) => ({
          ...node,
          data: {
            ...node.data,
            label:
              typeof node.data.label === "string"
                ? convertTextToLabel(node.data.label)
                : node.data.label,
          },
        }));

        setNodes(updatedNodes);
        setEdges(handleTreeData.edges);

        console.log("Wczytano węzły:", updatedNodes);
        console.log("Wczytano krawędzie:", handleTreeData.edges);
      } else {
        alert("Plik nie zawiera wymaganych danych: nodes i edges.");
      }
    }
  }, [handleTreeData]);

  const convertTextToLabel = (text: string): JSX.Element => {
    const parts = text.split("\\n").map((part, index) => {
      return (
        <React.Fragment key={index}>
          {part}
          {index < text.split("\\n").length - 1 && <br />}{" "}
        </React.Fragment>
      );
    });

    return <>{parts}</>;
  };

  const handleNodeDragStop = (event: any, node: any) => {
    if (node.type !== "placeholder" && node.type !== "delete") {
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === node.id ? { ...n, position: node.position } : n
        )
      );
    }
  };

  const handleNodeDrag = (event: any, node: any) => {
    if (node.type !== "placeholder" && node.type !== "delete") {
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === node.id ? { ...n, position: node.position } : n
        )
      );
    }
  };

  const handleNodeClick = (event: React.MouseEvent, node: any) => {
    console.log("Kliknięto węzeł o ID:", node.id);
    if (node.type === "custom") {
      console.log("ClickedRelation-node: ", node);
      onNodeClick(node);
    } else if (node.type === "customSpouse") {
      onNodeClick(null);
      const [id1, id2] = node.id.split("*");

      const clickedRelation = relation.find(
        (rel) =>
          (rel.personId_1 === id1 && rel.personId_2 === id2) ||
          (rel.personId_1 === id2 && rel.personId_2 === id1)
      );
      console.log("ClickedRelation: ", clickedRelation);
      onEdgeClick([clickedRelation, null]);
    } else if (node.type === "delete") {
      console.log("DeletePeople: ", node.id.split("_")[0]);
      deletePerson(node.id.split("_")[0]);
    } else {
      setAddRelationToExistsPerson(false);
      selectedPersonInTree(node.id.split("_")[0]);
      onNodeClick(null);
    }
  };

  const deletePerson = async (nodeId: any) => {
    const edgesToDelete = edges.filter(
      (edge) =>
        (edge.source === nodeId && !edge.target.includes("*")) ||
        (edge.target === nodeId && !edge.source.includes("*"))
    );

    if (edgesToDelete.length === 1 || edges.length === 0) {
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

      try {
        // Jeżeli są relacje do usunięcia, usuwamy je najpierw
        if (edgesToDelete.length > 0) {
          await Promise.all(
            edgesToDelete.map((edge) =>
              axios.delete(
                `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${nodeId}/relations/${edge.id}`,
                config
              )
            )
          );
        }

        const response = await axios.get(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${nodeId}`,
          config
        );

        if (response.data.files && response.data.files.length > 0) {
          await Promise.all(
            response.data.files.map((file: any) => {
              return axios.delete(
                `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${file.personId}/files/${file.id}`,
                config
              );
            })
          );
        }
        await axios.delete(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${nodeId}`,
          config
        );

        const updatedEdges = edges.filter(
          (edge) => !edgesToDelete.includes(edge)
        );
        setEdges(updatedEdges);

        const updatedNodes = nodes.filter(
          (node) =>
            node.id !== nodeId &&
            node.id !== `${nodeId}_placeholder` &&
            node.id !== `${nodeId}_delete`
        );
        console.log(updatedNodes);
        setNodes(updatedNodes);
      } catch (error) {
        setError("Błąd podczas usuwania osoby lub plików");
        console.error("Error during deletion:", error);
      }
    } else {
      alert(
        `Nie można usunąć osoby, gdy zawiera więcej niż jedną relację lub zawiera relacje małżeńskie`
      );
    }
  };

  const handleEdgeClick = (event: React.MouseEvent, edge: any) => {
    console.log("Kliknięto relację o ID:", edge);
    if (edge.target.includes("*")) {
      const [id1, id2] = edge.target.split("*");

      const clickedRelation = relation.find(
        (rel) =>
          (rel.personId_1 === id1 && rel.personId_2 === id2) ||
          (rel.personId_1 === id2 && rel.personId_2 === id1)
      );
      console.log(clickedRelation);
      onEdgeClick([clickedRelation, null]);
    } else if (edge.source.includes("*")) {
      const [id1, id2] = edge.source.split("*");
      console.log("Cliknieto relacje: ", edge);
      console.log("dostepne relacja:", relation);
      console.log(id1, id2);
      const clickedRelation1 = relation.find(
        (rel) =>
          (rel.personId_1 === id1 && rel.personId_2 === edge.target) ||
          (rel.personId_1 === edge.target && rel.personId_2 === id1)
      );
      const clickedRelation2 = relation.find(
        (rel) =>
          (rel.personId_1 === id2 && rel.personId_2 === edge.target) ||
          (rel.personId_1 === edge.target && rel.personId_2 === id2)
      );
      console.log(clickedRelation1, clickedRelation2);
      onEdgeClick([clickedRelation1, clickedRelation2]);
    } else {
      const clickedRelation = relation.find(
        (rel) =>
          (rel.personId_1 === edge.source && rel.personId_2 === edge.target) ||
          (rel.personId_1 === edge.target && rel.personId_2 === edge.source)
      );
      onEdgeClick([clickedRelation, null]);
    }
  };

  const addPerson = (newPerson: any) => {
    setPerson((prevPerson) => {
      const updatedPerson = [...prevPerson, newPerson];
      return updatedPerson;
    });
  };

  const addRelation = (newRelation: any) => {
    setRelation((prevRelation) => {
      const updatedRelation = [...prevRelation, newRelation];
      return updatedRelation;
    });
  };

  const addNode = (newNode: any) => {
    console.log("NOdes:", nodes);
    if (newNode.id.includes("*")) {
      setNodes((prevNodes) => {
        const updatedNodes = [...prevNodes, newNode];
        return updatedNodes;
      });
    } else {
      setNodes((prevNodes) => {
        const updatedNodes = [
          ...prevNodes,
          newNode,
          addPlaceholderNode(newNode),
          addDeleteNode(newNode),
        ];
        return updatedNodes;
      });
    }
  };

  const addPlaceholderNode = (parentNode: any) => {
    console.log("AddedPaceholder for: ", parentNode);

    return {
      id: `${parentNode.id}_placeholder`,
      type: "placeholder",
      parentId: parentNode.id,
      data: { label: "+" },
      position: "fixed",
      style: {
        top: "152px",
        left: "0px",
      },
    };
  };

  const addDeleteNode = (parentNode: any) => {
    console.log("AddedPaceholder for: ", parentNode);

    return {
      id: `${parentNode.id}_delete`,
      type: "delete",
      parentId: parentNode.id,
      data: { label: "-" },
      position: "fixed",
      style: {
        top: "152px",
        left: "107px",
      },
    };
  };

  const addEdges = (newEdges: any) => {
    relationId++;
    setEdges((prevEdges) => {
      const updatedEdges = [...prevEdges, newEdges];
      return updatedEdges;
    });
  };

  const onConnect = (params: any) => {
    console.log("dostepne relacje: ", relation);
    console.log("Dodaje krawedza: ", params.target, " : ", params.source);
    const relationExists = relation.some(
      (relation) =>
        (relation.personId_1 === params.target &&
          relation.personId_2 === params.source) ||
        (relation.personId_2 === params.target &&
          relation.personId_1 === params.source)
    );
    if (relationExists) {
      console.log("Relacja istnieje");
    } else {
      if (!params.target.includes("*") && !params.source.includes("*")) {
        setAddRelationToExistsPerson(true);
        handleRelationAdded([params.target, params.source]);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        const tree = await axios.get<Person[]>(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons`,
          config
        );

        if (handleTreeData) {
          console.log("Są dane");
          setTreeExists(true);
        } else {
          console.log("Nie ma danych");
          setTreeExists(false);
        }

        const personResponse = await axios.get<Person[]>(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons`,
          config
        );

        setPerson(personResponse.data);

        const relationResponse = await axios.get<Relation[]>(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/relationsControllerForOneTree`,
          config
        );
        console.log("Pobrano relacje");

        console.log("downoladrelation: ", downloadRelation);
        setRelation(relationResponse.data);
      } catch (error) {
        setError("Error fetching data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [familyTreeId]);

  useEffect(() => {
    if (treeExists) {
      onStartView(false);
    } else {
      onStartView(true);
    }
  }, [treeExists]);

  useEffect(() => {
    if (handleEditedPerson) {
      console.log("Before update: ", nodes);
      console.log("EditedPerson: ", handleEditedPerson);

      const nodeToEdit = nodes.find((per) => per.id === handleEditedPerson.id);

      if (nodeToEdit) {
        const updatedNode = {
          ...nodeToEdit,
          data: {
            ...nodeToEdit.data,
            ...(handleEditedPerson.ifPersonUpdated && {
              name: handleEditedPerson.name,
              surname: handleEditedPerson.lastName,
            }),
            ...(handleEditedPerson.ifPhotoUpdated && {
              photo: handleEditedPerson.photo,
              photoId: handleEditedPerson.photoId,
            }),
          },
        };
        console.log("UpdateNode: ", updatedNode);

        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === updatedNode.id ? updatedNode : node
          )
        );
      }
    }
  }, [handleEditedPerson]);

  useEffect(() => {
    console.log("In useEffect");
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
    if (handlePersonAdded && handlePersonAdded.id) {
      console.log("W if");
      const fetchPerson = async () => {
        try {
          const response = await axios.get<Person>(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${handlePersonAdded.id}`,
            config
          );
          const personData = response.data;
          addPerson(personData);
        } catch (err) {
          setError("Failed to fetch person data");
        } finally {
        }
      };

      console.log("Ilosc osob: ");

      console.log("Dodano osobę: ", handlePersonAdded);
      addNode({
        id: handlePersonAdded.id,
        type: "custom",
        data: {
          name: `${handlePersonAdded.name}`,
          surname: `${handlePersonAdded.lastName}`,
          photo: `${handlePersonAdded.photo}`,
          photoId: `${handlePersonAdded.photoId}`,
        },
        position: { x: 0, y: 0 },
      });

      fetchPerson();
    }
  }, [handlePersonAdded]);

  useEffect(() => {
    console.log("Nodes: ", nodes);
  }, [nodes]);

  useEffect(() => {
    console.log("Edges:: ", edges);
  }, [edges]);

  useEffect(() => {
    console.log("Relation:: ", relation);
  }, [relation]);

  useEffect(() => {
    console.log("Dodawanie osoby z relacja: ");
    console.log(
      "Dodawanie osoby z relacja",
      handleAddedPersonWithRelation[0],
      handleAddedPersonWithRelation[1]
    );

    if (handleAddedPersonWithRelation[1]) {
      console.log("W if");
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
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${handleAddedPersonWithRelation[1].personId_1}/relations/${handleAddedPersonWithRelation[1].id}`,
            config
          );
          const relationData = response.data;
          addRelation(relationData);
        } catch (err) {
          setError("Failed to fetch relation data");
        } finally {
        }
      };
      fetchRelation();
    }

    if (handleAddedPersonWithRelation[1]) {
      const relatedNode = nodes.find(
        (per) =>
          per.id === handleAddedPersonWithRelation[1].personId_1 ||
          per.id === handleAddedPersonWithRelation[1].personId_1
      );
      if (!addRelationToExistPerson) {
        addRelationWithPersonFunction(relatedNode);
      }
    }
  }, [handleAddedPersonWithRelation]);

  function addRelationWithPersonFunction(relatedNode: any) {
    if (handleAddedPersonWithRelation[1].relationType === RelationType.Child) {
      addNode({
        id: handleAddedPersonWithRelation[0].id,
        type: "custom",
        data: {
          name: `${handleAddedPersonWithRelation[0].name}`,
          surname: `${handleAddedPersonWithRelation[0].lastName}`,
          photo: `${handleAddedPersonWithRelation[0].photo}`,
          photoId: `${handleAddedPersonWithRelation[0].photoId}`,
        },
        position: {
          x: relatedNode.position.x,
          y: relatedNode.position.y + 50,
        },
      });
      addEdges({
        id: handleAddedPersonWithRelation[1].id,
        source: relatedNode.id,
        target: handleAddedPersonWithRelation[0].id,
        animated: false,
      });
      console.log("Edges: ", edges);
    } else if (
      handleAddedPersonWithRelation[1].relationType === RelationType.Parent
    ) {
      addNode({
        id: handleAddedPersonWithRelation[0].id,
        type: "custom",
        data: {
          name: `${handleAddedPersonWithRelation[0].name}`,
          surname: `${handleAddedPersonWithRelation[0].lastName}`,
          photo: `${handleAddedPersonWithRelation[0].photo}`,
          photoId: `${handleAddedPersonWithRelation[0].photoId}`,
        },
        position: {
          x: relatedNode.position.x,
          y: relatedNode.position.y - 50,
        },
      });
      addEdges({
        id: handleAddedPersonWithRelation[1].id,
        target: relatedNode.id,
        source: handleAddedPersonWithRelation[0].id,
        animated: false,
      });
      console.log("Edges: ", edges);
    } else if (
      handleAddedPersonWithRelation[1].relationType === RelationType.Spouse
    ) {
      addNode({
        id: handleAddedPersonWithRelation[0].id,
        type: "custom",
        data: {
          name: `${handleAddedPersonWithRelation[0].name}`,
          surname: `${handleAddedPersonWithRelation[0].lastName}`,
          photo: `${handleAddedPersonWithRelation[0].photo}`,
          photoId: `${handleAddedPersonWithRelation[0].photoId}`,
        },
        position: {
          x: relatedNode.position.x + 180,
          y: relatedNode.position.y,
        },
      });

      addNode({
        id: `${handleAddedPersonWithRelation[1].personId_1}*${handleAddedPersonWithRelation[1].personId_2}`,
        type: "customSpouse",
        data: {
          name: `Małżenstwo`,
          date: `${handleAddedPersonWithRelation[1].startDate}`,
        },
        position: {
          x: relatedNode.position.x + 90,
          y: relatedNode.position.y + 50,
        },
      });

      addEdges({
        id: generateEdgeId(),
        source: relatedNode.id,
        target: `${handleAddedPersonWithRelation[1].personId_1}*${handleAddedPersonWithRelation[1].personId_2}`,
        animated: false,
      });

      addEdges({
        id: generateEdgeId(),
        source: handleAddedPersonWithRelation[0].id,
        target: `${handleAddedPersonWithRelation[1].personId_1}*${handleAddedPersonWithRelation[1].personId_2}`,
        animated: false,
      });
    }
  }

  function addRelationToExistPersonFunction() {
    console.log("Probuje dodac relacje:  ", handleAddedRelation);

    if (handleAddedRelation.relationType === "Child") {
      const sourceNodeMarriage = edges.find(
        (edge) =>
          edge.source === handleAddedRelation.personId_1 &&
          edge.target.includes("*")
      );
      if (sourceNodeMarriage) {
        const targetParts = sourceNodeMarriage.target.split("*");
        let secondParent: string | undefined;
        if (targetParts[0] === handleAddedRelation.personId_1) {
          secondParent = targetParts[1];
        } else {
          secondParent = targetParts[0];
        }
        console.log("Mariage: ", sourceNodeMarriage);
        console.log("Second PArent: ", secondParent);
        if (secondParent) {
          const edgeWithSecondParentExists = edges.find(
            (edge) =>
              edge.source === secondParent &&
              edge.target === handleAddedRelation.personId_2
          );

          if (edgeWithSecondParentExists) {
            console.log("Dodaje edge ");
            const updatedEdges = edges.filter(
              (edge) => edge.id !== edgeWithSecondParentExists.id
            );
            setEdges(updatedEdges);

            addEdges({
              id: handleAddedRelation.id,
              source: sourceNodeMarriage.target,
              target: handleAddedRelation.personId_2,
              animated: false,
            });
          } else {
            addEdges({
              id: handleAddedRelation.id,
              source: handleAddedRelation.personId_1,
              target: handleAddedRelation.personId_2,
              animated: false,
            });
          }
        } else {
          alert(`Nie można dodać takiej relacji`);
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
            .delete(
              `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${handleAddedPersonWithRelation[1].personId_1}/relations/${handleAddedPersonWithRelation[1].id}`,
              config
            )
            .then(() => {
              const updatedRelation = relation.filter(
                (rel) => rel.id !== handleAddedPersonWithRelation[1].id
              );
              setRelation(updatedRelation);
            })
            .catch(() => {
              setError("Error deleting peron");
            });
        }
      } else {
        alert(`Nie można dodać takiej relacji`);

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
          .delete(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${handleAddedPersonWithRelation[1].personId_1}/relations/${handleAddedPersonWithRelation[1].id}`,
            config
          )
          .then(() => {
            const updatedRelation = relation.filter(
              (rel) => rel.id !== handleAddedPersonWithRelation[1].id
            );
            setRelation(updatedRelation);
          })
          .catch(() => {
            setError("Error deleting peron");
          });
      }
    } else if (handleAddedRelation.relationType === "Parent") {
      const sourceNodeMarriage = edges.find(
        (edge) =>
          edge.source === handleAddedRelation.personId_2 &&
          edge.target.includes("*")
      );
      if (sourceNodeMarriage) {
        const targetParts = sourceNodeMarriage.target.split("*");
        let secondParent: string | undefined;
        if (targetParts[0] === handleAddedRelation.personId_2) {
          secondParent = targetParts[1];
        } else {
          secondParent = targetParts[0];
        }
        console.log("MAriage: ", sourceNodeMarriage);
        console.log("Second PArent: ", secondParent);
        if (secondParent) {
          const edgeWithSecondParentExists = edges.find(
            (edge) =>
              edge.source === secondParent &&
              edge.target === handleAddedRelation.personId_1
          );

          if (edgeWithSecondParentExists) {
            console.log("Dodaje edge ");
            const updatedEdges = edges.filter(
              (edge) => edge.id !== edgeWithSecondParentExists.id
            );
            setEdges(updatedEdges);

            addEdges({
              id: handleAddedRelation.id,
              source: sourceNodeMarriage.target,
              target: handleAddedRelation.personId_1,
              animated: false,
            });
          } else {
            const mariageExists = edges.find(
              (edge) =>
                edge.source === sourceNodeMarriage.target &&
                edge.target === handleAddedRelation.personId_1
            );

            if (mariageExists) {
              const updatedEdges = edges.filter(
                (edge) => edge.id !== mariageExists.id
              );
              setEdges(updatedEdges);
            }

            addEdges({
              id: handleAddedRelation.id,
              source: handleAddedRelation.personId_2,
              target: handleAddedRelation.personId_1,
              animated: false,
            });
          }
        } else {
          alert(`Nie można dodać osoby z taką relacją`);

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
            .delete(
              `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${handleAddedPersonWithRelation[1].personId_1}/relations/${handleAddedPersonWithRelation[1].id}`,
              config
            )
            .then(() => {
              const updatedRelation = relation.filter(
                (rel) => rel.id !== handleAddedPersonWithRelation[1].id
              );
              setRelation(updatedRelation);
            })
            .catch(() => {
              setError("Error deleting peron");
            });
        }
      } else {
        alert(`Nie można dodać osoby z taką relacją`);
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
          .delete(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${handleAddedPersonWithRelation[1].personId_1}/relations/${handleAddedPersonWithRelation[1].id}`,
            config
          )
          .then(() => {
            const updatedRelation = relation.filter(
              (rel) => rel.id !== handleAddedPersonWithRelation[1].id
            );
            setRelation(updatedRelation);
          })
          .catch(() => {
            setError("Error deleting relation");
          });
      }
    } else {
      console.log("Dodaje relacje spouse");

      const sourceParentPerson1 = edges.filter(
        (edge) => edge.target === handleAddedRelation.personId_1
      );
      const sourceParentPerson2 = edges.filter(
        (edge) => edge.target === handleAddedRelation.personId_2
      );

      const hasCommonSource = sourceParentPerson1.some((item1) =>
        sourceParentPerson2.some((item2) => item1.source === item2.source)
      );
      console.log(hasCommonSource);
      if (hasCommonSource) {
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
          .delete(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${handleAddedRelation.personId_1}/relations/${handleAddedRelation.id}`,
            config
          )
          .then(() => {
            const updatedRelation = relation.filter(
              (rel) => rel.id !== handleAddedPersonWithRelation[1].id
            );
            setRelation(updatedRelation);
          })
          .catch(() => {
            setError("Error deleting peron");
          });
        alert(
          "Nie można dodać małżeństwa, gdy osoby mają takich samych rodziców"
        );
      } else {
        const nodePerson1 = nodes.find(
          (node) => node.id === handleAddedRelation.personId_1
        );
        const nodePerson2 = nodes.find(
          (node) => node.id === handleAddedRelation.personId_2
        );
        if (nodePerson1 && nodePerson2) {
          addNode({
            id: `${handleAddedRelation.personId_1}*${handleAddedRelation.personId_2}`,
            type: "customSpouse",
            data: {
              name: `Małżenstwo`,
              date: `${handleAddedRelation.startDate}`,
            },
            position: {
              x: (nodePerson1.position.x + nodePerson2.position.x) / 2,
              y: nodePerson2.position.y + 50,
            },
          });

          addEdges({
            id: generateEdgeId(),
            source: handleAddedRelation.personId_1,
            target: `${handleAddedRelation.personId_1}*${handleAddedRelation.personId_2}`,
            animated: false,
          });

          addEdges({
            id: generateEdgeId(),
            source: handleAddedRelation.personId_2,
            target: `${handleAddedRelation.personId_1}*${handleAddedRelation.personId_2}`,
            animated: false,
          });

          const childPerson1 = edges.filter(
            (edge) => edge.source === handleAddedRelation.personId_1
          );

          console.log("ChildPErson1: ", childPerson1);
          const childPerson2 = edges.filter(
            (edge) => edge.source === handleAddedRelation.personId_2
          );
          console.log("ChildPErson2: ", childPerson2);

          const commonChild1 = childPerson1.filter((item1) =>
            childPerson2.some((item2) => item1.target === item2.target)
          );
          const commonChild2 = childPerson2.filter((item1) =>
            childPerson1.some((item2) => item1.target === item2.target)
          );
          const commonChild = [...commonChild1, ...commonChild2];
          console.log("CommonChild: ", commonChild);
          setEdges((prevEdges) =>
            prevEdges.map((edge) =>
              commonChild.some((child) => child.id === edge.id)
                ? {
                    ...edge,
                    source: `${handleAddedRelation.personId_1}*${handleAddedRelation.personId_2}`,
                  }
                : edge
            )
          );
        }
      }
    }
  }

  useEffect(() => {
    console.log("AddedRElation:: ", handleAddedRelation);

    if (handleAddedRelation) {
      console.log("W if");
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
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${handleAddedRelation.personId_1}/relations/${handleAddedRelation.id}`,
            config
          );
          const relationData = response.data;
          addRelation(relationData);
        } catch (err) {
          setError("Failed to fetch relation data");
        } finally {
        }
      };
      fetchRelation();
    }
    addRelationToExistPersonFunction();
  }, [handleAddedRelation]);

  return (
    <div>
      <div style={{ height: "100vh" }} ref={pdfRef}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onNodeDragStop={handleNodeDragStop}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeDrag={handleNodeDrag}
          nodesDraggable={nodes.some(
            (node) => node.type !== "placeholder" && node.type !== "delete"
          )}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <Button onClick={() => saveTreeToFile()} className="buttonMenuOver">
        Save
      </Button>
      {/* <Button onClick={downloadPDF} className="buttonMenuOver2">
        Download PDF
      </Button> */}
    </div>
  );
}
