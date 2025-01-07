import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import AudioPlayer from "../OpenFiles/AudioPlayer";
import { File } from "../../Models/File";

const AudioSlider: React.FC<{ files: File[] }> = ({ files }) => {
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);

  const handleAudioClick = (audioContent: string) => {
    setSelectedAudio(audioContent);
    console.log("Zmiana pliku");
  };

  useEffect(() => {
    setSelectedAudio(null);
  }, [files]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div style={{ width: "200px", margin: "20px auto", height: "auto" }}>
      {files.length > 0 && (
        <h2 style={{ textAlign: "center" }}>Pliki dzwiękowe</h2>
      )}
      <div style={{ marginBottom: "20px" }}>
        <Slider {...settings}>
          {files.map((file, index) => (
            <div
              key={index}
              onClick={() => handleAudioClick(file.content)}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 0",
                width: "100%",
                cursor: "pointer",
              }}
            >
              <div style={{ textAlign: "center", width: "100%" }}>
                <h3 style={{ margin: "0", fontSize: "12px" }}>{file.name}</h3>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {selectedAudio ? (
        <div style={{ marginTop: "20px", alignItems: "center" }}>
          <AudioPlayer key={selectedAudio} base64Audio={selectedAudio} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default AudioSlider;
