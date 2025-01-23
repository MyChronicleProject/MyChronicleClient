import { FamilyTreePermision } from "./FamilyTreePermision";
import { Person } from "./Person";
export interface FamilyTree {
  id: string;
  name: string;
  layout: string;
  familyTreePermision: FamilyTreePermision[];
  person: Person[];
}
