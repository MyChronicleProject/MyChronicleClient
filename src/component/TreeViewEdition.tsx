import AddPersonForm from "./Forms/AddPersonForm";
import Tree from "./Tree";
import AppBar from "./AppBars/AppBar";
import BottomBar from "./AppBars/BottomBar";
import React, { useEffect, useState } from "react";
import AddRelationForm from "./Forms/AddRelationForm";
import Tree2 from "./Tree2";
import { Person } from "../Models/Person";
import { Relation } from "../Models/Relation";
import "../Styles/addPersonFormStyle.css";
import "../Styles/addRelationFormStyle.css";

import { Button } from "semantic-ui-react";

export default function TreeViewEdition() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedEdge, setSelectedEdge] = useState<any[]>([null]);
  const [addedPerson, setAddedPerson] = useState<any>([null]);
  const [selectedPersonInTree, setSelectedPersonInTree] = useState<
    string[] | null
  >(null);
  const [addedRelation, setAddedRelation] = useState<any>(null);
  const [editedPerson, setEditedPerson] = useState<any>(null);
  const [addedPersonTemp, setAddedPersonTemp] = useState<any>(null);
  const [startView, setStartView] = useState<boolean>(false);
  const [visibleRelation, setVisibleRelation] = useState<boolean>(false);
  const [visiblePerson, setVisiblePerson] = useState<boolean>(false);
  const [visibleRelation2, setVisibleRelation2] = useState<boolean>(false);
  const [addedPersonWithRelation, setAddedPersonWithRelation] = useState<any[]>(
    [null]
  );

  useEffect(() => {
    const attribution = document.querySelector(".react-flow__attribution");
    if (attribution) {
      attribution.remove();
    }
  }, []);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    setVisibleRelation(false);
    setVisibleRelation2(false);
    setVisiblePerson(true);
  };

  const handleAddRelation = (ids: any) => {
    setSelectedEdge([]);
    setSelectedPersonInTree(ids);
    setVisibleRelation(true);
  };

  const handleStartView = (start: boolean) => {
    setSelectedNode(null);
    setStartView(start);
    setVisiblePerson(start);
    setVisibleRelation(false);
    setVisibleRelation2(false);
  };

  const handleEdgeClick = (edge: any) => {
    if (edge[0]) {
      setSelectedEdge(edge);
      setVisibleRelation(true);

      if (edge[1]) {
        setVisibleRelation2(true);
      } else {
        setVisibleRelation2(false);
      }
    } else {
      setVisibleRelation(false);
      setVisibleRelation2(false);
    }
    setVisiblePerson(false);
  };

  const handelPersonAdded = (person: any) => {
    setVisiblePerson(false);
    if (startView) {
      setAddedPerson(person);
    } else {
      setAddedPersonTemp(person);
      setSelectedEdge([]);
      setSelectedPersonInTree((prevSelected) =>
        prevSelected ? [...prevSelected, person.id] : [person.id]
      );
      setVisibleRelation(true);
    }
  };

  const handleRelationAdded = (relation: Relation) => {
    setVisibleRelation(false);
    if (addedPersonTemp) {
      setAddedPersonWithRelation([addedPersonTemp, relation]);
      setAddedPersonTemp(null);
    } else {
      setAddedRelation(relation);
    }
  };

  const handlePersonEdited = (person: any) => {
    setEditedPerson(person);
  };

  const handleSelectedPersonInTree = (personId: string) => {
    setSelectedPersonInTree([personId]);
  };

  const handleExitPerson = () => {
    setVisiblePerson(false);
  };
  const handleExitRelation = () => {
    setVisibleRelation2(false);
  };

  return (
    <div>
      <AppBar />
      <div className="App4">
        <div className="left-panel">
          <Tree2
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onStartView={handleStartView}
            selectedPersonInTree={handleSelectedPersonInTree}
            handlePersonAdded={addedPerson}
            handleAddedPersonWithRelation={addedPersonWithRelation}
            handleRelationAdded={handleAddRelation}
            handleAddedRelation={addedRelation}
            handleEditedPerson={editedPerson}
          />
        </div>
        {visiblePerson && (
          <div className="person-panel">
            <Button onClick={handleExitPerson} className="exitButton">
              x
            </Button>
            <AddPersonForm
              selectedNode={selectedNode ? selectedNode.id : null}
              personAdded={handelPersonAdded}
              personEdited={handlePersonEdited}
            />
          </div>
        )}
        {visibleRelation && (
          <div className="relation-panel">
            <Button onClick={handleExitRelation} className="exitButton">
              x
            </Button>
            {visibleRelation && (
              <AddRelationForm
                selectedPersonInTree={selectedPersonInTree}
                selectedEdge={selectedEdge[0] ? selectedEdge[0] : null}
                relationAdded={handleRelationAdded}
              />
            )}
            {visibleRelation2 && (
              <AddRelationForm
                selectedPersonInTree={selectedPersonInTree}
                selectedEdge={selectedEdge[1] ? selectedEdge[1] : null}
                relationAdded={handleRelationAdded}
              />
            )}
          </div>
        )}
      </div>

      <BottomBar />
    </div>
  );
}
