import React from "react";

interface AudioPlayerProps {
  base64Audio: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ base64Audio }) => {
  const audioSrc = `data:audio/mp3;base64,${base64Audio}`;
  console.log("Zmiana w player");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <audio controls>
        <source src={audioSrc} type="audio/mp3" />
        Twój przeglądarka nie obsługuje elementu audio.
      </audio>
    </div>
  );
};

export default AudioPlayer;
