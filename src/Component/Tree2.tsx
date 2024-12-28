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

const PlaceholderNode = ({ data }: any) => {
  return (
    <div
      style={{
        padding: "10px",
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
};

export default function Tree({
  onNodeClick,
  onEdgeClick,
  onStartView,
  selectedPersonInTree,
  handlePersonAdded,
  handleAddedPersonWithRelation,
  handleRelationAdded,
}: {
  onNodeClick: (node: any) => void;
  onEdgeClick: (edge: any[]) => void;
  selectedPersonInTree: (personId: any) => void;
  onStartView: (startView: boolean) => void;
  handlePersonAdded: any;
  handleAddedPersonWithRelation: any;
  handleRelationAdded: (ids: any[]) => void;
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
    const treeData = { familyTreeId, nodes, edges };

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
        setNodes(handleTreeData.nodes);
        setEdges(handleTreeData.edges);

        console.log("Wczytano węzły:", handleTreeData.nodes);
        console.log("Wczytano krawędzie:", handleTreeData.edges);
      } else {
        alert("Plik nie zawiera wymaganych danych: nodes i edges.");
      }
    }
  }, [handleTreeData]);

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
    if (node.type === "default") {
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
      position: { x: parentNode.position.x, y: parentNode.position.y + 30 },
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
    setAddRelationToExistsPerson(true);
    handleRelationAdded([params.target, params.source]);
    //setEdges((eds) => addEdge(params, eds));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tree = await axios.get<Person[]>(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons`
        );

        if (handleTreeData) {
          console.log("Są dane");
          setTreeExists(true);
        } else {
          console.log("Nie ma danych");
          setTreeExists(false);
        }

        const personResponse = await axios.get<Person[]>(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons`
        );

        setPerson(personResponse.data);

        const relationResponse = await axios.get<Relation[]>(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/relationsControllerForOneTree`
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
    console.log("In useEffect");
    if (handlePersonAdded && handlePersonAdded.id) {
      console.log("W if");
      const fetchPerson = async () => {
        try {
          const response = await axios.get<Person>(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${handlePersonAdded.id}`
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
        type: "default",
        data: { label: `${handlePersonAdded.name}` },
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
          const response = await axios.get<Relation>(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${handleAddedPersonWithRelation[1].personId_1}/relations/${handleAddedPersonWithRelation[1].id}`
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
      } else {
        addRelationToExistPersonFunction(relatedNode);
      }
    }
  }, [handleAddedPersonWithRelation]);

  function addRelationWithPersonFunction(relatedNode: any) {
    if (handleAddedPersonWithRelation[1].relationType === RelationType.Child) {
      addNode({
        id: handleAddedPersonWithRelation[0].id,
        type: "default",
        data: {
          label: `${handleAddedPersonWithRelation[0].name} ${handleAddedPersonWithRelation[0].lastName}`,
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
        type: "default",
        data: {
          label: `${handleAddedPersonWithRelation[0].name} ${handleAddedPersonWithRelation[0].lastName}`,
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
        type: "default",
        data: {
          label: `${handleAddedPersonWithRelation[0].name} ${handleAddedPersonWithRelation[0].lastName}`,
        },
        position: {
          x: relatedNode.position.x + 180,
          y: relatedNode.position.y,
        },
      });

      addNode({
        id: `${handleAddedPersonWithRelation[1].personId_1}*${handleAddedPersonWithRelation[1].personId_2}`,
        type: "default",
        data: {
          label: (
            <>
              Małżeństwo <br />
              {handleAddedPersonWithRelation[1].startDate}
            </>
          ),
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

  function addRelationToExistPersonFunction(relatedNode: any) {}

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
      <button onClick={() => saveTreeToFile()}>Save</button>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
}
