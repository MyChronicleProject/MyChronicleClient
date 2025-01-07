import logo from "../logo.png";
import { Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../../Styles/buttonMenu.css";
import React, { useState, useEffect } from "react";
import AppBar from "../AppBars/AppBar";
import BottomBar from "../AppBars/BottomBar";
import { Gender } from "../../Models/Person";
import axios from "axios";
import { Person, getGenderNumber, getGenderName } from "../../Models/Person";
import { File, FileType, getFileTypeName } from "../../Models/File";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FileSlider from "../Slider/FileSlider";
import AudioSlider from "../Slider/AudioSlider";
import ImageSlider from "../Slider/ImageSlider";
import "../../Styles/buttonMenu.css";
import "../../Styles/inputFieldsBasic.css";

export default function PersonDetail({
  selectedNodeId,
}: {
  selectedNodeId: any;
}) {
  const [error, setError] = useState<string | null>(null);
  const { familyTreeId } = useParams<{ familyTreeId: string }>();
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

  useEffect(() => {
    if (selectedNodeId) {
      const fetchPerson = async () => {
        try {
          setImages([]);
          const response = await axios.get<Person>(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${selectedNodeId}`
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
    const documentsFiles = files.filter(
      (file) => getFileTypeName(parseInt(file.fileType)) === FileType.Document
    );
    const audiosFiles = files.filter(
      (file) => getFileTypeName(parseInt(file.fileType)) === FileType.Audio
    );
    setImages(imageFiles);
    console.log("Zdjęcia: ", images);
    setDocuments(documentsFiles);
    console.log("Dokumenty: ", documents);
    setAudios(audiosFiles);
    console.log("Audio: ", audiosFiles);
  }, [files]);

  return (
    <div>
      <form>
        <h1> SZCZEGÓŁY </h1>
        <div>
          {images ? (
            <div>
              {images.length > 0 ? (
                <ImageSlider images={images} />
              ) : (
                <p>No images found</p>
              )}
            </div>
          ) : (
            <p>Image not found or loading...</p>
          )}
        </div>
        <div className="inputField">
          <label>Imię:</label>
          <input type="text" name="name" value={formData.name} readOnly />
        </div>
        <div className="inputField">
          <label>Drugie imie:</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            readOnly
          />
        </div>
        <div className="inputField">
          <label>Nazwisko:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            readOnly
          />
        </div>
        <div className="inputField">
          <label>Data urodzenia:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate.slice(0, 10)}
            readOnly
          />
        </div>
        <div className="inputField">
          <label>Data śmierci:</label>
          <input
            type="date"
            name="deathDate"
            value={formData.deathDate.slice(0, 10)}
            readOnly
          />
        </div>
        <div className="inputField">
          <label>Miejsce urodzenia:</label>
          <input
            type="text"
            name="birthPlace"
            value={formData.birthPlace}
            readOnly
          />
        </div>
        <div className="inputField">
          <label>Miejsce śmierci:</label>
          <input
            type="text"
            name="deathPlace"
            value={formData.deathPlace}
            readOnly
          />
        </div>
        <div className="inputField">
          <label>Płeć:</label>
          <select name="gender" value={formData.gender} disabled>
            {Object.values(Gender).map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div className="inputField">
          <label>Zawód:</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            readOnly
          />
        </div>
        <div className="inputField"> 
          <label>Notatka:</label>
          <input type="text" name="note" value={formData.note} readOnly />
        </div>
      </form>

      <div>
        <FileSlider files={documents} />
      </div>
      <div>
        <AudioSlider files={audios} />
      </div>
    </div>
  );
}
