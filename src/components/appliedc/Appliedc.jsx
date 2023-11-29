import "./appliedc.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import Modal from "react-modal";
import Pending from "../../assets/pending.png";
import Complete from "../../assets/complete.png";
import Reject from "../../assets/reject.png";

const Applied = ({ applied, setApplieds, applieds }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [error, setError] = useState("");
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const calculateTimeDifference = (createDate) => {
    const currentDate = new Date();
    const postCreateDate = new Date(createDate);
    const timeDifference = currentDate - postCreateDate;
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

    return formattedDate;
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const formattedDate = calculateTimeDifference(applied.applyDate);
  // console.log("fomasd",formattedDate);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  //TEMPORARY
  const liked = false;
  const closeMessage = () => {
    setIsMessageOpen(false);
    // setApplieds(applieds.filter((item) => item.id !== applied.id));
  };

  const closeMessageDelete = () => {
    setIsMessageOpen(false);
    setApplieds(applieds.filter((item) => item.id !== applied.id));
  };
  const [menuAnchor, setMenuAnchor] = useState(null);
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuDelete = () => {
    // Mở modal xác nhận trước khi xóa
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    // setPosts(posts.filter(item => item.id !== post.id))

    const response = await axios.delete(
      "http://localhost:8080/apply/" + applied.id,
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

  return (
    <div className="appliedc">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <div className="avatar">
              {/* <img className="avtuser" src={""} alt="" /> */}
              {/* <img className="avtpet" src={""} alt="" /> */}
              <img src={applied.exchange.userDTO.avatar} alt="" />
            </div>
            <div className="details">
              <Link
                // to={applied.exchange.user.id === currentUser.id ? '/my-profile' : `/profile/${applied.exchange.user.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{applied.exchange.userDTO.name} </span>
              </Link>

              <span className="date">{formattedDate}</span>
            </div>
          </div>

          <MoreHorizIcon onClick={handleMenuClick} />
        </div>
        {/* {applied.status} */}
        {applied.status === "PENDING" ? (
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
        ) : applied.status === "COMPLETED" ? (
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
        ) : (
          <img
            style={{
              width: "20%",
              right: "0px",
              transform: "rotate(56deg)",
              top: "35px",
              position: "absolute",
            }}
            src={Reject}
            alt=""
          />
        )}
        <div className="ccontent">
          <p>Pet Name: {applied.exchange.petDTO.name} </p>
          <p>Price: {applied.exchange.paymentAmount} </p>
          <img src={applied.exchange.petDTO.image} alt="" />
          {/* <p>{post.content}</p> */}
        </div>
        <div className="info"></div>
        {commentOpen && <Comments />}
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
        {applied.status === "PENDING" && (
          <MenuItem onClick={handleMenuDelete}>Delete</MenuItem>
        )}
      </Menu>

      <Modal
        isOpen={isMessageOpen}
        onRequestClose={
          error === "Delete Success"
            ? closeMessageDelete
            : closeMessage
        }        contentLabel="Apply Modal"
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

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Delete Applied Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          content: {
            width: "320px",
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
          <h2 className="modal-header">Delete Applied</h2>
          <p className="modal-body">
            Are you sure you want to delete this applied request?
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
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Applied;
