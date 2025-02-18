import { Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Gender } from "../../models/Person";
import axios from "axios";
import { Person, getGenderNumber, getGenderName } from "../../models/Person";
import { useNavigate } from "react-router-dom";
import "../../Styles/addPersonFormStyle.css";
import "../../Styles/buttonMenu.css";
import "../../Styles/inputFieldsMenu.css";
import "../../Styles/openFileStyle.css";
import "../../Styles/filesFormStyle.css";
import { File, getFileTypeName } from "../../models/File";
import {
  FileDTO,
  FileExtension,
  getFileExtensionName,
  FileType,
  getFileExtensionNumber,
  getFileTypeNumber,
} from "../../models/File";
import OpenFile from "../OpenFiles/OpenFile";

export default function AddPersonForm({
  selectedNode,
  personAdded,
  personEdited,
}: {
  selectedNode: any;
  personAdded: (person: any) => void;
  personEdited: (person: any) => void;
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [files, setFiles] = useState<File[]>([]);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [theSameError, setTheSameError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [formName, setFormName] = useState<string>("");
  const [buttonSubmitName, setButtonSubmitName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { familyTreeId } = useParams<{ familyTreeId: string }>();
  const [profilePictureToSend, setProfilePictureToSend] =
    useState<FileDTO | null>(null);
  const [fileToSend, setFileToSend] = useState<FileDTO | null>(null);

  const [fileToOpen, setFileToOpen] = useState<File | null>(null);
  const MAX_FILE_SIZE = 20000000;
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

  const resetForm = () => {
    setFormData({
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
  };
  const resetFormError = () => {
    setFormErrors({
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
  };

  const [formErrors, setFormErrors] = useState({
    name: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    deathDate: "",
    birthPlace: "",
    deathPlace: "",
    gender: "",
    occupation: "",
    note: "",
  });

  useEffect(() => {
    resetForm();
    resetFormError();
    if (selectedNode) {
      setFormName("Edycja osoby");
      setButtonSubmitName("Edytuj osobę");

      const fetchPerson = async () => {
        try {
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
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${selectedNode}`,
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
          const transformedFiles = personData.files.map((file) => ({
            ...file,
            fileType: getFileTypeName(parseInt(file.fileType)) as FileType,
            fileExtension: getFileExtensionName(
              parseInt(file.fileExtension)
            ) as FileExtension,
          }));

          const fileToSet = transformedFiles.filter(
            (file) => file.fileType !== FileType.ProfileImage
          );

          const profileFileToSet = transformedFiles.find(
            (file) => file.fileType === FileType.ProfileImage
          );

          setFiles(fileToSet);
          setProfileFile(profileFileToSet || null);
        } catch (err) {
          setError("Failed to fetch person data");
        } finally {
          setLoading(false);
        }
      };

      fetchPerson();
    } else {
      setFormName("Dodawanie osoby");
      setButtonSubmitName("Dodaj osobę");
      setLoading(false);
      console.log("TreeID: ", familyTreeId);
    }
  }, [selectedNode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name": {
        return value.trim() === "" ? "Imię jest wymagane" : "";
      }
      case "middleName":
        return "";
      case "lastName":
        return value.trim() === "" ? "Nazwisko jest wymagane" : "";
      case "birthDate":
        return value.trim() === "" ? "Data urodzenia jest wymagana" : "";
      case "deathDate":
        return "";
      case "birthPlace":
        return value.trim() === "" ? "Miejsce urodznia jest wymagane" : "";
      case "deathPlace":
        return "";
      case "gender":
        return "";
      case "occupation":
        return "";
      case "note":
        return "";
      default:
        return "";
    }
  };

  const getFormattedDate = (date: string | null | undefined) => {
    return date ? date.split("T")[0] : "";
  };

  const ifTheSame = async () => {
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
      `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${selectedNode}`,
      config
    );
    const personData = response.data;
    if (formData.name != personData.name) {
      console.log("name");
      return false;
    }
    if (personData.middleName || formData.middleName)
      if (formData.middleName !== personData.middleName) {
        console.log("middlename");
        return false;
      }
    if (formData.lastName !== personData.lastName) {
      console.log("lastname");
      return false;
    }
    if (formData.birthPlace !== personData.birthPlace) {
      console.log("birthplace");
      return false;
    }
    if (formData.deathPlace || personData.deathPlace)
      if (formData.deathPlace !== personData.deathPlace) {
        console.log("deathplace");
        return false;
      }
    if (formData.birthDate !== personData.birthDate.split("T")[0]) {
      console.log("birthdate");
      return false;
    }
    if (personData.deathDate && personData.deathDate.includes("T")) {
      if (formData.deathDate !== personData.deathDate.split("T")[0]) {
        console.log("dethdate");
        return false;
      }
    }
    if (formData.occupation || personData.occupation)
      if (formData.occupation !== personData.occupation) {
        console.log("occupation");
        return false;
      }
    if (formData.note || personData.note)
      if (formData.note !== personData.note) {
        console.log("note");
        return false;
      }
    if (
      getGenderNumber(formData.gender).toString() !==
      personData.gender.toString()
    ) {
      console.log("gender");
      return false;
    }
    return true;
  };

  useEffect(() => {
    console.log("Nowa lista plikó: ", files);
  }, [files]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("W handleSubmit");
    setFileToOpen(null);
    e.preventDefault();

    const newFormErrors: any = {};
    let hasError = false;

    for (const [key, value] of Object.entries(formData)) {
      const error = validateField(key, value);
      if (error) {
        console.log("Error: ", key, " ", error);
        newFormErrors[key] = error;
        hasError = true;
      }
    }

    setFormErrors(newFormErrors);
    if (hasError) {
      return;
    }

    try {
      if (selectedNode) {
        const theSame = await ifTheSame();
        if (theSame && !profilePictureToSend) {
          setTheSameError("Nie wprowadzono żadnych zmian");
          return;
        }
        let updatedPerson = {
          ifPersonUpdated: false,
          id: selectedNode,
          name: "",
          lastName: "",
          ifPhotoUpdated: false,
          photoId: "",
          photo: "",
        };
        if (!theSame) {
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
          const response = await axios.put(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${selectedNode}`,
            {
              ...formData,
              id: selectedNode,
              birthDate: formData.birthDate.split("T")[0],
              deathDate: formData.deathDate
                ? formData.deathDate.split("T")[0]
                : null,
              gender: getGenderNumber(formData.gender),
              familyTreeId: familyTreeId,
            },
            config
          );
          if (response.status === 200 || response.status === 201) {
            updatedPerson = {
              ...updatedPerson,
              name: formData.name,
              lastName: formData.lastName,
              ifPersonUpdated: true,
            };
          }
        }
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
        if (profilePictureToSend) {
          const responseFoto = await axios.post(
            `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${selectedNode}/files`,
            {
              name: profilePictureToSend.name,
              fileType: getFileTypeNumber(profilePictureToSend.fileType),
              content: profilePictureToSend.content,
              fileExtension: getFileExtensionNumber(
                profilePictureToSend.fileExtension
              ),
              personId: selectedNode,
              headers: {
                "Content-Type": "application/json",
              },
            },
            config
          );
          if (responseFoto.status === 200 || responseFoto.status === 201) {
            const newFile: File = {
              id: responseFoto.data,
              fileType: profilePictureToSend.fileType as FileType,
              personId: selectedNode,
              name: profilePictureToSend.name,
              content: profilePictureToSend.content,
              fileExtension:
                profilePictureToSend.fileExtension as FileExtension,
              person: [],
            };
            if (responseFoto.status === 200 || responseFoto.status === 201) {
              updatedPerson = {
                ...updatedPerson,
                photoId: responseFoto.data,
                photo: profilePictureToSend.content,
                ifPhotoUpdated: true,
              };
            }
            if (newFile.fileType !== FileType.ProfileImage) {
              setFiles((prevFiles) => [...prevFiles, newFile]);
            }
            alert(`File ${profilePictureToSend.name} uploaded successfully!`);
            const profileFileLocal: File = {
              ...profilePictureToSend,
              id: responseFoto.data,
              person: [],
            };

            try {
              if (profileFile) {
                console.log("Update picture: ", profileFile);
                const response = await axios.put(
                  `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${selectedNode}/files/${profileFile.id}`,
                  {
                    ...profileFile,
                    name: profileFile.name,
                    content: profileFile.content,
                    fileExtension: getFileExtensionNumber(
                      profileFile.fileExtension
                    ),
                    personId: selectedNode,
                    fileType: getFileTypeNumber(FileType.Image),
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      ...config.headers,
                    },
                  }
                );

                console.log("File updated successfully:", response.data);
              }
            } catch (error) {
              console.error("Error updating file:", error);
              throw error;
            }
            if (profileFile) {
              setFiles((prevFiles) => [...prevFiles, profileFile]);
            }

            setProfileFile(profileFileLocal);
          } else {
            alert(
              `Failed to upload file ${profilePictureToSend.name}. Server responded with status ${responseFoto.status}`
            );
          }
        }
        personEdited(updatedPerson);
        setProfilePictureToSend(null);
      } else {
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
        const response = await axios.post(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons`,
          {
            ...formData,
            birthDate: formData.birthDate
              ? formData.birthDate.split("T")[0]
              : null,
            deathDate: formData.deathDate
              ? formData.deathDate.split("T")[0]
              : null,
            gender: getGenderNumber(formData.gender),
            familyTreeId: familyTreeId,
          },
          config
        );
        console.log("Dodano osobe:          ", profilePictureToSend);
        if (response.status === 200 && response.data) {
          const addedPersonId = response.data;
          let updatedFormData = {
            ...formData,
            id: addedPersonId,
            photoId: "",
            photo: "",
          };
          console.log("File:          ", profilePictureToSend);
          if (profilePictureToSend) {
            const responseFoto = await axios.post(
              `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${updatedFormData.id}/files`,
              {
                name: profilePictureToSend.name,
                fileType: getFileTypeNumber(profilePictureToSend.fileType),
                content: profilePictureToSend.content,
                fileExtension: getFileExtensionNumber(
                  profilePictureToSend.fileExtension
                ),
                personId: updatedFormData.id,
                headers: {
                  "Content-Type": "application/json",
                },
              },
              config
            );
            if (
              profilePictureToSend &&
              responseFoto.status === 200 &&
              responseFoto.data
            ) {
              updatedFormData = {
                ...updatedFormData,
                photo: profilePictureToSend.content,
                photoId: responseFoto.data,
              };
            }
          }
          setProfilePictureToSend(null);
          personAdded(updatedFormData);
        }
      }
      setTheSameError("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const getFileExtension = (file: any) => {
    const name = file.name;
    const extension = name.split(".").pop();
    if (
      extension &&
      Object.values(FileExtension).includes(extension as FileExtension)
    ) {
      return extension as FileExtension;
    }
    return FileExtension.pdf;
  };

  const getFileType = (fileExtension: any) => {
    if (
      fileExtension === FileExtension.docx ||
      fileExtension == FileExtension.pdf
    ) {
      return FileType.Document;
    } else if (fileExtension === FileExtension.mp3) {
      return FileType.Audio;
    } else {
      return FileType.Image;
    }
  };

  const handleFileChangeProfilePicture = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    console.log(file);

    if (file) {
      console.log("File size: ", file.size);
      if (file.size > MAX_FILE_SIZE) {
        alert("Plik jest zbyt duży. Maksymalny rozmiar to 30 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64String = (reader.result as string).split(",")[1];
          const fileExtension = getFileExtension(file);
          const fileType = FileType.ProfileImage;

          setProfilePictureToSend({
            content: base64String,
            fileExtension: fileExtension,
            fileType: fileType,
            name: file.name,
            personId: "",
          });

          console.log("Obraz załadowany jako Base64:", base64String);
          console.log("File po: ", profilePictureToSend);
        }
      };
      reader.readAsDataURL(file);
      console.log("File po: ", file);
    }
  };

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);

    if (file) {
      console.log("File size: ", file.size);
      if (file.size > MAX_FILE_SIZE) {
        alert("Plik jest zbyt duży. Maksymalny rozmiar to 30 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64String = (reader.result as string).split(",")[1];
          const fileExtension = getFileExtension(file);
          const fileType = getFileType(fileExtension);

          setFileToSend({
            content: base64String,
            fileExtension: fileExtension,
            fileType: fileType,
            name: file.name,
            personId: "",
          });

          console.log("Obraz załadowany jako Base64:", base64String);
          console.log("File po: ", profilePictureToSend);
        }
      };
      reader.readAsDataURL(file);
      console.log("File po: ", file);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleOpenFile = (file: File) => {
    console.log("Open file ", file);

    setFileToOpen(file);
  };

  const handleDeleteFile = (fileToDelete: File) => {
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
    axios
      .delete(
        `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${fileToDelete.personId}/files/${fileToDelete.id}`,
        config
      )
      .then(() => {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file !== fileToDelete)
        );
      })
      .catch(() => {
        setError("Error deleting file");
      });
  };

  const handleAddFile = async () => {
    if (fileToSend) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Brak tokena. Użytkownik nie jest zalogowany.");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const responseFoto = await axios.post(
          `https://localhost:7033/api/Familytrees/${familyTreeId}/persons/${selectedNode}/files`,
          {
            name: fileToSend.name,
            fileType: getFileTypeNumber(fileToSend.fileType),
            content: fileToSend.content,
            fileExtension: getFileExtensionNumber(fileToSend.fileExtension),
            personId: selectedNode,
          },
          config
        );

        if (responseFoto.status === 200 || responseFoto.status === 201) {
          const newFile: File = {
            id: responseFoto.data,
            fileType: fileToSend.fileType as FileType,
            personId: selectedNode,
            name: fileToSend.name,
            content: fileToSend.content,
            fileExtension: fileToSend.fileExtension as FileExtension,
            person: [],
          };
          if (newFile.fileType !== FileType.ProfileImage) {
            setFiles((prevFiles) => [...prevFiles, newFile]);
          }
          alert(`File ${fileToSend.name} uploaded successfully!`);
        } else {
          alert(
            `Failed to upload file ${fileToSend.name}. Server responded with status ${responseFoto.status}`
          );
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("An error occurred while uploading the file.");
      }
      setProfilePictureToSend(null);
    }
  };

  const handleExitFile = async () => {
    setFileToOpen(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className="FileForm-header"> {formName} </h1>
        {theSameError && <div className="error">{theSameError}</div>}
        <p className="FileForm-header">Dodaj zdjęcie profilowe</p>
        <input
          type="file"
          accept=".jpg, .png,"
          className="FileForm-input"
          onChange={handleFileChangeProfilePicture}
        />

        <div className="inputForm">
          <label>Imię:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {formErrors.name && <div className="error">{formErrors.name}</div>}
        </div>
        <div className="inputForm">
          <label>Drugie imie:</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
          {formErrors.middleName && (
            <div className="error">{formErrors.middleName}</div>
          )}
        </div>
        <div className="inputForm">
          <label>Nazwisko:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {formErrors.lastName && (
            <div className="error">{formErrors.lastName}</div>
          )}
        </div>
        <div className="inputForm">
          <label>Data urodzenia:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate.slice(0, 10)}
            onChange={handleChange}
          />
          {formErrors.birthDate && (
            <div className="error">{formErrors.birthDate}</div>
          )}
        </div>
        <div className="inputForm">
          <label>Data śmierci:</label>
          <input
            type="date"
            name="deathDate"
            value={formData.deathDate.slice(0, 10)}
            onChange={handleChange}
          />
          {formErrors.deathDate && (
            <div className="error">{formErrors.deathDate}</div>
          )}
        </div>
        <div className="inputForm">
          <label>Miejsce urodzenia:</label>
          <input
            type="text"
            name="birthPlace"
            value={formData.birthPlace}
            onChange={handleChange}
          />
          {formErrors.birthPlace && (
            <div className="error">{formErrors.birthPlace}</div>
          )}
        </div>
        <div className="inputForm">
          <label>Miejsce śmierci:</label>
          <input
            type="text"
            name="deathPlace"
            value={formData.deathPlace}
            onChange={handleChange}
          />
          {formErrors.deathPlace && (
            <div className="error">{formErrors.deathPlace}</div>
          )}
        </div>
        <div className="inputForm">
          <label>Płeć:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
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
            onChange={handleChange}
          />
          {formErrors.occupation && (
            <div className="error">{formErrors.occupation}</div>
          )}
        </div>
        <div className="inputForm">
          <label>Notatka:</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChangeTextArea}
            rows={6}
            cols={35}
            className="note-textarea"
          />
          {formErrors.note && <div className="error">{formErrors.note}</div>}
        </div>
        <button type="submit" className="buttonMenu2">
          {" "}
          {buttonSubmitName}{" "}
        </button>
      </form>
      {formName === "Edycja osoby" && (
        <div className="FileForm-upload-container">
          <h3 className="FileForm-header">Pliki:</h3>
          <p className="FileForm-header">Dodaj plik:</p>
          <input
            type="file"
            accept=".jpg, .png, .pdf, .docx, .mp3"
            className="FileForm-input"
            onChange={handleFileChange}
          />
          <button onClick={() => handleAddFile()} className="FileForm-btn">
            Dodaj
          </button>
          {files.length === 0 ? (
            <p></p>
          ) : (
            <ul className="FileForm-list">
              {files.map((file, index) => (
                <li key={index}>
                  <div className="FileForm-item">{file.name}</div>
                  <div>
                    <button
                      onClick={() => handleOpenFile(file)}
                      className="FileForm-item-btn"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file)}
                      className="FileForm-item-btn FileForm-item-btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {fileToOpen && (
            <>
              <div className="overlayBackground" onClick={handleExitFile}></div>
              {fileToOpen?.fileType === FileType.Document ? (
                <>
                  <div className="openFileStyle2">
                    <Button onClick={handleExitFile} className="exitButton">
                      x
                    </Button>
                    <OpenFile file={fileToOpen} />
                  </div>
                </>
              ) : (
                <div className="openFileStyle">
                  <Button onClick={handleExitFile} className="exitButton">
                    x
                  </Button>
                  <OpenFile file={fileToOpen} />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
