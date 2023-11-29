import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
// import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendNotification } from "../../socket";

const Post = ({ post, setPosts, posts }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [commentOpen, setCommentOpen] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenImage, setIsOpenImage] = useState(false);
  // const [postRefresh, setPostRefresh] = useState(0);
  const token = localStorage.getItem("token");
  // const [refreshCmt, setRefreshCmt] = useState(0);

  //phan like, cmt, update cua Khoa
  const [liked, setLiked] = useState(() => {
    const localStorageLiked = localStorage.getItem(
      `post_${post.id}_liked_by_${currentUser.id}`
    );
    return localStorageLiked
      ? JSON.parse(localStorageLiked)
      : post.fieldReaction;
  });
  // const [liked, setLiked] = useState(post.fieldReaction);
  const [tempTotalLikes, setTempTotalLikes] = useState(post.total_like);
  const [isEditMode, setEditMode] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(post.content);
  const [editingContent, setEditingContent] = useState(post.content);
  const [editingImage, setEditingImage] = useState(post.image);
  const [updatedImage, setUpdatedImage] = useState(post.image);
  const [totalComments, setTotalComments] = useState(post.total_comment);
  const [tempLiked, setTempLiked] = useState(false);
  const [viewer, setViewer] = useState([]);
  const [toReLike, setToReLike] = useState(true);
  const [likeList, setLikeList] = useState([]);
  const [isPostExist, setIsPostExist] = useState(false);
  const [showLikedUsers, setShowLikedUsers] = useState(false);

  // useEffect(() => {
  //   // Establish a SockJS connection
  //   const socket = new SockJS("http://localhost:8080/ws");
  //   const stompClient = Stomp.over(socket);

  //   // Clean up the socket connection on component unmount
  //   return () => {
  //     if (socket.readyState === WebSocket.OPEN) {
  //       socket.close();
  //       stompClient.disconnect();
  //     }
  //   };
  // }, []);

  // const sendNotification = () => {
  //   const socket = new SockJS("http://localhost:8080/ws");
  //   const stompClient = Stomp.over(socket);

  //   // You may need to customize the notification payload structure based on your server requirements
  //   const notificationData = {
  //     postId: post.id,
  //     // Other notification data
  //   };

  //   // Ensure the WebSocket connection is established
  //   stompClient.connect({}, () => {
  //     // Send the notification to the server
  //     stompClient.send(
  //       "/app/notification",
  //       {},
  //       JSON.stringify(notificationData)
  //     );
  //     // Disconnect the WebSocket connection after sending the notification
  //     stompClient.disconnect();
  //   });
  // };
  //bat like
  const isPostLiked = (postId, postList) => {
    return postList.some((post) => post.id === postId);
  };
  useEffect(() => {
    const getListLiked = async () => {
      try {
        const response2 = await axios.get(
          "http://localhost:8080/post/getAllYourPostReaction",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLikeList(response2.data.data);
        setIsPostExist(isPostLiked(post.id, response2.data.data));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getListLiked();
  }, [toReLike]);

  const updateTotalLikes = () => {
    setTempTotalLikes(post.total_like);
    setLiked(post.fieldReaction);
  };
  const updateTotalComments = () => {
    setTotalComments(post.total_comment + 1);
  };
  const toggleEditMode = () => {
    setEditMode(!isEditMode);
  };
  const handleMenuUpdate = () => {
    const updatedContent = editingContent;

    setUpdatedContent(updatedContent); // Cập nhật nội dung bài viết
    setEditMode(false);

    const updatedPost = {
      id: post.id,
      content: updatedContent, // Sử dụng nội dung đang chỉnh sửa
      //enable: 0, // Không bao gồm cập nhật hình ảnh
    };

    axios
      .put(`http://localhost:8080/post/update/${post.id}`, updatedPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // setUpdatedContent(updatedContent);
          setError(
            "Post updated successfully! Your post is waiting for approval"
          );
          setIsModalOpen(true);

          toggleEditMode();
        } else {
          console.error("Update failed");

          setError("Error");
          setIsModalOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error updating the post:", error);
      });
  };

  const handleLikeClick = () => {
    const newLiked = !liked;
    axios
      .post(`http://localhost:8080/reaction/${post.id}/like`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setToReLike(!toReLike); //thêm phần này bắt like
          setLiked(newLiked);
          setTempLiked(newLiked);
          setTempTotalLikes(!isPostExist ? tempTotalLikes + 1 : tempTotalLikes - 1);
          // localStorage.setItem(
          //   `post_${post.id}_liked_by_${currentUser.id}`,
          //   JSON.stringify(newLiked)
          // );
          if (!isPostExist) {
            sendNotification(
              `${currentUser.name} liked your post!`,
              post.userPostDTO.id,
              post.userPostDTO.name
            );
            // toast.info(
            //   `${currentUser.name} liked ${post.userPostDTO.name}'s post.`
            // );
          }


          //sendNotification();
        } else {
          console.error(error);
        }
      })
      .catch((error) => {
        console.error("Lỗi kết nối đến máy chủ.");
      });
  };

  //phan like, cmt, update cua Khoa

  const handleViewer = () => {
    axios
      .get(`http://localhost:8080/reaction/${post.id}/viewUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const likedUsers = response.data.data;
          setViewer(likedUsers);
          setShowLikedUsers(true);
          console.log("Liked Users:", likedUsers);
        }
      })
      .catch((error) => {
        console.error("Error fetching liked users:", error);
      });
  };

  const openImage = () => {
    setIsOpenImage(true);
  };
  const closeImage = () => {
    setIsOpenImage(false);
  };
  const calculateTimeDifference = (createDate) => {
    const currentDate = new Date();
    const [day, month, yearTime] = createDate.split("-");
    const [year, time] = yearTime.split(" ");
    const [hours, minutes] = time.split(":");
    const postCreateDate = new Date(year, month - 1, day, hours, minutes);
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

  const closeMessageDelete = () => {
    setIsModalOpen(false);
    setPosts(posts.filter((item) => item.id !== post.id));
  };

  const formattedDate = calculateTimeDifference(post.create_date);
  // console.log("fomasd",formattedDate);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuDelete = async () => {
    const response = await axios.delete(
      "http://localhost:8080/post/delete/" + post.id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // setPosts(posts.filter((item) => item.id !== post.id));
    console.log("Delete", response.data);
    handleMenuClose();
    if (response.data === "Not Found") {
      setError("Failed to delete");
      setIsModalOpen(true);
    } else {
      setIsModalOpen(true);
      setError("Delete success");
    }

    // window.location.reload();
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <div className="avatar">
              <img className="avtuser" src={post.userPostDTO.avatar} alt="" />
              {post.petToPostDTO && (
                <img className="avtpet" src={post.petToPostDTO.image} alt="" />
              )}
            </div>
            <div className="details">
              <Link
                to={
                  post.userPostDTO.id === currentUser.id
                    ? "/my-profile"
                    : `/profile/${post.userPostDTO.id}`
                }
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.userPostDTO.name} </span>{" "}
                {post.petToPostDTO && (
                  <>
                    <span style={{ fontSize: 14 }}>with </span>
                    <span style={{ fontStyle: "italic", fontWeight: "bold" }}>
                      {post.petToPostDTO.name}
                    </span>
                  </>
                )}
              </Link>
              <br />
              <span
                className="date"
                style={{ color: "grey", fontSize: "14px" }}
              >
                {formattedDate}
              </span>
            </div>
          </div>

          <MoreHorizIcon onClick={handleMenuClick} />
        </div>
        {isEditMode ? ( // Kiểm tra nếu đang ở chế độ chỉnh sửa
          <div className="content">
            <div className="content-wrapper">
              <input
                className="content-text"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
              />
              <button className="save-button" onClick={handleMenuUpdate}>
                Save
              </button>
            </div>
            {editingImage && (
              <img src={editingImage} onClick={openImage} alt="" />
            )}
          </div>
        ) : (
          <div className="content">
            <p>{updatedContent}</p>{" "}
            {/* Sử dụng updatedContent để hiển thị nội dung */}
            {updatedImage && (
              <img src={updatedImage} onClick={openImage} alt="" />
            )}
          </div>
        )}
        {/* <div className="content">                                            goc
          <p>{post.content}</p>                                                 goc
          <img src={post.image} alt="" onClick={openImage} />                   goc
        </div> */}
        <div className="infoo">
          <div
            className="item"
            onClick={handleLikeClick}
            onMouseEnter={handleViewer}
            onMouseLeave={() => setShowLikedUsers(false)}
          >
            {isPostExist ? ( //sửa
              <FavoriteOutlinedIcon style={{ color: "red" }} />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
            {tempTotalLikes} Likes
            {showLikedUsers && (
              <div
                className="liked-users"
                style={{
                  border: "1px solid #333",
                  borderRadius: "5px",
                  position: "absolute",
                  backgroundColor: "#fff",
                  padding: "5px",
                  zIndex: "10",
                  marginLeft: "100px",
                }}
              >
                {/* <p style={{ padding: "5px" }}>Liked by:</p> */}
                <ul>
                  {viewer.map((user) => (
                    <li
                      style={{ listStyleType: "none", padding: "5px" }}
                      key={user.id}
                    >
                      {user.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {totalComments} Comments
          </div>
          {/* <div className="item">
            <ShareOutlinedIcon />
            Share
          </div> */}
        </div>
        {commentOpen && (
          <Comments
            postId={post.id}
            postUserId={post.userPostDTO.id}
            postUserName={post.userPostDTO.name}
            totalComment={setTotalComments}
          />
        )}
      </div>
      {post.userPostDTO.id === currentUser.id ? (
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
          <MenuItem onClick={toggleEditMode}>Edit</MenuItem>
          <MenuItem onClick={handleMenuDelete}>Delete</MenuItem>
        </Menu>
      ) : null}

      <Modal
        isOpen={isModalOpen}
        // onRequestClose={closeModal}
        onRequestClose={
          error === "Delete success"
            ? closeMessageDelete
            : closeModal
        }
        contentLabel="Exchange Modal"
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
        isOpen={isOpenImage}
        onRequestClose={closeImage}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "50%",
            height: "fit-content",
            maxWidth: "65vh",
            margin: "auto",
            overflow: "hidden",
          },
        }}
      >
        <div></div>
        <div>
          <img
            src={post.image}
            alt=""
            style={{ width: "100%", maxHeight: "80vh" }}
          />
        </div>
      </Modal>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Post;
