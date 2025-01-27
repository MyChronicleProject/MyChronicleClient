import { FamilyTreePermision } from "./FamilyTreePermision";
import { Person } from "./Person";
import { Role } from "./FamilyTreePermision";
export interface FamilyTree {
  id: string;
  name: string;
  layout: string;
  familyTreePermision: FamilyTreePermision[];
  person: Person[];
  currentUserRole: Role;
}

export const getRoleNumber = (role: string) => {
  switch (role) {
    case Role.Autor:
      return 0;
    case Role.Guess:
      return 1;
    default:
      return 2;
  }
};

export const getRoleName = (role: number) => {
  switch (role) {
    case 0:
      return Role.Autor;
    case 1:
      return Role.Guess;
    default:
      return "Unknown";
  }
};
