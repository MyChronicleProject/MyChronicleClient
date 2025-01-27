import React, { useEffect, useState } from "react";
import axios from "axios";
import { Relation } from "../models/Relation";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function RelationList() {
  const [relation, setRelation] = useState<Relation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const { familyTreeId } = useParams<{ familyTreeId: string }>();
  const { personId } = useParams<{ personId: string }>();

  useEffect(() => {
    setLoading(true);
    console.log("TreeID: ", familyTreeId);
    axios
      .get<Relation[]>(
        `https://localhost:${process.env.CLIENT_PORT || 7033}/api/Familytrees/${familyTreeId}/persons/${personId}/relations`
      )
      .then((response) => {
        console.log(response.data);
        setRelation(response.data);
      })
      .catch(() => {
        setError("Error fetching cars");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Drzewo</h1>
      <ul>
        {Array.isArray(relation) && relation.length > 0 ? (
          relation.map((relation) => (
            <li key={relation.id}>
              <h2>
                <center>
                  {relation.personId_1} {relation.personId_2}{" "}
                  {relation.relationType}
                </center>
              </h2>
              <div>
                <center>
                  <NavLink
                    to={`/addrelation/${familyTreeId}/${personId}/${relation.id}`}
                    className="button nav-link"
                  >
                    Edit
                  </NavLink>
                </center>
              </div>
            </li>
          ))
        ) : (
          <p>Brak relacji do wyświetlenia.</p>
        )}
      </ul>
    </div>
  );
}
