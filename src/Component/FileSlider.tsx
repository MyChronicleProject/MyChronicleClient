import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import { File, FileExtension } from "../Models/File";
import PdfViewer from "./pdfViewer";
import DocxViewer from "./DocxViewer";
import { getFileExtensionName } from "../Models/File";

const FileSlider: React.FC<{ files: File[] }> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedFileExtension, setSelectedFileExtension] = useState<
    string | null
  >(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 9000,
  };

  const handleFileClick = (fileContent: string, fileExtension: string) => {
    setSelectedFile(fileContent);
    setSelectedFileExtension(fileExtension);
    console.log(fileExtension);
  };

  return (
    <div style={{ width: "200px", margin: "20px auto", height: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Dokumenty</h2>
      <div style={{ marginBottom: "20px" }}>
        <Slider {...settings}>
          {files.map((file, index) => (
            <div
              key={index}
              onClick={() => handleFileClick(file.content, file.fileExtension)}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 0",
                width: "100%",
              }}
            >
              <div style={{ textAlign: "center", width: "100%" }}>
                <h3 style={{ margin: "0", fontSize: "12px" }}>{file.name}</h3>{" "}
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {selectedFile && selectedFileExtension ? (
        <div style={{ marginTop: "20px" }}>
          {getFileExtensionName(parseInt(selectedFileExtension)) ===
          FileExtension.pdf ? (
            <PdfViewer base64={selectedFile} />
          ) : (
            <DocxViewer fileContent={selectedFile} />
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default FileSlider;
