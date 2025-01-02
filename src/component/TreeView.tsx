import Tree from "./Tree";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import ReactFlow, { MiniMap, Controls, Background, addEdge } from "reactflow";
import "reactflow/dist/style.css";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import PersonDetail from "./PersonDetail";
import axios from "axios";
import {
  Relation,
  getRelationTypeNumber,
  RelationType,
} from "../Models/Relation";
import { useParams } from "react-router-dom";

export default function TreeView() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const { state } = useLocation();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [relation, setRelation] = useState<Relation[]>([]);
  const handleTreeData = state?.treeData;
  const [visiblePerson, setVisiblePerson] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { familyTreeId } = useParams<{ familyTreeId: string }>();

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

        setNodes(updatedNodes.filter((nod: any) => nod.type !== "placeholder"));
        setEdges(handleTreeData.edges);

        console.log("Wczytano węzły:", updatedNodes);
        console.log("Wczytano krawędzie:", handleTreeData.edges);

        const fetchData = async () => {
          try {
            const relationResponse = await axios.get<Relation[]>(
              `https://localhost:7033/api/Familytrees/${familyTreeId}/relationsControllerForOneTree`
            );
            console.log("Pobrano relacje");

            setRelation(relationResponse.data);
          } catch (error) {
            setError("Error fetching data");
            console.error(error);
          } finally {
          }
        };
        fetchData();
      } else {
        alert("Plik nie zawiera wymaganych danych: nodes i edges.");
      }
    }
  }, [handleTreeData]);

  const handleNodeClick = (event: React.MouseEvent, node: any) => {
    console.log("Kliknięto węzeł o ID:", node.id);
    if (node.type === "default") {
      if (node.id.includes("*")) {
        //setNodes(null);
        const [id1, id2] = node.id.split("*");

        const clickedRelation = relation.find(
          (rel) =>
            (rel.personId_1 === id1 && rel.personId_2 === id2) ||
            (rel.personId_1 === id2 && rel.personId_2 === id1)
        );
        console.log("ClickedRelation: ", clickedRelation);
        //onEdgeClick([clickedRelation, null]);
      } else {
        console.log("ClickedRelation-node: ", node);
        setSelectedNode(node);
        setVisiblePerson(true);
      }
    }
  };

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

  return (
    <div>
      {/* <div style={{ height: "100vh" }} ref={pdfRef}> */}
      <div style={{ height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          //onEdgeClick={handleEdgeClick}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {visiblePerson && (
        <div className="person-panel">
          <PersonDetail
            selectedNodeId={selectedNode ? selectedNode.id : null}
          />
        </div>
      )}

      {/* <button onClick={() => saveTreeToFile()}>Save</button>
  <button onClick={downloadPDF}>Download PDF</button> */}
    </div>
  );
}
