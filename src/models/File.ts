import { Person } from './Person';

export enum FileType {
	Image = 'Image',
	Audio = 'Audio',
	Document = 'Document',
}

export enum FileExtension {
	jpg = 'jpg',
	png = 'png',
	mp3 = 'mp3',
	pdf = 'pdf',
	docx = 'docx',
}
export interface File {
	id: string;
	fileType: FileType;
	personId: string;
	content: Uint8Array[];
	fileExtension: FileExtension;
	person: Person[];
}