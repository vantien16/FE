import "./share.scss";
import Image from "../../assets/img.png";
import Pet from "../../assets/14.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Modal from "react-modal";
import axios from "axios";
import { useEffect } from "react";

const Share = ({ onPostCreated }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState("");
  // const [selectedImage, setSelectedImage] = useState("");
  const [selectedPet, setSelectedPet] = useState("");
  const [imageView, setImageView] = useState("");
  const [pets, setPets] = useState([]);
  const [error, setError] = useState("");
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const closeMessage = () => {
    setIsMessageOpen(false);
    onPostCreated();
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
  const handlePetChange = (event) => {
    setSelectedPet(event.target.value);
  };
  const creatPostDTO = {
    file: image,
    content: postText,
    idPet: selectedPet,
  };
  const getPet = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8080/pet/getAllPet", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPets(res.data.data);
  };

  const handlePost = async () => {
    if (image === "") {
      creatPostDTO.file = null;
    }
    const token = localStorage.getItem("token");
    if (image) {
      if (creatPostDTO.file.size > 5242880) {
        console.log(creatPostDTO.file.size);
        setError("Too big size image", creatPostDTO.file.size);
        isMessageOpen();
        return;
      } else if (
        creatPostDTO.file == null &&
        creatPostDTO.content.trim() == "" &&
        creatPostDTO.idPet.trim() == ""
      ) {
        setError("Please fill in all form");
        isMessageOpen();
        return;
      }
    }

    const response = await axios.post(
      "http://localhost:8080/post/createpost",
      creatPostDTO,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data === "Erorr: not fill content") {
      setError("Error");
      setIsMessageOpen(true);
    } else {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser && currentUser.role === "ROLE_STAFF") {
        setError("Post created successfully!");
      } else {
        setError(
          "Post created successfully! Your post is waiting for approval"
        );
      }
      setIsMessageOpen(true);
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={currentUser.avatar} alt="" />
          <textarea
            type="text"
            placeholder={`What's on your mind, ${currentUser.name}?`}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
        </div>
        {imageView.url && (
          <img
            htmlFor="file"
            className="post-img"
            src={imageView.url}
            alt="Selected"
            style={{ maxWidth: "20%" }}
            onClick={() => document.getElementById("file").click()}
          />
        )}

        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Pet} alt="" />
              {/* <span>Add Pet</span> */}
              <select
                id="petSelect"
                onClick={getPet}
                value={selectedPet}
                onChange={handlePetChange}
              >
                <option value="">Select a pet</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="right">
            <button onClick={handlePost}>Post</button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isMessageOpen}
        onRequestClose={closeMessage}
        contentLabel="Post Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          },
          content: {
            width: "300px",
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
            textAlign: "center",
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

export default Share;
