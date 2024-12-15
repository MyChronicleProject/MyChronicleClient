import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Person } from "../Models/Person";
import { Relation, getRelationTypeNumber } from "../Models/Relation";
import { useParams } from "react-router-dom";

export default function Tree() {
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
  const [isXPositionCalculate, setISXPositionCalculate] =
    useState<boolean>(false);

  const handleNodeClick = (event: React.MouseEvent, node: any) => {
    console.log("Kliknięto węzeł o ID:", node.id);
  };

  const handleEdgeClick = (event: React.MouseEvent, edge: any) => {
    console.log("Kliknięto relację o ID:", edge.id);
  };

  const addNode = (newNode: any, onePerson: any) => {
    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes, newNode];
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

  interface PersonWithParent {
    id: string;
    name: string;
    parentId1?: string | null;
    parentId2?: string | null;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const personResponse = await axios.get<Person[]>(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons`
        );
        setPerson(personResponse.data);

        const relationResponse = await axios.get<Relation[]>(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/relationsControllerForOneTree`
        );
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
    if (person.length > 0) {
      console.log("createpersonwithparentid:", familyTreeId);
      createPersonWithParentId();
    }
  }, [person]);

  useEffect(() => {
    if (
      personWithParent.length > 0 &&
      relation.length > 0 &&
      !isParentIdsFilled
    ) {
      console.log("Fillparentid:", familyTreeId);
      fillParentId();
      setIsParentIdsFilled(true);
    }
  }, [personWithParent, relation]);

  useEffect(() => {
    if (personWithParent.length > 0 && canCreateNode) {
      CreateNodes();
      createEdges();
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
    <div style={{ height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );

  function createPersonWithParentId() {
    const updatedPersons = person.map((person) => ({
      id: person.id,
      name: `${person.name} ${person.lastName}`,
      parentId1: null,
      parentId2: null,
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

        if (qtyInFamily === 1) {
          oneFamily[0].position.x = xPositionOfParent;
        } else if (qtyInFamily === 2) {
          oneFamily[0].position.x = xPositionOfParent - 125;
          oneFamily[1].position.x = xPositionOfParent + 125;
        }
      }

      personWithTheSameParent.push(Object.values(groupedByParents));

      yPosition += 100;
    }

    const updatedNodes = nodes.map((node) => {
      const updatedNode = personWithTheSameParent
        .flat()
        .find((updatedPerson) => updatedPerson.id === node.id);
      return updatedNode ? { ...node, position: updatedNode.position } : node;
    });

    setISXPositionCalculate(true);
    setNodes(updatedNodes);
  }
}
