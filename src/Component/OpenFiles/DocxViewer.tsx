import React, { useState, useEffect } from "react";
import mammoth from "mammoth";

const DocxViewer = ({ fileContent }: { fileContent: string }) => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  const convertDocxToHtml = async (base64Content: string) => {
    try {
      const base64String = base64Content.startsWith("data:")
        ? base64Content.split(",")[1]
        : base64Content;

      const binaryData = atob(base64String);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryData.length; i++) {
        view[i] = binaryData.charCodeAt(i);
      }
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(html);
    } catch (error) {
      console.error("Error converting DOCX to HTML:", error);
      setHtmlContent("Error converting DOCX to HTML");
    }
  };

  useEffect(() => {
    if (fileContent) {
      convertDocxToHtml(fileContent);
    }
  }, [fileContent]);

  return (
    <div style={{ width: "100%", margin: "20px auto", padding: "10px" }}>
      <h2 style={{ textAlign: "center" }}>Dokument</h2>

      {htmlContent ? (
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "20px",
            maxHeight: "600px",
            overflowY: "auto",
          }}
        />
      ) : (
        <p>Ładowanie dokumentu...</p>
      )}
    </div>
  );
};

export default DocxViewer;
