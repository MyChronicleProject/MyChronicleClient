import { Person } from './Person';
export enum RelationType {
    Child = 'Child',
    Parent = 'Parent',
    Spouse = 'Spouse',
}

export interface Relation {
    id: string;
    personId_1: string;
    personId_2: string;
    relationType: RelationType;
    startDate: string;
    endDate: string;
    person_1: Person;
    person_2: Person;
}