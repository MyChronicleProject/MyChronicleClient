import { File } from './File';
import { Relation } from './Relation';

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    NonBinary = 'NonBinary',
    Unspecified = 'Unspecified',
}

export interface Person {
    id: string;
    name: string;
    middleName?: string;
    lastName?: string;
    birthDate: string;
    deathDate?: string;
    birthPlace?: string;
    deathPlace?: string;
    gender: Gender;
    occupation?: string;
    note?: string;
    familyTreeId: string;
    relationAsPerson1: Relation[];
    relationAsPerson2: Relation[];
    files: File[];
}