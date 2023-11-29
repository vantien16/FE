import React, { useEffect, useState } from "react";
import axios from "axios";
import "./staff.scss"; // Tạo một file SCSS riêng cho trang của nhân viên
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Helmet } from "react-helmet";
import Modal from "react-modal";
import { sendNotification } from "../../socket";

const StaffProfile = () => {
  const staff = JSON.parse(localStorage.getItem("currentUser")); // Sử dụng dữ liệu của nhân viên

  const [staffPosts, setStaffPosts] = useState([]); // Sử dụng dữ liệu về bài đăng của nhân viên
  const token = localStorage.getItem("token"); // Sử dụng token của nhân viên
  const [error, setError] = useState("");
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasons, setRejectReasons] = useState([
    "Inappropriate Content",
    "Spam",
    "Violates Guidelines",
    "Other",
  ]);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [rejectId, setRejectId] = useState("");

  const closeMessage = () => {
    setIsMessageOpen(false);
    handleApprovePost();
  };
  const openMessage = (message) => {
    setNotificationMessage(message);
    setIsMessageOpen(true);
  };

  const closeModal = () => {
    setIsRejectModalOpen(false);
    setRejectReason("");
  };
  const [idUser, setIdUser] = useState("");
  const [nameUser, setNameUser] = useState("");
  const OpenModalReject = (postId, idUser, nameUser) => {
    setRejectId(postId);
    setIdUser(idUser);
    setNameUser(nameUser);
    setIsRejectModalOpen(true);
  };

  useEffect(() => {
    async function fetchStaffPosts() {
      try {
        const response = await axios.get(
          "http://localhost:8080/staff/getAllPostDisable",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStaffPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching staff posts:", error);
      }
    }

    fetchStaffPosts();
  }, [token]);

  const handleApprovePost = (postId, id, name) => {
    // Gọi API để duyệt bài viết
    axios
      .post(`http://localhost:8080/staff/${postId}/enable`, null, {
        headers: {
          Authorization: `Bearer ${token}`, // Thay token bằng token thực tế của nhân viên
        },
      })
      .then((response) => {
        // Xử lý khi duyệt bài viết thành công
        console.log("Bài viết đã được duyệt:", response.data.data);

        // Cập nhật trạng thái của bài viết trong danh sách staffPosts
        const updatedStaffPosts = staffPosts.map((post) => {
          if (post.id === postId) {
            return { ...post, isApproved: true };
          }
          return post;
        });

        setStaffPosts(updatedStaffPosts);
        // Hoặc bạn có thể tải lại danh sách bài viết sau khi duyệt bài viết thành công.
        openMessage("Accept Successfully");

        setIsMessageOpen(true);

        setStaffPosts((prevStaffPosts) =>
          prevStaffPosts.filter((post) => post.id !== postId)
        );
        sendNotification("Your post has been accepted.", id, name);
      })
      .catch((error) => {
        // Xử lý lỗi khi duyệt bài viết
        console.error("Lỗi khi duyệt bài viết:", error);
      });
  };

  // const handleReject = (postId) => {
  //   if (window.confirm("Are you sure you want to delete?")) {
  //     axios
  //       .delete(`http://localhost:8080/staff/${postId}/delete`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         console.log("xx", response.data);
  //         // Loại bỏ bài đăng bị từ chối khỏi danh sách posts
  //         setStaffPosts((prevPosts) =>
  //           prevPosts.filter((post) => post.id !== postId)
  //         );

  //         openMessage("Reject Successfully");
  //         setIsMessageOpen(true);
  //       })
  //       .catch((error) => {
  //         console.error("Error rejecting post:", error);
  //       });
  //   }
  // };

  const handleReject = (postId) => {
    setIsRejectModalOpen(true);
  };

  const confirmReject = (postId) => {
    // if (postId) {
    console.log("Rejecting post:", postId);
    axios
      .delete(`http://localhost:8080/staff/${postId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("xx", response.data);
        // Loại bỏ bài đăng bị từ chối khỏi danh sách posts
        setStaffPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId)
        );

        openMessage("Reject Successfully");
        setIsMessageOpen(true);
        sendNotification(
          `Your post has been rejected, because ${selectedReasons}`,
          idUser,
          nameUser
        );
      })
      .catch((error) => {
        console.error("Error rejecting post:", error);
      });
    setRejectReason("");
    setSelectedReasons([]);
    setIsRejectModalOpen(false);
    // }
  };

  return (
    <div className="staff-profile">
      <Helmet>
        <title>Staff</title>
      </Helmet>
      <div className="profileContainer">
        {staffPosts.length > 0 ? (
          <div>
            {staffPosts.map((post) => (
              <div key={post.id} className="pet-approval-frame">
                <div className="pet-approval-box">
                  <div className="avatar-container">
                    <img
                      src={post.userPostDTO.avatar}
                      alt=""
                      className="avatar"
                    />
                    <p>{post.userPostDTO.name}</p>
                  </div>

                  <p>{post.content}</p>
                  <img src={post.image} alt="" />
                  <div style={{ textAlign: "right" }}>
                    <button
                      onClick={() =>
                        handleApprovePost(
                          post.id,
                          post.userPostDTO.id,
                          post.userPostDTO.name
                        )
                      }
                      className="approve-button"
                      style={{ marginRight: "5px" }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        OpenModalReject(
                          post.id,
                          post.userPostDTO.id,
                          post.userPostDTO.name
                        )
                      }
                      className="reject-button"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="noPosts">
            This staff member doesn't have any posts yet
          </div>
        )}
      </div>
      <Modal
        isOpen={isRejectModalOpen}
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
            width: "600px",
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
    .modal-content {
      display: flex;
      flex-direction: column;
    }
    
    .modal-header {
      margin-bottom: 20px;
      color: #333;
    }
    
    .modal-body {
      margin-bottom: 20px;
      color: #555;
    }
    
    .textModal {
      width: 60%; /* Adjusted width for better visibility */
    }
    
    .imgModal {
      padding-left: 30px;
      width: 60%;
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
    
    .modal-button.reject {
      background-color: rgb(250, 73, 73);
      color: #fff;
      transition: background-color 0.3s ease-in-out;
    }
    
    /* Adjusted styling for the checkboxes and labels */
    span {
      display: block;
      margin-bottom: 10px;
    }
    
    input[type="checkbox"] {
      margin-right: 5px;
    }
    
    label {
      vertical-align: middle;
    }
    
    `}
        </style>
        <div>
          <h2 className="modal-header">Reject Post</h2>
          <div className="modal-content">
            <h3>Select reasons for rejection:</h3>
            {rejectReasons.map((reason, index) => (
              <span key={reason} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  id={reason}
                  checked={selectedReasons.includes(reason)}
                  onChange={() =>
                    setSelectedReasons((prevReasons) =>
                      prevReasons.includes(reason)
                        ? prevReasons.filter((r) => r !== reason)
                        : [...prevReasons, reason]
                    )
                  }
                />
                <label htmlFor={reason}>{reason}</label>
              </span>
            ))}
          </div>

          {/* <div style={{ textAlign: "right" }}> */}
            {/* <button className="modal-button cancel" onClick={closeModal}> */}
              {/* Cancel */}
            {/* </button> */}
            {/* <button */}
              {/* // className="modal-button reject" */}
              {/* // onClick={() => confirmReject(rejectId)} */}
            {/* // > */}
              {/* chỗ này đang lỗi  */}
              {/* Submit */}
            {/* </button> */}
          {/* </div> */}

          {selectedReasons.length === 0 && (
            <p style={{ color: "red" }}>
              Please select at least one reason before submitting.
            </p>
          )}
          <div style={{ textAlign: "right" }}>
            <button className="modal-button cancel" onClick={closeModal}>
              Cancel
            </button>
            <button
              className="modal-button reject"
              onClick={() => confirmReject(rejectId)}
              disabled={selectedReasons.length === 0}
            >
              {/* chỗ này đang lỗi  */}
              Submit
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isMessageOpen}
        onRequestClose={closeMessage}
        contentLabel="Staff Modal"
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
          <p>{notificationMessage}</p>
        </div>
      </Modal>
    </div>
  );
};

export default StaffProfile;
