import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.scss";

export default function ChatOnline({ setSelectedUser }) {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  //const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [OnlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        // Fetch a list of online users
        const onlineUsersResponse = await axios.get(
          `http://localhost:8080/ws/users/${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (onlineUsersResponse.status === 200) {
          const onlineUsers = onlineUsersResponse.data;
          const updatedOnlineUsers = onlineUsers.filter(
            (user) => user.id !== currentUser.id
          );

          const idMap = {};
          const updatedOnlineUsers1 = [];

          for (const user of updatedOnlineUsers) {
            if (!idMap[user.id]) {
              idMap[user.id] = true;
              updatedOnlineUsers1.push(user);
            }
          }

          setOnlineUsers(updatedOnlineUsers1);
        }
      } catch (error) {
        console.error("Error fetching online users and chatrooms:", error);
      }
    };

    fetchOnlineUsers();
    const fetchInterval = setInterval(() => {
      fetchOnlineUsers(); // Fetch every 5 seconds
    }, 3000);

    return () => {
      clearInterval(fetchInterval);
    };
  }, []);

  const handleClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="chatOnline">
      {OnlineUsers.map((o) => (
        <div key={o.id} className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img className="chatOnlineImg" src={o.avatar} alt="" />
            <div
              className={`chatOnlineBadge ${
                o.status === "ONLINE" ? "online" : "offline"
              }`}
            ></div>
          </div>
          <span className="chatOnlineName">{o.name}</span>
        </div>
      ))}
    </div>
  );
}
