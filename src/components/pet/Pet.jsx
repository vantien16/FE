import "./pet.scss";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import { useState } from "react";
// import Modal from "react-modal";
import Modal from "react-modal";
import { BorderAll, BorderAllOutlined } from "@mui/icons-material";
import axios from "axios";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

Modal.setAppElement("#root");

const Pet = ({ pet, setPets, pets }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const token = localStorage.getItem("token");

  // const [modalMessage, setModalMessage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isEditMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(pet.name);
  const [updatedName, setUpdatedName] = useState(pet.name);
  const [error, setError] = useState("");

  const [editedDescription, setEditedDescription] = useState(pet.description);
  const [updatedDescription, setUpdatedDescription] = useState(pet.description);

  const [editedImage, setEditedImage] = useState(pet.image);
  const [updatedImage, setUpdatedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [postType, setPostType] = useState("");
  const [isPriceLocked, setIsPriceLocked] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmationChecked, setConfirmationChecked] = useState(false);
  // const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeMessage = () => {
    setIsMessageOpen(false);
    closeModal();
    // if (
    //   error != "Update success" ||
    //   error != "Exchange created successfully."
    // ) {
    //   setPets(pets.filter((item) => item.id !== pet.id));
    // }
  };

  const closeMessageDelete = () => {
    setIsMessageOpen(false);
    setPets(pets.filter((item) => item.id !== pet.id));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      // If currently in edit mode, revert changes
      // setUpdatedName(pet.name);
      // setUpdatedDescription(pet.description);
      // setUpdatedImage(pet.image);
    }
    setEditMode(!isEditMode);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setUpdatedImage(file);
      setSelectedFile({
        name: file.name,
        url: URL.createObjectURL(file),
      });
    } else {
setUpdatedImage(pet.image);
      setSelectedFile(null);
    }

    console.log("Selected File:", file);
    console.log("Selected Image URL:", setSelectedFile);
  };

  const handleSubmit = async () => {
    try {
      const createExchangeDTO = {
        petDTO: {
          id: pet.id,
          image: pet.image,
          name: pet.name,
          description: pet.description,
        },
        description: description,
        paymentAmount: price,
      };
      const responseb = await axios.get(
        "http://localhost:8080/user/getBalance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        if(Number.parseInt(responseb.data.data)<1){
          setError("Your balance is insufficient!");
          setIsMessageOpen(true);
          return;
        }
      if (
        createExchangeDTO.paymentAmount < 0 ||
        createExchangeDTO.paymentAmount > Number.MAX_SAFE_INTEGER ||
        createExchangeDTO.paymentAmount.trim() == "" ||
        isNaN(createExchangeDTO.paymentAmount)
      ) {
        setError("Invalid data. Check again");
        setIsMessageOpen(true);
        return;
      }
      const response = await axios.post(
        "http://localhost:8080/exchange/create",
        createExchangeDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Exchange created successfully
        setError("Exchange created successfully.");
        setIsMessageOpen(true);
        closeModal();
        console.log("Exchange created successfully:", response.data);
      }
    } catch (error) {
      if (error.response.status === 400) {
        setError("This pet has been created");
        setIsMessageOpen(true);
        console.log("This pet has been created:");
      } else {
        setError("Error");
      }
    }
  };

  const handleUpdatePet = () => {
    if (!updatedName || !updatedName.trim()) {
      setError("Pet name cannot be empty");
      setIsMessageOpen(true);
      return;
    }

    if (!updatedDescription || !updatedDescription.trim()) {
      setError("Pet description cannot be empty");
      setIsMessageOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("id", pet.id);
    formData.append("name", updatedName);
    formData.append("description", updatedDescription);

    if (updatedImage) {
      formData.append("file", updatedImage);
    }

    console.log("Updated Pet:", formData);

    axios
      .put(`http://localhost:8080/pet/updatePet/${pet.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          toggleEditMode();
          console.log("Update Successful: ", response.data);
          setError("Update success");
          setIsMessageOpen(true);
        } else {
          console.log("Update failed");
          setError("Update failed");
          setIsMessageOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error updating the pet:", error);
        setError("Error failed");
        setIsMessageOpen(true);
      });
  };

  const handleMenuDelete = () => {
    setIsDeleteModalOpen(true);
  };
const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    // if (window.confirm("Are you sure you want to delete this pet?")) {
    axios
      .delete(`http://localhost:8080/pet/delete/${pet.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Xử lý khi xóa thành công, ví dụ chuyển người dùng đến trang khác hoặc làm mới danh sách thú cưng

          console.log("Pet deleted successfully");
          setError("Pet deleted successfully");
          setIsMessageOpen(true);
          // setPets(pets.filter((item) => item.id !== pet.id));
        } else {
          console.error("Delete failed");
          setError("Delete failed");
          setIsMessageOpen(true);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError("This pet is being exchanged");
          setIsMessageOpen(true);
        }
        console.error("Error deleting the pet:", error);
      });
    // }
    setIsDeleteModalOpen(false);
  };
  // const handleGift = () => {
  //   setPrice(0);
  //   setDescription("Gift");
  //   openModal();
  // };

  const handleSelectChange = (event) => {
    const selectedType = event.target.value;
    setPostType(selectedType);

    // Check if the selected type is "Gift"
    if (selectedType === "1") {
      setPrice(String(0)); // Set default price to 0
      setIsPriceLocked(true); // Lock the input field
    } else {
      setPrice(""); // Clear the price if not "Gift"
      setIsPriceLocked(false); // Unlock the input field
    }
  };

  return (
    <div className="pets">
      <div className="petcontainer">
        <div className="pet">
          {/* <div className="petInfo"> */}
          {/* <img  src={pet.image} alt="" /> */}
          {/* <div className="petdetails"></div>
          </div>  */}
          <MoreVertOutlinedIcon className="right" onClick={handleMenuClick} />
        </div>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={toggleEditMode}>
            {isEditMode ? "Cancel" : "Edit"}
          </MenuItem>
          <MenuItem onClick={handleMenuDelete}>Delete</MenuItem>
        </Menu>
        <div className="petcontent">
          {/* <img src={updatedImage || pet.image} alt="" /> */}
          <img src={selectedFile ? selectedFile.url : pet.image} alt="" />

          <div className="petInfo">
            {isEditMode ? (
              <div className="editFieldsContainer">
                <div className="editField">
                  <label htmlFor="name">Name: </label>
<input
                    type="text"
                    id="name"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    style={{
                      padding: "5px 10px",
                      width: "200px",
                      borderRadius: "5px",
                    }}
                  />
                </div>
                <div className="editField">
                  <label htmlFor="description">Description: </label>
                  <textarea
                    type="text"
                    id="description"
                    rows="4"
                    cols="50"
                    placeholder="Input description"
                    style={{
                      width: "100%",
                      height: "50px",
                      padding: "8px",
                      marginTop: "10px",
                      marginBottom: "20px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      resize: "none",
                      // overflow: hidden;
                    }}
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                  />
                </div>
                <div className="editField">
                  <label htmlFor="file">File: </label>
                  <input
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            ) : (
              <div className="editFieldsContainer">
                <p>
                  <strong>Name: </strong>
                  {updatedName}
                </p>
                <p>
                  <strong>Description: </strong> {updatedDescription}
                </p>
                {/* Sử dụng updatedContent để hiển thị nội dung */}
              </div>
            )}
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
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
              <h2 className="modal-header">Exchange Pet</h2>
              {/* <label>Pet Image: </label> */}
              {/* <input className="modal-input" type="text" value={pet.id} id="pet-id" readOnly />
               */}
              <div className="modal-content">
                <img
                  style={{
                    borderRadius: "5%",
                    marginTop: "20px",
                    marginRight: "30px",
                    maxWidth: "400px",
                    maxHeight: "300px",
                  }}
                  src={pet.image}
                  alt=""
                />
                <br />
                <div>
                  {/* <label>Pet Name</label> */}
                  <h4>Pet Name</h4>
                  <input
                    className="modal-input"
                    type="text"
                    value={pet.name}
                    id="pet-name"
                    readOnly
                  />
                  <h4>Type</h4>
                  <select
                    className="modal-select"
                    id="postType"
                    value={postType}
                    onChange={handleSelectChange}
                  >
                    <option value="">-- Choose --</option>
                    <option value="1">Gift</option>
                    <option value="2">Sale</option>
                  </select>

                  <h4>Price</h4>
                  <input
                    className="modal-input"
                    type="text"
                    id="pet-price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={isPriceLocked}
                  />

                  <h4>Description</h4>
                  <textarea
className="modal-textarea"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
                  />
                  <p className="modal-body">
                    <label>
                      {/* <input
                        type="radio"
                        name="exchangeConfirmation"
                        onChange={() =>
                          setConfirmationChecked(!isConfirmationChecked)
                        }
                      /> */}
                      Are you sure you want to create this exchange{" "}
                      <strong>{pet.name}</strong> with a <strong>$1</strong>?
                    </label>
                  </p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <button className="modal-button cancel" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="modal-button exchange"
                onClick={handleSubmit}
                // disabled={!isConfirmationChecked}
              >
                Exchange
              </button>
            </div>
          </Modal>
        </div>

        <button onClick={isEditMode ? handleUpdatePet : openModal}>
          {isEditMode ? "Save" : "Exchange"}
        </button>

        <Modal
          isOpen={isMessageOpen}
          onRequestClose={
            error === "Pet deleted successfully"
              ? closeMessageDelete
              : closeMessage
          }
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
              width: "250px",
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

        <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={handleCancelDelete}
          contentLabel="Delete Pet Modal"
          style={{
            overlay: {
backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 1000,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            content: {
              width: "350px",
              height: "fit-content",
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
          <div>
            <h2 className="modal-header">Delete Pet</h2>
            <p className="modal-body">
              Are you sure you want to delete <strong>{pet.name}?</strong>?
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <button
              className="modal-button cancel"
              onClick={handleCancelDelete}
              style={{
                padding: "10px",
                borderRadius: "5px",
                marginRight: "10px",
              }}
            >
              Cancel
            </button>
            <button
              className="modal-button delete"
              onClick={confirmDelete}
              style={{
                padding: "10px",
                backgroundColor: "#E65353",
                borderRadius: "5px",
              }}
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Pet;