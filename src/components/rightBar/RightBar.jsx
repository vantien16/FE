import React, { useState, useEffect } from "react";
import axios from "axios";
import "./rightBar.scss";
import { useNavigate } from "react-router-dom";

const RightBar = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isChatBoxVisible, setChatBoxVisible] = useState(false); // Thêm trạng thái chat box
  const [selectedUser, setSelectedUser] = useState(null); // Thêm trạng thái người dùng đang được chọn
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const getAllUsers = () => {
    axios
      .get("http://localhost:8080/user/getAllUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data.data);
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
        setUsers(response.data.data);
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
  // Hàm xử lý khi người dùng click vào một user
  const handleUserClick = (user) => {
    // Đặt trạng thái để hiển thị khung chat box
    // Lưu thông tin user đang chọn vào trạng thái
    // localStorage.setItem("selectedUser", JSON.stringify(user));
    setSelectedUser(user);
    navigate(`/profile/${user.id}`);
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleEnterKeyPress}
            />
            <button onClick={searchUsers}>Search</button>
          </div>
          <div className="user-list">
            <ul>
              {users &&
                users
                  .filter((user) => user.id !== currentUser.id)
                  .map((user) => (
                    <li key={user.id}>
                      <div
                        className={`user ${
                          selectedUser === user ? "active" : ""
                        }`}
                        onClick={() => handleUserClick(user)}
                      >
                        <div className="avatar-frame">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={`${user.name}'s avatar`}
                            />
                          ) : (
                            "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"
                          )}

                          {user.isOnline && <div className="online-dot" />}
                        </div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </li>
                  ))}
            </ul>
          </div>
          {/* <div className="chatOnline">
            <div className="chatOnlineWrapper">
              <ChatOnline setSelectedUser={handleUserClick} />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
