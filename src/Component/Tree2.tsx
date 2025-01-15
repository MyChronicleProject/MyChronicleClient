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

const PlaceholderNode = ({ data }: any) => {
  return (
    <div
      style={{
        padding: "5px",
        border: "1px dashed #999",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        pointerEvents: "none",
      }}
    >
      {data.label}
    </div>
  );
};
const nodeTypes = {
  placeholder: PlaceholderNode,
  custom: CustomNode,
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
  const placeholderIdMap = useRef(new Map<string, string>());
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
    if (node.type !== "placeholder") {
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === node.id ? { ...n, position: node.position } : n
        )
      );
    }
  };

  const handleNodeDrag = (event: any, node: any) => {
    if (node.type !== "placeholder") {
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
      if (node.id.includes("*")) {
        onNodeClick(null);
        const [id1, id2] = node.id.split("*");

        const clickedRelation = relation.find(
          (rel) =>
            (rel.personId_1 === id1 && rel.personId_2 === id2) ||
            (rel.personId_1 === id2 && rel.personId_2 === id1)
        );
        console.log("ClickedRelation: ", clickedRelation);
        onEdgeClick([clickedRelation, null]);
      } else {
        console.log("ClickedRelation-node: ", node);
        onNodeClick(node);
      }
    } else {
      setAddRelationToExistsPerson(false);
      selectedPersonInTree(node.id.split("_")[0]);
      onNodeClick(null);
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
      position: { x: parentNode.position.x, y: parentNode.position.y },
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
        animated: true,
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
        animated: true,
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
          name: `Malzenstwo`,
          date: `${handleAddedPersonWithRelation[1].startDate}`,
        },
        position: {
          x: relatedNode.position.x + 90,
          y: relatedNode.position.y + 50,
        },
      });

      addEdges({
        id: relationId,
        source: relatedNode.id,
        target: `${handleAddedPersonWithRelation[1].personId_1}*${handleAddedPersonWithRelation[1].personId_2}`,
        animated: true,
      });

      addEdges({
        id: relationId,
        source: handleAddedPersonWithRelation[0].id,
        target: `${handleAddedPersonWithRelation[1].personId_1}*${handleAddedPersonWithRelation[1].personId_2}`,
        animated: true,
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
        console.log("MAriage: ", sourceNodeMarriage);
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
              animated: true,
            });
          } else {
            addEdges({
              id: handleAddedRelation.id,
              source: handleAddedRelation.personId_1,
              target: handleAddedRelation.personId_2,
              animated: true,
            });
          }
        }
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
              animated: true,
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
              animated: true,
            });
          }
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
          nodesDraggable={nodes.some((node) => node.type !== "placeholder")}
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
