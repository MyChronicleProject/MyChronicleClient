import { Person } from "./Person";

export enum FileType {
  Image = "Image",
  Audio = "Audio",
  Document = "Document",
  ProfileImage = "ProfileImage",
}

export enum FileExtension {
  jpg = "jpg",
  png = "png",
  mp3 = "mp3",
  pdf = "pdf",
  docx = "docx",
}
export interface File {
  id: string;
  fileType: FileType;
  personId: string;
  name: string;
  content: string;
  fileExtension: FileExtension;
  person: Person[];
}

export interface FileDTO {
  fileType: FileType;
  personId: string;
  name: string;
  content: string;
  fileExtension: FileExtension;
}

export const getFileExtensionNumber = (fileExtension: string) => {
  switch (fileExtension) {
    case FileExtension.jpg:
      return 0;
    case FileExtension.png:
      return 1;
    case FileExtension.mp3:
      return 2;
    case FileExtension.pdf:
      return 3;
    case FileExtension.docx:
      return 4;
    default:
      return 5;
  }
};

export const getFileExtensionName = (fileExtension: number) => {
  switch (fileExtension) {
    case 0:
      return FileExtension.jpg;
    case 1:
      return FileExtension.png;
    case 2:
      return FileExtension.mp3;
    case 3:
      return FileExtension.pdf;
    case 4:
      return FileExtension.docx;
    default:
      return FileExtension.jpg;
  }
};

export const getFileTypeNumber = (fileType: string) => {
  switch (fileType) {
    case FileType.Image:
      return 0;
    case FileType.Audio:
      return 1;
    case FileType.Document:
      return 2;
    case FileType.ProfileImage:
      return 3;
    default:
      return 4;
  }
};

export const getFileTypeName = (fileType: number) => {
  switch (fileType) {
    case 0:
      return FileType.Image;
    case 1:
      return FileType.Audio;
    case 2:
      return FileType.Document;
    case 3:
      return FileType.ProfileImage;
    default:
      return "Unknown";
  }
};
