import "./exchange.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import Modal from "react-modal";
import Applied_of_exchange from "../applied_of_exchange/Applied_of_exchange";
import Pending from "../../assets/pending.png";
import Complete from "../../assets/complete.png";
import Gift from "../../assets/gift.png";
import { sendNotification } from "../../socket";

const Exchange = ({ exchange, setExchanges, exchanges, view }) => {
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const currentDate = new Date();
  const upExchangeDate = new Date(exchange.exchangeDate);
  const timeDifference = currentDate - upExchangeDate;
  const [error, setError] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isOpenApply, setIsOpenApply] = useState(false);
  const [appliesCount, setAppliesCount] = useState(0);

  //Edit Khoa
  const [updatedPaymentAmount, setUpdatePaymentAmount] = useState(
    exchange.paymentAmount
  );
  const [editedPaymentAmount, setEditedPaymentAmount] = useState(
    exchange.paymentAmount
  );

  const handleCountChange = (count) => {
    // Update the applies count in Exchange component
    setAppliesCount(count);
  };

  //Edit Khoa
  const [isEditMode, setEditMode] = useState(false);
  const toggleEditMode = () => {
    setEditMode(!isEditMode);
  };
  const handleMenuUpdate = () => {
    const updatedPaymentAmount = editedPaymentAmount;

    if (updatedPaymentAmount === "" || isNaN(updatedPaymentAmount)) {
      console.log("Payment amount must be a valid number");
      setError("Payment amount must be a valid number");
      setIsMessageOpen(true);
      return;
    }

    if (updatedPaymentAmount < 0) {
      console.error("Payment amount cannot be less than 0");
      setError("Payment amount cannot be less than 0");
      setIsMessageOpen(true);
      // You can display an error message to the user or handle it as needed
      return;
    }

    setUpdatePaymentAmount(updatedPaymentAmount);
    setEditMode(false);
    const toggleEditMode = () => {
      setEditMode(!isEditMode);
    };
    const exchangeDTO = {
      id: exchange.id,
      paymentAmount: updatedPaymentAmount,
    };

    console.log("update", exchangeDTO);
    axios
      .put(
        `http://localhost:8080/exchange/${exchange.id}/edit-cash?paymentAmount=${updatedPaymentAmount}`,
        exchangeDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          maxRedirects: 0,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setUpdatePaymentAmount(updatedPaymentAmount);
          setError("Update Successfully");
          setIsMessageOpen(true);
          toggleEditMode();
          console.log(response.data);
        } else {
          console.error("Update failed");
          setError("Update failed");
          setIsMessageOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error updating exchange:", error);
      });
  };

  const handleMenuClick = (event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện nổi bọt
    setMenuAnchor(event.currentTarget);
  };
  const token = localStorage.getItem("token");

  const handleApply = async () => {
    try {
      const apply = await axios.post(
        "http://localhost:8080/apply/create",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userid: exchange.userDTO.id,
            id: exchange.id,
          },
        }
      );
      setError("Apply Successfully");
      setIsMessageOpen(true);
      console.log(apply.data);
      sendNotification(
        `${currentUser.name} sent an apply to your exchange with pet ${exchange.petDTO.name}`,
        exchange.userDTO.id,
        exchange.userDTO.name
      );
    } catch (error) {
      console.error(error);
    }
  };

  const closeMessage = () => {
    setIsMessageOpen(false);
    // setExchanges(exchanges.filter((item) => item.id !== exchange.id));
  };

  const closeMessageDelete = () => {
    setIsMessageOpen(false);
    setExchanges(exchanges.filter((item) => item.id !== exchange.id));
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleMenuDelete = async () => {
    // Open the delete confirmation modal
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const response = await axios.delete(
      "http://localhost:8080/exchange/" + exchange.id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    if (response.status === 200) {
      setError("Delete Success");
      handleMenuClose();
      setIsMessageOpen(true);
      setIsDeleteModalOpen(false);
    } else {
      setError("Not found");
      handleMenuClose();
      setIsMessageOpen(true);
      setIsDeleteModalOpen(false);
    }
  };

  let formattedDate;

  if (timeDifference < 60 * 1000) {
    formattedDate = `${Math.floor(timeDifference / 1000)} seconds ago`;
  } else if (timeDifference < 60 * 60 * 1000) {
    formattedDate = `${Math.floor(timeDifference / (60 * 1000))} minutes ago`;
  } else if (timeDifference < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(timeDifference / (60 * 60 * 1000));
    const minutes = Math.floor(
      (timeDifference % (60 * 60 * 1000)) / (60 * 1000)
    );
    formattedDate = `${hours} hours ago`;
  } else {
    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    formattedDate = `${days} days ago`;
  }
  const isGift = exchange.paymentAmount === 0;
  return (
    <div className="exchange">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <div className="avatar">
              <img className="avtuser" src={exchange.userDTO.avatar} alt="" />
            </div>
            <div className="details">
              <Link
                to={
                  exchange.userDTO.id === currentUser.id
                    ? "/my-profile"
                    : `/profile/${exchange.userDTO.id}`
                }
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{exchange.userDTO.name} </span>
              </Link>
              <span className="date">{formattedDate}</span>
            </div>
          </div>

          <MoreHorizIcon onClick={handleMenuClick} />
        </div>
        {view &&
          (exchange.status === "PENDING" ? (
            <img
              style={{
                width: "20%",
                right: "0px",
                transform: "rotate(56deg)",
                top: "35px",
                position: "absolute",
              }}
              src={Pending}
              alt=""
            />
          ) : (
            <img
              style={{
                width: "20%",
                right: "0px",
                transform: "rotate(56deg)",
                top: "35px",
                position: "absolute",
              }}
              src={Complete}
              alt=""
            />
          ))}
        <div className="exchange-content">
          <p
            style={{
              fontWeight: "500",
              marginTop: "15px",
              marginBottom: "10px",
            }}
          >
            {exchange.description}
          </p>
          <div className="pet-conent">
            {/* <p>{exchange.petDTO.description}</p> */}
            <div className="pet-info">
              <p>
                <strong>Pet Name: </strong>
                {exchange.petDTO.name}
              </p>
              <p>
                <strong>Description: </strong>
                {exchange.petDTO.description}
              </p>
              {isEditMode ? ( // Nếu đang trong chế độ chỉnh sửa
                <div>
                  <label htmlFor="price">Price: </label>
                  <input
                    type="number"
                    value={editedPaymentAmount}
                    onChange={(e) => setEditedPaymentAmount(e.target.value)}
                    style={{
                      width: "25%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              ) : (
                <p>
                  <strong>Price: </strong>
                  {updatedPaymentAmount} VND
                  {isGift && (
                    <span>
                      {" - "}
                      <strong style={{ color: "red", fontStyle: "italic" }}>
                        "Complimentary, not for sale"
                      </strong>{" "}
                      <img
                        src={Gift} // Provide the actual path to your gift icon
                        alt="Gift"
                        style={{
                          width: "20px",
                          height: "20px",
                          marginLeft: "5px",
                        }}
                      />
                    </span>
                  )}
                </p>
              )}
              {/* <p>Price: <strong>{exchange.paymentAmount}</strong></p> */}
            </div>
            <img src={exchange.petDTO.image} alt="" />
          </div>
        </div>

        <div className="info">
          {isEditMode ? (
            <button onClick={handleMenuUpdate} className="apply-button">
              Save
            </button>
          ) : exchange.userDTO.id === currentUser.id ? (
            // !isClosed && (
            <button
              onClick={() => setIsOpenApply(!isOpenApply)}
              className="apply-button"
            >
              View Apply ({appliesCount})
            </button>
          ) : (
            // )
            <button onClick={handleApply} className="apply-button">
              Apply
            </button>
          )}
        </div>

        {/* {commentOpen && <Comments />} */}
      </div>

      {exchange.userDTO.id === currentUser.id &&
      exchange.status !== "COMPLETED" ? (
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
      ) : null}

      <Modal
        isOpen={isMessageOpen}
        onRequestClose={
          error === "Delete Success"
            ? closeMessageDelete
            : closeMessage
        }        c        contentLabel="Exchange Modal"
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
            width: "200px",
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
      {isOpenApply && (
        // eslint-disable-next-line react/jsx-pascal-case
        <Applied_of_exchange
          exchange={exchange}
          onCountChange={handleCountChange}
        />
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Delete Exchange Modal"
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
          <h2 className="modal-header">Delete Exchange</h2>
          <p className="modal-body">
            Are you sure you want to delete this exchange?
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <button
            className="modal-button cancel"
            onClick={() => setIsDeleteModalOpen(false)}
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
            onClick={handleConfirmDelete}
            style={{
              padding: "10px",
              backgroundColor: "#E65353",
              borderRadius: "5px",
              color: "#fff",
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Exchange;
