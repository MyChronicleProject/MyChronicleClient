import React from "react";
import { File, getFileTypeName } from "../../models/File";

import {
  FileDTO,
  FileExtension,
  FileType,
  getFileExtensionNumber,
  getFileExtensionName,
  getFileTypeNumber,
} from "../../models/File";

import DocxViewer from "./DocxViewer";
import AudioPlayer from "./AudioPlayer";
import PdfViewer from "./pdfViewer";

interface AudioPlayerProps {
  file: File;
}

const OpenFile: React.FC<AudioPlayerProps> = ({ file }) => {
  if (!file) {
    return <div>No file available</div>;
  }

  const fileExtensionName = file.fileExtension as FileExtension;
  const fileTypeName = file.fileType as FileType;

  const renderViewer = () => {
    switch (fileTypeName) {
      case FileType.Audio:
        console.log("REnderuje audio");
        return <AudioPlayer base64Audio={file.content} />;
      case FileType.Image:
        return (
          <img
            decoding="async"
            src={`data:image/jpeg;base64,${file.content}`}
            alt={file.name}
            style={{
              minWidth: "100vh",
              minHeight: "100vh",
              maxWidth: "100%",
              maxHeight: "150px",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        );
      case FileType.Document:
        switch (fileExtensionName) {
          case FileExtension.pdf:
            return <PdfViewer base64={file.content} />;
          default:
            return <DocxViewer fileContent={file.content} />;
        }
      default:
        return <div>No file available</div>;
    }
  };
  return <div style={{ width: "100%", height: "100%" }}>{renderViewer()}</div>;
};

export default OpenFile;
