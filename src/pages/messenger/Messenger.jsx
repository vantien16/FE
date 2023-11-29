import "./messenger.scss";
import "../../components/navbar/navbar.scss";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Helmet } from "react-helmet";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { Avatar, Button, Fade, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MessageIcon from "@mui/icons-material/Message";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CD from "../../assets/CD.png";

import Snackbar from "@mui/material/Snackbar";
import Grow from "@mui/material/Grow";

export default function Messenger() {
  const serverUrl = "http://localhost:8080/ws";
  const [conversations, setConversations] = useState([]);
  //const [currentChat, setCurrentChat] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [messages, setMessages] = useState([]);
  //const [newMessage, setNewMessage] = useState("");
  //const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [text, setText] = useState("");

  const [isWebSocketConnected, setIsWebSocketConnected] = useState(null);

  const { toggle, darkMode } = useContext(DarkModeContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSearchClick = async () => {
    if (searchTerm) {
      // Redirect to the search results page
      navigate(`/search?content=${searchTerm}`);
    }
  };
  const handleToggleMessage = () => {
    navigate("/chat"); // Close the notification dropdown
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  //const socket = useRef();
  //const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [selectedUser, setSelectedUser] = useState(
    JSON.parse(localStorage.getItem("selectedUser"))
  );
  const headers = {
    username: currentUser.name,
  };

  const scrollRef = useRef();

  var stompClient = null;
  let socket;

  useEffect(() => {
    if (currentUser && !stompClient) {
      connect();
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      getChatMessages(selectedUser.id, currentUser.id);
    }
  }, [selectedUser]);

  const connect = () => {
    socket = new SockJS(serverUrl);
    stompClient = Stomp.over(socket);
    stompClient.connect(headers, onConnected);
    setIsWebSocketConnected(stompClient);
  };

  const onConnected = () => {
    console.log("WebSocket connected");
    console.log(stompClient);
    console.log(isWebSocketConnected);
    stompClient.subscribe(
      "/user/" + currentUser.name + "/queue/messages",
      (noti) => {
        const senderName = noti.body
          .split(",")[1]
          .split(":")[1]
          .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, "");

        setSelectedUser(JSON.parse(localStorage.getItem("selectedUser")));
        var se = JSON.parse(localStorage.getItem("selectedUser"));
        console.log(senderName);
        if (se === null) {
          se = "No one here";
        }
        console.log(se.name);

        if (senderName !== se.name) {
          const notificationMessage = `Received a message from ${senderName}!`;
          setSnackbarMessage(notificationMessage);
          setSnackbarOpen(true);
        }
      }
    );
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const getChatMessages = async (senderId, recipientId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/ws/messages/${senderId}/${recipientId}`
      );
      if (response.status === 200) {
        const messages = response.data;
        setMessages(messages);
      } else {
        console.log("Not Found");
      }
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
    }
  };

  const sendMessage = () => {
    if (text.trim() === "") {
      return; // Không gửi tin nhắn trống
    }
    console.log(stompClient);
    console.log("hehehe");
    if (!stompClient) {
      // Nếu chưa kết nối WebSocket, hãy kết nối trước khi gửi tin nhắn
      stompClient = isWebSocketConnected;
    }
    console.log(selectedUser);

    // Ensure the WebSocket connection is established
    const message = {
      content: text,
      senderId: currentUser.id,
      recipientId: selectedUser.id,
      senderName: currentUser.name,
      recipientName: selectedUser.name,
      createdOn: Date.now(),
      status: "RECEIVED",
    };

    stompClient.send("/app/chat", {}, JSON.stringify(message));

    // Xóa nội dung tin nhắn sau khi gửi
    setText("");

    // Thêm tin nhắn vào danh sách hiển thị
    setMessages([...messages, message]);
  };

  const handleUserSelect = (user) => {
    localStorage.setItem("selectedUser", JSON.stringify(user)); // Save the selected user
    setSelectedUser(user);
  };

  const getAllUsers = () => {
    axios
      .get("http://localhost:8080/user/getAllUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setConversations(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const searchUsers = () => {
    axios
      .get("http://localhost:8080/user/searchUser", {
        params: {
          name: searchText,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setConversations(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      searchUsers();
      setSearchText(""); // Xóa nội dung trường nhập liệu
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <Helmet>
        <title>Messenger</title>
      </Helmet>
      <div className="navbar">
        <div className="left">
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src={CD}
              alt="Dog Cat"
              style={{
                maxWidth: "60px",
                width: "100%",
                borderRadius: "50%",
                marginTop: "5px",
              }}
            />
            {/* <span className="logo">Dog Cat</span> */}
          </Link>
          {darkMode ? (
            <WbSunnyOutlinedIcon onClick={toggle} />
          ) : (
            <DarkModeOutlinedIcon onClick={toggle} />
          )}
          <GridViewOutlinedIcon />
          {currentUser.role === "ROLE_STAFF" ? (
            <Link to="/staff">
              {" "}
              <CheckCircleOutlineIcon />
            </Link>
          ) : null}
          <div className="search">
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            <SearchOutlinedIcon onClick={handleSearchClick} />
          </div>
          {/* ... Other components ... */}

          {/* Display search results */}
          <div className="search-results">
            {searchResults.map((post) => (
              <div key={post.id}>{/* Display search result information */}</div>
            ))}
          </div>
        </div>
        <div className="right">
          <PersonOutlinedIcon />
          <MessageIcon onClick={handleToggleMessage} />
          {/* {messageOpen && <MessageDropdown />} */}

          <NotificationsOutlinedIcon />

          {/* <Button
          aria-controls="fade-menu"
          aria-haspopup="true"
          onClick={handleClick}
          startIcon={<ArrowDropDownIcon />}
        >
          {currentUser.name}
          <Avatar
            className={currentUser.avatar}
            src={currentUser.avatar}
            style={{
              marginLeft: "10px",
            }}
          />
        </Button> */}
          {currentUser ? (
            <Button
              aria-controls="fade-menu"
              aria-haspopup="true"
              onClick={handleClick}
              startIcon={<ArrowDropDownIcon />}
            >
              {currentUser.name}
              <Avatar
                className={currentUser.avatar}
                src={currentUser.avatar}
                style={{
                  marginLeft: "10px",
                }}
              />
            </Button>
          ) : (
            <Button onClick={handleClick}>Log In</Button>
          )}

          <Menu
            id="fade-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem component={Link} to={`/my-profile`} onClick={handleClose}>
              Profile
            </MenuItem>
            <MenuItem component={Link} to={`/payment`}>
              Payment
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>

      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleEnterKeyPress}
              className="chatMenuInput"
            />
            {conversations.map((c) => (
              <div onClick={() => handleUserSelect(c)} ref={scrollRef}>
                <Conversation  conversation={c} currentUser={currentUser} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatBoxHeader">
              {selectedUser ? selectedUser.name : "Select someone to chat"}
            </div>
            {selectedUser ? (
              <>
                <div className="chatBoxTop">
                  {messages &&
                    messages.map((m) => (
                      <div ref={scrollRef}                           key={m.id}
                      >
                        <Message
                          message={m}
                          own={m.senderId === currentUser.id}
                          selectedUser={selectedUser}
                        />
                      </div>
                    ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper" ref={scrollRef}>
            {/* <ChatOnline setSelectedUser={handleUserSelect} /> */}

            <ChatOnline setSelectedUser={handleUserSelect} />
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Adjust as needed
        onClose={handleSnackbarClose}
        TransitionComponent={Grow}
        message={snackbarMessage}
      />
    </div>
  );
}
