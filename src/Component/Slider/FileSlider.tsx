import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";
import { File, FileExtension } from "../../Models/File";
import PdfViewer from "../OpenFiles/pdfViewer";
import DocxViewer from "../OpenFiles/DocxViewer";
import { getFileExtensionName } from "../../Models/File";
import { Button } from "semantic-ui-react";

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

  useEffect(() => {
    setSelectedFile(null);
  }, [files]);

  const handleFileClick = (fileContent: string, fileExtension: string) => {
    setSelectedFile(fileContent);
    setSelectedFileExtension(fileExtension);
    console.log(fileExtension);
  };

  const handleExitFile = async () => {
    setSelectedFile(null);
  };

  return (
    <div style={{ width: "200px", margin: "20px auto", height: "auto" }}>
      {files.length > 0 && <h2 className="FileForm-header">Dokumenty</h2>}

      {files.length === 0 ? (
        <div></div>
      ) : files.length === 1 ? (
        <div
          onClick={() =>
            handleFileClick(files[0].content, files[0].fileExtension)
          }
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px 0",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0", fontSize: "12px", color: "black" }}>
            {files[0].name}
          </h3>
        </div>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <Slider {...settings}>
            {files.map((file, index) => (
              <div
                key={index}
                onClick={() =>
                  handleFileClick(file.content, file.fileExtension)
                }
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px 0",
                  width: "100%",
                }}
              >
                <div style={{ textAlign: "center", width: "100%" }}>
                  <h3 style={{ margin: "0", fontSize: "12px", color: "black" }}>
                    {file.name}
                  </h3>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}

      {selectedFile && selectedFileExtension ? (
        <>
          <div className="overlayBackground" onClick={handleExitFile}></div>
          <div className="openFileStyle">
            <Button onClick={handleExitFile} className="exitButton">
              x
            </Button>
            {getFileExtensionName(parseInt(selectedFileExtension)) ===
            FileExtension.pdf ? (
              <PdfViewer base64={selectedFile} />
            ) : (
              <DocxViewer fileContent={selectedFile} />
            )}
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default FileSlider;
