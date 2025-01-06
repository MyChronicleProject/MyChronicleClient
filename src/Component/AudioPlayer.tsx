import React from "react";

interface AudioPlayerProps {
  base64Audio: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ base64Audio }) => {
  const audioSrc = `data:audio/mp3;base64,${base64Audio}`;
  console.log("Zmiana w player");

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <center></center>
      <audio controls>
        <source src={audioSrc} type="audio/mp3" />
        Twój przeglądarka nie obsługuje elementu audio.
      </audio>
      <center />
    </div>
  );
};

export default AudioPlayer;
