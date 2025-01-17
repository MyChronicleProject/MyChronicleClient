import Tree from "./Tree";
import AppBar from "./AppBars/AppBar";
import BottomBar from "./AppBars/BottomBar";
import ReactFlow, { MiniMap, Controls, Background, addEdge } from "reactflow";
import { Button } from "semantic-ui-react";
import "reactflow/dist/style.css";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import PersonDetail from "./DetailPages/PersonDetail";
import RelationDetail from "./DetailPages/RelationDetail";
import axios from "axios";
import html2canvas from "html2canvas";
import "../Styles/hideElementOnTree.css";
import jsPDF from "jspdf";
import {
  Relation,
  getRelationTypeNumber,
  RelationType,
} from "../Models/Relation";
import { useParams } from "react-router-dom";
import { FamilyTree } from "../Models/FamilyTree";
import CustomNode from "./CustomNode";
import CustomNodeSpouse from "./CustomNodeSpouse";
import "../Styles/buttonMenu.css";


const nodeTypes = {
  custom: CustomNode,
  customSpouse: CustomNodeSpouse,
};

export default function TreeView() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const { state } = useLocation();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [relation, setRelation] = useState<Relation[]>([]);
  const handleTreeData = state?.treeData;
  const [visiblePerson, setVisiblePerson] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<any[]>([null]);
  const { familyTreeId } = useParams<{ familyTreeId: string }>();
  const [visibleRelation, setVisibleRelation] = useState<boolean>(false);
  const [visibleRelation2, setVisibleRelation2] = useState<boolean>(false);
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const [treeName, setTreeName] = useState<string | null>(null);

  useEffect(() => {
    const attribution = document.querySelector(".react-flow__attribution");
    if (attribution) {
      attribution.remove();
    }
  }, []);

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
            const relationResponse = await axios.get<Relation[]>(
              `https://localhost:7033/api/Familytrees/${familyTreeId}/relationsControllerForOneTree`,
              config
            );
            console.log("Pobrano relacje");
            console.log("RElacje", relationResponse.data);
            setRelation(relationResponse.data);

            const treeNameResponse = await axios.get<FamilyTree>(
              `https://localhost:7033/api/Familytrees/${familyTreeId}`,
              config
            );
            setTreeName(treeNameResponse.data.name);
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

    if (node.id.includes("*")) {
      const [id1, id2] = node.id.split("*");

      const clickedRelation = relation.find(
        (rel) =>
          (rel.personId_1 === id1 && rel.personId_2 === id2) ||
          (rel.personId_1 === id2 && rel.personId_2 === id1)
      );
      console.log("ClickedRelation: ", clickedRelation);
      setSelectedEdge([clickedRelation, null]);
      setVisibleRelation(true);
      setVisibleRelation2(false);
      setVisiblePerson(false);
    } else {
      console.log("ClickedRelation-node: ", node);
      setSelectedNode(node);
      setVisiblePerson(true);
      setVisibleRelation2(false);
      setVisibleRelation(false);
    }
  };

  const handleEdgeClick = (event: React.MouseEvent, edge: any) => {
    console.log("Kliknięto relację o ID:", edge);
    console.log("RElacje: ", relation);
    if (edge.target.includes("*")) {
      const [id1, id2] = edge.target.split("*");

      const clickedRelation = relation.find(
        (rel) =>
          (rel.personId_1 === id1 && rel.personId_2 === id2) ||
          (rel.personId_1 === id2 && rel.personId_2 === id1)
      );
      console.log(clickedRelation);
      setSelectedEdge([clickedRelation, null]);
      setVisiblePerson(false);
      setVisibleRelation2(false);
      setVisibleRelation(true);
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
      setSelectedEdge([clickedRelation1, clickedRelation2]);
      setVisiblePerson(false);
      setVisibleRelation2(true);
      setVisibleRelation(true);
    } else {
      const clickedRelation = relation.find(
        (rel) =>
          (rel.personId_1 === edge.source && rel.personId_2 === edge.target) ||
          (rel.personId_1 === edge.target && rel.personId_2 === edge.source)
      );
      console.log(clickedRelation);
      setSelectedEdge([clickedRelation, null]);
      setVisiblePerson(false);
      setVisibleRelation2(false);
      setVisibleRelation(true);
    }
  };

  const downloadPDF = () => {
    const input = pdfRef.current;
    if (!input) {
      console.error("pdfRef is not assigned to any element.");
      return;
    }

    const minimap = input.querySelector(".react-flow__minimap");
    const controls = input.querySelector(".react-flow__controls");
    const background = input.querySelector(".react-flow__background");

    // Dodaj klasę `hidden`, aby je ukryć
    minimap?.classList.add("hidden");
    controls?.classList.add("hidden");
    background?.classList.add("hidden");

    html2canvas(input).then((canvas: any) => {
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
      pdf.save(`${treeName}.pdf`);
    });
    minimap?.classList.remove("hidden");
    controls?.classList.remove("hidden");
    background?.classList.remove("hidden");
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
      <AppBar />
      <div>
        <div className="App4">
          <div className="left-panel" style={{ height: "100vh" }} ref={pdfRef}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              nodeTypes={nodeTypes}
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

          {visibleRelation && (
            <div className="relation-panel">
              {visibleRelation && (
                <RelationDetail
                  selectedEdgeId={selectedEdge[0] ? selectedEdge[0] : null}
                />
              )}
              {visibleRelation2 && (
                <RelationDetail
                  selectedEdgeId={selectedEdge[1] ? selectedEdge[1] : null}
                />
              )}
            </div>
          )}
        </div>

        <BottomBar />
      </div>
      <Button onClick={downloadPDF} className="buttonMenuOver2">
        Download PDF
      </Button>
    </div>
  );
}
