import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Person } from "../Models/Person";
import { Relation, getRelationTypeNumber } from "../Models/Relation";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { v4 as uuidv4 } from "uuid";

const PlaceholderNode = ({ data }: any) => {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px dashed #999",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
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
}: {
  onNodeClick: (node: any) => void;
  onStartView: (startView: boolean) => void;
  onEdgeClick: (edge: any[]) => void;
}) {
  const [person, setPerson] = useState<Person[]>([]);
  const [personWithParent, setPersonWithParent] = useState<PersonWithParent[]>(
    []
  );
  const [canCreateNode, setCanCreateNode] = useState<boolean>(false);
  const [relation, setRelation] = useState<Relation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { familyTreeId } = useParams<{ familyTreeId: string }>();
  const [treeData, setTreeData] = useState<any>(null);
  const [isParentIdsFilled, setIsParentIdsFilled] = useState(false);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [downloadRelation, setDownloadRelation] = useState(false);
  const [isXPositionCalculate, setISXPositionCalculate] =
    useState<boolean>(false);
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const placeholderIdMap = useRef(new Map<string, string>());

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

  const handleNodeDragStop = (event: any, node: any) => {
    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === node.id ? { ...n, position: node.position } : n
      )
    );
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
        console.log(clickedRelation);
        onEdgeClick([clickedRelation, null]);
      } else {
        onNodeClick(node);
      }
    } else {
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

  const addNode = (newNode: any, onePerson: any) => {
    const placeholderNode = {
      id: uuidv4(),
      data: { label: "+" },
      position: { x: newNode.position.x + 150, y: newNode.position.y },
      type: "placeholder",
    };

    if (!newNode.id.includes("*")) {
      // Aktualizacja mapy przez ref
      placeholderIdMap.current.set(newNode.id, placeholderNode.id);
      console.log("Added to placeholderIdMap:", {
        nodeId: newNode.id,
        placeholderId: placeholderNode.id,
        map: Array.from(placeholderIdMap.current.entries()),
      });
    }

    setNodes((prevNodes) => {
      let updatedNodes;
      if (newNode.id.includes("*")) {
        updatedNodes = [...prevNodes, newNode];
      } else {
        updatedNodes = [...prevNodes, newNode, placeholderNode];
      }
      console.log("New node: ", newNode, placeholderNode);
      return updatedNodes;
    });

    createChildNodes(onePerson, newNode);
  };

  const addEdges = (newEdges: any) => {
    setEdges((prevEdges) => {
      const updatedEdges = [...prevEdges, newEdges];
      return updatedEdges;
    });
  };

  const getNodeFromPlaceholderId = (placeholderId: string) => {
    const entries = Array.from(placeholderIdMap.current.entries()); // Używamy .current
    //console.log("placeholderIdMap.entries():", entries); // Sprawdzamy wpisy w mapie
    for (const [nodeId, placeholderNodeId] of entries) {
      // console.log(
      //   `Checking placeholderNodeId: ${placeholderNodeId} against placeholderId: ${placeholderId}`
      // );
      if (placeholderNodeId === placeholderId) {
        const node = nodes.find((node) => node.id === nodeId);
        console.log("Found node:", node); // Logujemy znaleziony node
        return node || null;
      }
    }
    //console.log("No node found for placeholderId:", placeholderId); // Logujemy brak wyniku
    return null;
  };

  const getPlaceholderNode = (nodeId: string) => {
    const placeholderId = placeholderIdMap.current.get(nodeId);
    // console.log("getPlaceholderNode - placeholderId:", placeholderId); // Logujemy placeholderId
    if (!placeholderId) {
      // console.log("No placeholder found for nodeId:", nodeId); // Logujemy brak placeholdera
      return null;
    }
    const placeholderNode = nodes.find((node) => node.id === placeholderId);
    //console.log("Found placeholderNode:", placeholderNode); // Logujemy znaleziony placeholder
    return placeholderNode || null;
  };

  interface PersonWithParent {
    id: string;
    name: string;
    parentId1?: string | null;
    parentId2?: string | null;
    relation?: string | null;
  }

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
        setDownloadRelation(true);
      }
    };

    fetchData();
  }, [familyTreeId]);

  useEffect(() => {
    if (person.length > 0) {
      console.log("createpersonwithparentid:", familyTreeId);
      createPersonWithParentId();
      onStartView(false);
      console.log("Person: ", person);
    } else {
      onStartView(true);
    }
  }, [person]);

  useEffect(() => {
    console.log("Nie ma relacji");
    console.log("Relation.length: ", relation.length);
    console.log("isParentFilled: ", !isParentIdsFilled);
    console.log("downloadRElation: ", downloadRelation);
    if (
      personWithParent.length > 0 &&
      relation.length > 0 &&
      !isParentIdsFilled &&
      downloadRelation
    ) {
      console.log("Fillparentid:", familyTreeId);
      fillParentId();
      setIsParentIdsFilled(true);
      console.log("Relation: ", relation);
      console.log("PersonWithParent: ", personWithParent);
    } else if (
      personWithParent.length > 0 &&
      relation.length === 0 &&
      !isParentIdsFilled &&
      downloadRelation
    ) {
      console.log("Jestem :)");
      console.log("Fillparentid:", familyTreeId);
      fillParentId();
      setIsParentIdsFilled(true);
      console.log("Relation: ", relation);
      console.log("PersonWithParent: ", personWithParent);
    }
  }, [loading]);

  useEffect(() => {
    console.log("jestem");
    if (personWithParent.length > 0 && canCreateNode) {
      CreateNodes();
      createEdges();
      console.log("Person222: ", personWithParent);
    }
  }, [personWithParent]);

  useEffect(() => {
    if (nodes.length > 0 && !isXPositionCalculate) {
      console.log("Nodes: ", nodes);
      xCalculation();
    }
  }, [nodes]);

  useEffect(() => {
    if (edges.length > 0) {
      console.log("Edges: ", edges);
    }
  }, [edges]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div style={{ height: "100vh" }} ref={pdfRef}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onNodeDragStop={handleNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );

  function createPersonWithParentId() {
    const updatedPersons = person.map((person) => ({
      id: person.id,
      name: `${person.name} ${person.lastName}`,
      parentId1: null,
      parentId2: null,
      relation: null,
    }));
    setPersonWithParent(updatedPersons);
  }

  function fillParentId() {
    const updatedPersons = personWithParent.map((person) => ({ ...person }));
    for (const oneRelation of relation) {
      if (
        parseInt(oneRelation.relationType) === getRelationTypeNumber("Parent")
      ) {
        const person = updatedPersons.find(
          (person) => person.id === oneRelation.personId_1
        );
        if (person) {
          person.relation = oneRelation.id;
          if (!person.parentId1) {
            person.parentId1 = oneRelation.personId_2;
          } else if (oneRelation.personId_2 !== person.parentId1) {
            person.parentId2 = oneRelation.personId_2;
          }
        }
      } else if (
        parseInt(oneRelation.relationType) === getRelationTypeNumber("Child")
      ) {
        const person = updatedPersons.find(
          (person) => person.id === oneRelation.personId_2
        );
        if (person) {
          person.relation = oneRelation.id;
          if (!person.parentId1) {
            person.parentId1 = oneRelation.personId_1;
          } else if (oneRelation.personId_1 !== person.parentId1) {
            person.parentId2 = oneRelation.personId_1;
          }
        }
      } else {
        const newPersonId = `${oneRelation.personId_1}*${oneRelation.personId_2}`;
        const newPersonWithParents: PersonWithParent = {
          id: newPersonId,
          name: `Rodzice ${oneRelation.startDate}`,
          parentId1: oneRelation.personId_1,
          parentId2: oneRelation.personId_2,
          relation: oneRelation.id,
        };

        updatedPersons.push(newPersonWithParents);
      }
    }
    for (const onePerson of updatedPersons) {
      if (
        onePerson.parentId1 !== null &&
        onePerson.parentId2 !== null &&
        !onePerson.id.includes("*")
      ) {
        const person = updatedPersons.find(
          (person) =>
            person.id === `${onePerson.parentId1}*${onePerson.parentId2}` ||
            person.id === `${onePerson.parentId2}*${onePerson.parentId1}`
        );

        if (person) {
          onePerson.parentId1 = person.id;
          onePerson.parentId2 = null;
        }
      }
    }
    setPersonWithParent(updatedPersons);
    setCanCreateNode(true);
  }

  function CreateNodes() {
    let yAxisForRoots = 0;
    for (const onePerson of personWithParent) {
      if (onePerson.parentId1 === null) {
        addNode(
          {
            id: onePerson.id,
            type: "default",
            data: { label: `${onePerson.name}` },
            position: { x: yAxisForRoots, y: 0 },
          },
          onePerson
        );
        yAxisForRoots += 250;
      }
    }
  }

  function createChildNodes(personName: any, newNode: any) {
    for (const onePerson of personWithParent) {
      let yPosition = newNode.position.y;
      if (onePerson.parentId1 === personName.id) {
        yPosition += 100;
        addNode(
          {
            id: onePerson.id,
            type: "default",
            data: { label: `${onePerson.name}` },
            position: { x: 0, y: yPosition },
          },
          onePerson
        );
      }
    }
  }

  function createEdges() {
    let ids = 0;
    for (const onePerson of personWithParent) {
      if (onePerson.parentId1 !== null) {
        addEdges({
          id: ids,
          source: onePerson.parentId1,
          target: onePerson.id,
          animated: true,
        });
        ids += 1;
      }
      if (onePerson.parentId2 !== null) {
        addEdges({
          id: ids,
          source: onePerson.parentId2,
          target: onePerson.id,
          animated: true,
        });
        ids += 1;
      }
    }
  }

  function xCalculation() {
    console.log("Map: ", placeholderIdMap);
    let yPosition = 100;
    let personWithTheSameParent: any[] = [];

    while (nodes.some((person) => person.position?.y === yPosition)) {
      const personsAtY = nodes.filter(
        (person) => person.position?.y === yPosition
      );

      const personsAtYWithParent = personsAtY.map((person) => {
        const parentEdges = edges.filter((edge) => edge.target === person.id);
        const parents = parentEdges.map((edge) => edge.source);
        const parent = parents.join("*");
        return {
          ...person,
          parent,
        };
      });

      const groupedByParents: { [key: string]: any[] } =
        personsAtYWithParent.reduce((acc, person) => {
          const parentKey = person.parent || "noParent";
          if (!acc[parentKey]) acc[parentKey] = [];
          acc[parentKey].push(person);
          return acc;
        }, {} as { [key: string]: any[] });

      for (const oneFamily of Object.values(groupedByParents)) {
        const qtyInFamily = oneFamily.length;

        let xPositionOfParent = 0;

        const person = oneFamily[0];

        if (person.id === person.parent) {
          const [parent1Id, parent2Id] = person.parent.split("*");
          const parent1 = nodes.find((p) => p.id === parent1Id);
          const parent2 = nodes.find((p) => p.id === parent2Id);

          if (parent1 && parent2) {
            xPositionOfParent = (parent1.position.x + parent2.position.x) / 2;
          } else {
            console.log("Nie znaleziono jednego lub obu rodziców.");
          }
        } else {
          const parent1 = nodes.find((p) => p.id === person.parent);
          xPositionOfParent = parent1?.position.x || 0;
        }
        console.log("Aktualizuje: ", oneFamily[0]);
        if (qtyInFamily === 1) {
          oneFamily[0].position.x = xPositionOfParent;
          const placeholder = getPlaceholderNode(oneFamily[0].id);
          console.log("Person: ", oneFamily[0]);
          if (placeholder) {
            console.log("Placeholder: ", placeholder);
            placeholder.position.x = xPositionOfParent;
          }
        } else if (qtyInFamily === 2) {
          if (oneFamily[0].label !== "+") {
            oneFamily[0].position.x = xPositionOfParent - 125;
            console.log("Person: ", oneFamily[0]);
            const placeholder = getPlaceholderNode(oneFamily[0].id);
            if (placeholder) {
              console.log("Placeholder: ", placeholder);
              placeholder.position.x = 1451; //xPositionOfParent - 125;
              console.log("Placeholder po zmianie: ", placeholder);
            }
          }
          if (oneFamily[1].label !== "+") {
            oneFamily[1].position.x = xPositionOfParent + 125;
            const placeholder2 = getPlaceholderNode(oneFamily[1].id);
            console.log("Person: ", oneFamily[1]);
            if (placeholder2) {
              console.log("Placeholde2r: ", placeholder2);
              placeholder2.position.x = 124; //xPositionOfParent + 125;
              console.log("Placeholde2r po zminaie: ", placeholder2);
            }
          }
        }
      }

      personWithTheSameParent.push(Object.values(groupedByParents));

      yPosition += 100;
    }

    const updatedNodes = nodes.map((node) => {
      const updatedNode = personWithTheSameParent
        .flat()
        .find((updatedPerson) => updatedPerson.id === node.id);

      // Jeśli znaleziono zaktualizowanego węzeł, aktualizuj również placeholder
      if (updatedNode) {
        const placeholder = getPlaceholderNode(updatedNode.id);
        if (placeholder) {
          placeholder.position = updatedNode.position;
        }
        return { ...node, position: updatedNode.position };
      }
      return node;
    });

    setISXPositionCalculate(true);
    setNodes(updatedNodes);
  }
}
