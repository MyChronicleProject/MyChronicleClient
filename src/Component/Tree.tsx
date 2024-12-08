import React, { useEffect, useState } from "react";
import axios from "axios";
import { Person } from "../Models/Person";
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Relation, getRelationTypeNumber } from "../Models/Relation";
import { isTypeOnlyImportOrExportDeclaration } from "typescript";

export default function Tree() {
  const [person, setPerson] = useState<Person[]>([]);

  interface PersonWithParent extends Person {
    parentId1?: string | null;
    parentId2?: string | null;
  }

  const [personWithParent, setPersonWithParent] = useState<PersonWithParent[]>(
    []
  );
  const [relation, setRelation] = useState<Relation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { familyTreeId } = useParams<{ familyTreeId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const personResponse = await axios.get<Person[]>(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons`
        );
        console.log(personResponse.data);
        setPerson(personResponse.data);

        createPersonWithParentId();

        const relationResponse = await axios.get<Relation[]>(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/relationsControllerForOneTree`
        );
        console.log(relationResponse.data);
        setRelation(relationResponse.data);
        fillParentId();
      } catch (error) {
        setError("Error fetching data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [familyTreeId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Drzewo</h1>
      <ul>
        {personWithParent.map((person) => (
          <li key={person.id}>
            <h2>
              <center>
                {person.id} {person.name} {person.lastName} Parent:{" "}
                {person.parentId1} {person.parentId2}
              </center>
            </h2>
            <div>
              <center>
                <NavLink
                  to={`/treeviewedition/${familyTreeId}/${person.id}`}
                  className="button nav-link"
                >
                  Edit
                </NavLink>
                <NavLink
                  to={`/addrelation/${familyTreeId}/${person.id}`}
                  className="button nav-link"
                >
                  Dodaj relacje
                </NavLink>
              </center>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  function createPersonWithParentId() {
    console.log("W createPersonWithPArentID");
    const updatedPersons = person.map((person) => ({
      ...person,
      parentId1: null,
      parentId2: null,
    }));
    setPersonWithParent(updatedPersons);
  }

  function fillParentId() {
    console.log("W fillParentID");
    for (const oneRelation of relation) {
      console.log("Przetwarzam relację:", oneRelation);

      if (
        parseInt(oneRelation.relationType) === getRelationTypeNumber("Parent")
      ) {
        const person = personWithParent.find(
          (person) => person.id === oneRelation.personId_1
        );

        console.log("Znaleziony person dla parenta:", person);

        if (person) {
          if (!person.parentId1) {
            console.log("Ustawiam parentId1:", oneRelation.personId_2);
            person.parentId1 = oneRelation.personId_2;
          } else if (oneRelation.personId_2 != person.parentId1) {
            console.log("Ustawiam parentId2:", oneRelation.personId_2);
            person.parentId2 = oneRelation.personId_2;
          }
        }
      } else if (
        parseInt(oneRelation.relationType) === getRelationTypeNumber("Child")
      ) {
        const person = personWithParent.find(
          (person) => person.id === oneRelation.personId_2
        );

        console.log("Znaleziony person dla dziecka:", person);

        if (person) {
          if (!person.parentId1) {
            console.log("Ustawiam parentId1:", oneRelation.personId_1);
            person.parentId1 = oneRelation.personId_1;
          } else if (oneRelation.personId_1 != person.parentId1) {
            console.log("Ustawiam parentId2:", oneRelation.personId_1);
            person.parentId2 = oneRelation.personId_1;
          }
        }
      }
    }
  }
}
