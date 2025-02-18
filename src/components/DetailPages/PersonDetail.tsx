import { useParams } from "react-router-dom";
import "../../Styles/buttonMenu.css";
import React, { useState, useEffect } from "react";
import { Gender } from "../../models/Person";
import axios from "axios";
import { Person, getGenderName } from "../../models/Person";
import { File, FileType, getFileTypeName } from "../../models/File";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FileSlider from "../Slider/FileSlider";
import AudioSlider from "../Slider/AudioSlider";
import ImageSlider from "../Slider/ImageSlider";

export default function PersonDetail({
  selectedNodeId,
}: {
  selectedNodeId: any;
}) {
  const [error, setError] = useState<string | null>(null);
  const { familyTreeId } = useParams<{ familyTreeId: string }>();
  const [ProfileImage, setProfileImage] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [audios, setAudios] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    deathDate: "",
    birthPlace: "",
    deathPlace: "",
    gender: "male",
    occupation: "",
    note: "",
  });
  const [fileToOpen, setFileToOpen] = useState<File | null>(null);

  useEffect(() => {
    if (selectedNodeId) {
      const fetchPerson = async () => {
        try {
          setImages([]);
          const token = localStorage.getItem("token");

          if (!token) {
            console.error("Brak tokena. Użytkownik nie jest zalogowany.");
            return;
          }

          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get<Person>(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${selectedNodeId}`,
            config
          );
          const personData = response.data;

          console.log("Request Payload:", personData);

          setFormData({
            name: personData.name,
            middleName: personData.middleName || "",
            lastName: personData.lastName || "",
            birthDate: personData.birthDate.slice(0.1),
            deathDate: personData.deathDate
              ? personData.deathDate.slice(0, 10)
              : "",
            birthPlace: personData.birthPlace || "",
            deathPlace: personData.deathPlace || "",
            gender: getGenderName(parseInt(personData.gender)),
            occupation: personData.occupation || "",
            note: personData.note || "",
          });
          console.log("PerosnData:", personData);
          setFiles(personData.files);
        } catch (err) {
          setError("Failed to fetch person data");
        } finally {
        }
      };

      fetchPerson();
    } else {
    }
  }, [selectedNodeId]);

  useEffect(() => {
    const imageFiles = files.filter(
      (file) => getFileTypeName(parseInt(file.fileType)) === FileType.Image
    );
    const profileImageFiles = files.filter(
      (file) =>
        getFileTypeName(parseInt(file.fileType)) === FileType.ProfileImage
    );
    const documentsFiles = files.filter(
      (file) => getFileTypeName(parseInt(file.fileType)) === FileType.Document
    );
    const audiosFiles = files.filter(
      (file) => getFileTypeName(parseInt(file.fileType)) === FileType.Audio
    );
    setImages(imageFiles);
    console.log("Zdjęcia: ", images);
    setProfileImage(profileImageFiles);
    console.log("Zdjęcia: ", images);
    setDocuments(documentsFiles);
    console.log("Dokumenty: ", documents);
    setAudios(audiosFiles);
    console.log("Audio: ", audiosFiles);
  }, [files]);

  const handleExitFile = async () => {
    setFileToOpen(null);
  };

  return (
    <div>
      <form>
        <h1 className="FileForm-header"> SZCZEGÓŁY </h1>
        <div>
          {images ? (
            <div>
              {ProfileImage.length > 0 ? (
                <ImageSlider images={ProfileImage} />
              ) : (
                <p></p>
              )}
            </div>
          ) : (
            <p>Image not found or loading...</p>
          )}
        </div>
        <div className="inputForm">
          <label>Imię:</label>
          <input type="text" name="name" value={formData.name} readOnly />
        </div>
        <div className="inputForm">
          <label>Drugie imie:</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            readOnly
          />
        </div>
        <div className="inputForm">
          <label>Nazwisko:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            readOnly
          />
        </div>
        <div className="inputForm">
          <label>Data urodzenia:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate.slice(0, 10)}
            readOnly
          />
        </div>
        <div className="inputForm">
          <label>Data śmierci:</label>
          <input
            type="date"
            name="deathDate"
            value={formData.deathDate.slice(0, 10)}
            readOnly
          />
        </div>
        <div className="inputForm">
          <label>Miejsce urodzenia:</label>
          <input
            type="text"
            name="birthPlace"
            value={formData.birthPlace}
            readOnly
          />
        </div>
        <div className="inputForm">
          <label>Miejsce śmierci:</label>
          <input
            type="text"
            name="deathPlace"
            value={formData.deathPlace}
            readOnly
          />
        </div>
        <div className="inputForm">
          <label>Płeć:</label>
          <select
            name="gender"
            value={formData.gender}
            disabled
            className="non-editable"
          >
            {Object.values(Gender).map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div className="inputForm">
          <label>Zawód:</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            readOnly
          />
        </div>
        <div className="inputForm">
          <label>Notatka:</label>
          <textarea
            name="note"
            value={formData.note}
            readOnly
            rows={6}
            cols={35}
            className="note-textarea"
          />
        </div>
      </form>
      <div>
        {images ? (
          <div>
            {images.length > 0 ? <ImageSlider images={images} /> : <p></p>}
          </div>
        ) : (
          <p>Image not found or loading...</p>
        )}
      </div>
      <div>
        <FileSlider files={documents} />
      </div>
      <div>
        <AudioSlider files={audios} />
      </div>
    </div>
  );
}
