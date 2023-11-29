import React, { useEffect, useState } from "react";
import axios from "axios";
import "./myprofile.scss";
import Image from "../../assets/img.png";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { Menu, MenuItem } from "@mui/material";
import Modal from "react-modal";

const Profile = () => {
  const cruser = JSON.parse(localStorage.getItem("currentUser"));

  const [phone, setPhone] = useState(cruser.phone || "");
  const [name, setName] = useState(cruser.name);

  const [image, setImage] = useState("");
  const [imageView, setImageView] = useState("");
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [pets, setPets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  const handlePhoneChange = (e) => {
    setPhone(e.target.value || "");
  };
  const closeMessage = () => {
    setIsModalOpen(false);
  };
  const closeModal = () => {
    setImage("");
    setPhone("");
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

  const handleUpdateProfile = async () => {
    try {
      const data = {
        name: name, // Replace with the new name
        phone: phone, // Replace with the new phone number
      };
      if (image) {
        data.file = image;
      }
      const response = await axios.put(
        `http://localhost:8080/user/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Update successful:", response.data.data.avatar);
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("currentUser")),
        avatar: response.data.data.avatar,
        name: response.data.data.name,
        phone: response.data.data.phone,
      };
      console.log(cruser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      setName(response.data.name);
      setPhone(response.data.phone);
      setImage(response.data.file);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const togglePhoneNumber = () => {
    setShowPhoneNumber(!showPhoneNumber);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    // Handle the edit profile action here
    // You can open a modal or navigate to an edit profile page
    // Implement the logic to update name, phone, and image
    setIsModalOpen(true);
  };

  useEffect(() => {
    // Fetch pets
    async function fetchPet() {
      try {
        const response1 = await axios.get(
          `http://localhost:8080/pet/getAllPet`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPets(response1.data.data);
        console.log("ListPetaaaa:", pets);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPet();
  }, [token]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get(
          `http://localhost:8080/post/getAllYourPost`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data.data);
        console.log("Post: " + posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      //
    }

    fetchPosts();
  }, [token]);

  return (
    <div className="profile">
      <div className="images">
        <img
          src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
          className="cover"
        />
        <img
          src={image ? imageView.url : cruser.avatar}
          alt=""
          key={image ? imageView.url : cruser.avatar}
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left"></div>
          <div className="center">
            <span style={{ width: "300px", textAlign: "center" }}>
              {cruser.name}
            </span>
          </div>
          <div className="right">
            <div>
              <EmailOutlinedIcon onClick={togglePhoneNumber} />
              {showPhoneNumber && (
                <div>
                  <input
                    style={{ border: "none" }}
                    type="text"
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                </div>
              )}
            </div>
            <MoreVertIcon onClick={handleMenuClick} />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
            </Menu>
          </div>
        </div>

        {posts != "" ? (
          <Posts posts={posts} />
        ) : (
          <div className="noPosts">You don't have any posts yet</div>
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
        height: 370px;
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
          <h2 className="modal-header">Edit Profile</h2>
          <div className="modal-content">
            <br />
            <div className="textModal">
              {/* <label>Pet Name</label> */}
              <h4>Profile Image</h4>
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
              <h4>Name</h4>
              <input
                className="modal-input"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <h4>Phone</h4>
              <input
                className="modal-input"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                id="phone"
              />
            </div>
            <div className="imgModal">
              {image ? (
                <>
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
              ) : (
                <img
                  style={{
                    borderRadius: "5%",
                    maxWidth: "370px",
                    maxHeight: "360px",
                  }}
                  src={cruser.avatar}
                  alt=""
                />
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <button className="modal-button cancel" onClick={closeMessage}>
            Cancel
          </button>
          <button
            className="modal-button exchange"
            onClick={handleUpdateProfile}
          >
            Update
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
