import { Person } from './Person';
export enum RelationType {
    Child = 'Child',
    Parent = 'Parent',
    Spouse = 'Spouse',
}


export const getRelationTypeNumber = (relationType: string) => {
    switch (relationType) {
        case RelationType.Child:
            return 0;
        case RelationType.Parent:
            return 1;
        case RelationType.Spouse:
            return 2;
        default:
            return 3;
    }
};

export const getRelationTypeName = (relation: number) => {
    switch (relation) {
        case 0:
            return RelationType.Child;
        case 1:
            return RelationType.Parent;
        case 2:
            return RelationType.Spouse;
        default:
            return 'Unknown';
    }
};


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
