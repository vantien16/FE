import React, { useEffect, useState } from "react";
import axios from "axios";
import "./mypets.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Pets from "../../components/pets/Pets";
import Modal from "react-modal";
import Image from "../../assets/img.png";
import { Helmet } from "react-helmet";

// import { CenterFocusStrong, Pets } from '@mui/icons-material';

const MyPets = () => {
  const cruser = JSON.parse(localStorage.getItem("currentUser"));
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  const [pets, setPets] = useState([]);
  const [petCreate, setPetCreate] = useState("");
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [petType, setPetType] = useState("");
  const [image, setImage] = useState("");
  const [imageView, setImageView] = useState("");
  const [error, setError] = useState("");

  const handleSelectChange = (e) => {
    setPetType(e.target.value);
  };

  function isFormValid() {
    return name.trim() !== "" && petType.trim() !== "" && image !== "";
  }

  if (!isFormValid) {
    setError("Error! Please check your fields!");
  }

  const handleSubmit = async () => {
    try {
      const createPetDTO = {
        file: image,
        name: name,
        description: description,
        idPetType: petType,
      };
      console.log(createPetDTO.file.size);

      if (createPetDTO.file.size > 5242880) {
        console.log(createPetDTO.file.size);
        setError("Too big size image", createPetDTO.file.size);
        openMessage();
        return;
      } else if (
        createPetDTO.name.trim() == "" ||
        createPetDTO.description.trim() == "" ||
        createPetDTO.idPetType.trim() == "" ||
        createPetDTO.file == ""
      ) {
        setError("Please fill in all form");
        openMessage();
        return;
      }
      const response = await axios.post(
        `http://localhost:8080/pet/createpet`,
        createPetDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPetCreate(response.data);
      setError("Add Success");
      openMessage();
      closeModal();
    } catch (error) {}
  };

  const openMessage = () => {
    setIsMessageOpen(true);
  };
  const closeMessage = () => {
    setIsMessageOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setImage("");
    setDescription("");
    setName("");
    setIsModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageView({
        name: file.name,
        url: URL.createObjectURL(file),
      });
    }
  };

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response1 = await axios.get(
          "http://localhost:8080/pet/getAllPet",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPets(response1.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPet();
  }, [petCreate]);

  return (
    <div className="profile">
      <Helmet>
        <title>Pet</title>
      </Helmet>
      <div className="images">
        <img
          src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
          className="cover"
        />
        <img src={cruser.avatar} alt="" className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left"></div>
          <div className="center">
            <span>{cruser.name}</span>
            <button onClick={openModal}>Create Pet</button>
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        {/* <button onClick={openModal}>Create Pet</button> */}
        {pets != "" ? (
          <Pets pets={pets} setPets={setPets} />
        ) : (
          <div className="noPosts">You don't have any pets yet</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Pet Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          content: {
            width: "750px",
            height: "fit-content",
            maxHeight: "80vh",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            background: "#fff",
            fontFamily: "Arial, sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <style>
          {`
    .modal-content{
      display: flex;
    }

      .modal-header {
        margin-bottom: 20px;
        color: #333;
      }

      .modal-body {
        margin-bottom: 20px;
        color: #555;
      }


      .textModal{
        width:40%;
        .modal-input {
          width: 100%;
          padding: 8px;
          margin-top: 10px;
          margin-bottom: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          overflow: hidden;
        }
        .modal-textarea {
          width: 100%;
          height:50px;
          padding: 8px;
          margin-top: 10px;
          margin-bottom: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          resize: none;
          // overflow: hidden;
        }
        .modal-select{
          // width:105,66%;
          padding: 8px;
          margin-top: 10px;
          margin-bottom: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
      }

      .imgModal {
        padding-left:30px;
        width:60%;
        height: 391px;
        align-items: center;
        text-align: center;
      }
      
      .modal-button {
        padding: 8px 16px;
        margin-right: 10px;
        cursor: pointer;
        border: none;
        border-radius: 5px;
      }

      .modal-button.cancel {
        background-color: #ddd;
        color: #333;
        transition: background-color 0.3s ease-in-out;
      }

      .modal-button.exchange {
        background-color: #4CAF50;
        color: #fff;
        transition: background-color 0.3s ease-in-out;
      }
    `}
        </style>
        <div>
          <h2 className="modal-header">Add Pet</h2>
          <div className="modal-content">
            <br />
            <div className="textModal">
              {/* <label>Pet Name</label> */}
              <h4>Pet Image</h4>
              <input
                type="file"
                id="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label htmlFor="file">
                <div className="item">
                  {image ? (
                    <>
                      Choose image:
                      {/* <img
                        style={{ marginTop: "10px", height: "30px" }}
                        src={image.url}
                        alt={image.name}
                      /> */}
                      <p>{image.name}</p>
                    </>
                  ) : (
                    <img
                      style={{ marginTop: "10px", height: "30px" }}
                      src={Image}
                      alt=""
                    />
                  )}
                </div>
              </label>
              <br />
              <h4>Pet Name</h4>
              <input
                className="modal-input"
                type="text"
                id="pet-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <h4>Description</h4>
              <textarea
                className="modal-textarea"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
              />
              <h4>Pet Type</h4>
              <select
                className="modal-select"
                id="petType"
                value={petType}
                onChange={handleSelectChange}
              >
                <option value="">-- Choose --</option>
                <option value="1">Dog</option>
                <option value="2">Cat</option>
              </select>
            </div>
            <div className="imgModal">
              {image ? (
                <>
                  {/* , marginTop: "20px", marginLeft: "30px" */}
                  <img
                    style={{
                      borderRadius: "5%",
                      maxWidth: "370px",
                      maxHeight: "360px",
                    }}
                    src={imageView.url}
                    alt=""
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <button className="modal-button cancel" onClick={closeModal}>
            Cancel
          </button>
          <button className="modal-button exchange" onClick={handleSubmit}>
            Create
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isMessageOpen}
        onRequestClose={closeMessage}
        contentLabel="Exchange Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          content: {
            width: "150px",
            height: "fit-content",
            maxHeight: "20vh",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            background: "#fff",
            fontFamily: "Arial, sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <style>
          {`
    .modal-content{
      display: flex;
    }
      .modal-header {
        margin-bottom: 20px;
        color: #333;
      }

      .modal-body {
        margin-bottom: 20px;
        color: #555;
      }
    `}
        </style>
        <div>
          <h2 className="modal-header">Message</h2>
          <div className="modal-content">{error}</div>
        </div>
      </Modal>
    </div>
  );
};

export default MyPets;
