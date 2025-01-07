import React from "react";
import { File, getFileTypeName } from "../Models/File";
import {
  FileDTO,
  FileExtension,
  FileType,
  getFileExtensionNumber,
  getFileExtensionName,
  getFileTypeNumber,
} from "../Models/File";
import PdfViewer from "./pdfViewer";
import DocxViewer from "./DocxViewer";
import AudioPlayer from "./AudioPlayer";

interface AudioPlayerProps {
  file: File;
}

const OpenFile: React.FC<AudioPlayerProps> = ({ file }) => {
  if (!file) {
    return <div>No file available</div>;
  }

  const fileExtensionName = getFileExtensionName(parseInt(file.fileExtension));
  const fileTypeName = getFileTypeName(parseInt(file.fileType));

  const renderViewer = () => {
    switch (fileTypeName) {
      case FileType.Audio:
        return <AudioPlayer base64Audio={file.fileExtension} />;
      case FileType.Image:
        return <div>nie obsłużone</div>;
      case FileType.Document:
        switch (fileExtensionName) {
          case FileExtension.pdf:
            return <PdfViewer base64={file.fileExtension} />;
          default:
            return <DocxViewer fileContent={file.fileExtension} />;
        }
      default:
        return <div>No file available</div>;
    }
  };

  return <div>{renderViewer()}</div>;
};

export default OpenFile;
