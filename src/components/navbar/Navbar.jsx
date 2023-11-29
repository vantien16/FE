import "./navbar.scss";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { Avatar, Button, Fade, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MessageIcon from "@mui/icons-material/Message";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import CD from "../../assets/CD.png";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import { createdOn, sendNotification, disconnectWebSocket } from "../../socket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "timeago.js";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  let stompClient = null;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const token = localStorage.getItem("token");

  const [messageOpen, setMessageOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [balance, setBalance] = useState(0);
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  useEffect(() => {
    getAllNotification(currentUser.id);
    // console.log("numberr ne",receivedItems.length);
  }, []);
  useEffect(() => { 

    // Create a new WebSocket connection if not already created
    if (!stompClient) {
      // Create the WebSocket connection
      createdOn(currentUser.name, (notification) => {
        console.log("Notification received:", notification);
        setNotifications((prev) => [...prev, notification]);
        setNotificationCount((count) => count + 1);
      });

    }

    return () => {
      stompClient = true;

      // Check if the WebSocket connection is open before disconnecting
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
      // stompClient=null;
    };
  }, []);
  // stompClient, currentUser.name

  const getNotification = async (recipientId) => {
    try {
      console.log("Fetching notifications for recipientId:", recipientId);
      const response = await axios.get(
        `http://localhost:8080/ws/notification/${recipientId}`
      );
      // console.log("Response from notifications endpoint:", response);

      if (response.status === 200) {
        const content = response.data;
        // console.log("Notifications content:", content);
        setNotifications(content);
        setNotificationCount(0);
      } else {
        console.log("Not Found");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Handle errors, such as displaying an error message to the user
    }
  };

  const getAllNotification = async (recipientId) => {
    try {
      console.log("Fetching notifications for recipientId:", recipientId);
      const response = await axios.get(
        `http://localhost:8080/ws/notification/noti/${recipientId}`
      );
      // console.log("Response from notifications endpoint:", response);

      if (response.status === 200) {
        const content = response.data;
        console.log("Notifications all ontent:", content);
        // setNotificationsAll(content);
        // console.log("All ne",notificationsAll);
        // setNotificationCount(0);
        const receivedItems = content.filter(item => item.status === 'RECEIVED');
        // setCountRe(receivedItems.length);
        setNotificationCount(receivedItems.length);


      } else {
        console.log("Not Found");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Handle errors, such as displaying an error message to the user
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    disconnectWebSocket();
    localStorage.clear();
    navigate("/login");
  };



  const handleBalance = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/user/getBalance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBalance(response.data.data); // Assuming the balance is in response.data.data
      console.log("ccc", response.data.data);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };
  useEffect(() => {
    handleBalance();
  }, [balance]); // The empty dependency array ensures that it only runs once when the component mounts

  const handleToggleMessage = () => {
    navigate("/chat"); // Close the notification dropdown
  };

  const handleToggleNotification = () => {
    setNotificationCount(notificationCount + 1); // Increment the count
    setNotificationOpen(!notificationOpen);
    setMessageOpen(false); // Close the message dropdown
  };

  const NotificationDropdown = () => {
    const sortedNotifications = notifications.sort(
      (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
    );

    return (
      <div className={`notify-dropdown ${notificationOpen ? "open" : ""}`}>
        <div className="dropdown-content">
          {/* Display notifications */}
          {/* {notificationCount > 0 ? (
              <div className="notification-count">{notificationCount}</div>
            ) : null} */}
          {/* Your notification items go here */}
          {sortedNotifications.map((notification) => (
            <div className="notify-item" key={notification.notiId}>
              {/* <Avatar className="notify-img" src={currentUser.avatar} /> */}
              <div className="notify-details">
                {/* <div className="notify-name">{currentUser.name}</div> */}
                <div className="notify-text">{notification.content}</div>
                <div className="notify-text">
                  {format(notification.createdOn)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = async () => {
    if (searchTerm) {
      // Redirect to the search results page
      navigate(`/search?content=${searchTerm}`);
    }
  };
  const handleNotificationClick = () => {
    // Toggle the notification dropdown
    setNotificationOpen((prevOpen) => !prevOpen);

    // Fetch notifications when the notification icon is clicked

    if (currentUser) {
      getNotification(currentUser.id);
    }
  };

  return (
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
          {/* <span>Dog Cat</span> */}
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

        <div className="notification-icon-container">
          <NotificationsOutlinedIcon onClick={handleNotificationClick} />
          {notificationOpen && <NotificationDropdown />}
          {notificationCount > 0 && (
            <div className="notification-circle">{notificationCount}</div>
          )}
        </div>

        <span>
          {balance.toFixed(2)} <AttachMoneyOutlinedIcon />
        </span>
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
        <ToastContainer />
      </div>
    </div>
  );
};

export default Navbar;
