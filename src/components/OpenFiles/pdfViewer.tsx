import React from "react";

interface PdfViewerProps {
  base64: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ base64 }) => {
  const pdfUrl = `data:application/pdf;base64,${base64}`;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        title="PDF Viewer"
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default PdfViewer;
