import { FamilyTree } from './FamilyTree';
import { User } from './User';

export enum Role {
    Autor = 'Autor',
    Guess = 'Guess',
}

export interface FamilyTreePermision {
    id: string;
    familyTreeId: string;
    userId: string;
    role: Role;
    familyTree: FamilyTree;
    users: User[];
}