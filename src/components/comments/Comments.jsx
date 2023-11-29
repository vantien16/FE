import React, { useState, useEffect } from "react";
import axios from "axios";
import "./comments.scss";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SendIcon from "@mui/icons-material/Send";
import { sendNotification } from "../../socket";

const Comments = ({ postId, postUserId, postUserName,totalComment }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("token");

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [editModes, setEditModes] = useState({});
  const [updatedContent, setUpdatedContent] = useState();
  const [editComments, setEditComments] = useState([]);
  const [commentIdMenu, setCommentIdMenu] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleMenuClick = (event, comment) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setCommentIdMenu(comment.id);
    setEditComments([comment]);
    console.log("xx", comment);
  };

  const toggleEditMode = (commentId) => {
    console.log("Toggling edit mode for comment ID:", commentId);
    console.log("Current edit modes:", editModes);
    const commentToEdit = comments.find((comment) => comment.id === commentId);
    setUpdatedContent(commentToEdit?.content || "");
    setIsEdit();
    setEditModes((prevEditModes) => ({
      ...prevEditModes,
      [commentId]: !prevEditModes[commentId],
    }));
  };

  const handleMenuClose = () => {
    // setEditModes(false);
    setMenuAnchor(null);
    setCommentIdMenu(null);
    setIsEdit(false);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      // Send a PUT request to update the comment content
      const response = await axios.put(
        `http://localhost:8080/comments/${commentId}`,
        {
          content: updatedContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the update was successful
      if (response.status === 200) {
        // Update the comment in the local state
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, content: updatedContent }
              : comment
          )
        );

        // Exit the edit mode
        setEditModes((prevEditModes) => ({
          ...prevEditModes,
          [commentId]: false,
        }));
        handleMenuClose();
        console.log(`Comment with ID ${commentId} updated successfully.`);
      } else {
        console.error(`Failed to update comment with ID ${commentId}.`);
      }
    } catch (error) {
      console.error("Error updating the comment:", error);
    }
  };

  const handleDeleteClick = async (commentId) => {
    try {
      // Send a DELETE request to delete the comment
      const response = await axios.delete(
        `http://localhost:8080/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the deletion was successful
      if (response.status === 204) {
        // Remove the deleted comment from the comments array
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );        totalComment((prevTotalComments)=> prevTotalComments-1);

        handleMenuClose();
        console.log(`Comment with ID ${commentId} deleted successfully.`);
      } else {
        console.error(`Failed to delete comment with ID ${commentId}.`);
      }
    } catch (error) {
      console.error("Error deleting the comment:", error);
    }
  };

  const formatTimeDifference = (createdTime) => {
    const currentTime = new Date();
    const commentTime = new Date(createdTime);
    const timeDifference = currentTime - commentTime;

    if (timeDifference < 60 * 1000) {
      return `${Math.floor(timeDifference / 1000)} seconds ago`;
    } else if (timeDifference < 60 * 60 * 1000) {
      return `${Math.floor(timeDifference / (60 * 1000))} minutes ago`;
    } else if (timeDifference < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(timeDifference / (60 * 60 * 1000));
      const minutes = Math.floor(
        (timeDifference % (60 * 60 * 1000)) / (60 * 1000)
      );
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
      return `${days} days ago`;
    }
  };
  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/comments/post/${postId}`,
        // 'http://localhost:8080/comments/post/${postId}',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setComments(response.data);

      console.log("xx", comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const createComment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/comments/user/${currentUser.id}/post/${postId}`,
        {
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setComments([response.data, ...comments]);
        setNewComment("");
        totalComment((prevTotalComments)=> prevTotalComments+1);
        sendNotification(
          `${currentUser.name} commented your post`,
          postUserId,
          postUserName
        );
      } else {
        console.error("Invalid comment data received:", response.data);
      }
      //onPostRefresh();
    } catch (error) {
      console.error("Error creating a comment:", error);
    }
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.avatar} alt="" />
        <input
          type="text"
          placeholder="Write a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={createComment}>Send</button>
      </div>
      {comments ? (
        comments.map((comment) => (
          // {upCmtDate=new Date(comment.createdTime)}
          <div key={comment.id} className="comment">
            <img src={comment.userDTO.avatar} alt="" />
            <div className="content-infor">
              <div className="infor">
                <span>{comment.userDTO.name}</span> <br />
                {/* <p>{comment.content}</p> */}
                {editModes[comment.id] ? (
                  // Render input for editing when in edit mode
                  <textarea
                    style={{ borderRadius: "5px" }}
                    rows={4}
                    cols={50}
                    value={updatedContent}
                    onChange={(e) => setUpdatedContent(e.target.value)}
                  />
                ) : (
                  // Render comment content when not in edit mode
                  <p>{comment.content}</p>
                )}
                {editModes[comment.id] ? (
                  // Render Save button when in edit mode
                  <SendIcon
                    style={{ marginLeft: "10px" }}
                    onClick={() => handleSaveEdit(comment.id)}
                    // onBlur={setEditModes(false)}
                  />
                ) : null}
              </div>

              <div className="date">
                {formatTimeDifference(comment.createdTime)}
              </div>
            </div>
            {currentUser.id === comment.userDTO.id ? (
              <>
                <MoreHorizOutlinedIcon
                  onClick={(event) => handleMenuClick(event, comment)}
                />
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
                  {currentUser.id === comment.userDTO.id && (
                    <MenuItem onClick={() => toggleEditMode(commentIdMenu)}>
                      {editModes[comment.id] ? "Cancel" : "Edit"}
                      {/* {isEdit ? "Cancel" : "Edit"} */}
                    </MenuItem>
                  )}

                  {currentUser.id === comment.userDTO.id && (
                    <MenuItem onClick={() => handleDeleteClick(commentIdMenu)}>
                      Delete
                    </MenuItem>
                  )}
                </Menu>
              </>
            ) : null}
          </div>
        ))
      ) : (
        <div>No comments available.</div>
      )}
    </div>
  );
};

export default Comments;
