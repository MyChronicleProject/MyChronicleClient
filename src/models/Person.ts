import { File } from './File';
import { Relation } from './Relation';

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    NonBinary = 'NonBinary',
    Unspecified = 'Unspecified',
}

export const getGenderNumber = (gender: string) => {
    switch (gender) {
        case Gender.Male:
            return 0;
        case Gender.Female:
            return 1;
        case Gender.NonBinary:
            return 2;
        case Gender.Unspecified:
            return 3;
        default:
            return 4;
    }
};

export const getGenderName = (gender: number) => {
    switch (gender) {
        case 0:
            return Gender.Male;
        case 1:
            return Gender.Female;
        case 2:
            return Gender.NonBinary;
        case 3:
            return Gender.Unspecified;
        default:
            return 'Unknown';
    }
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