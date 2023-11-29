import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { CenterFocusStrong } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

const Profile = () => {
  const currentUser = localStorage.getItem("currentUser");
  // const [userData, setUserData] = useState(null);
  const [jwt, setJwt] = useState();
  const cruser = JSON.parse(localStorage.getItem("currentUser"));
  const [userData, setUserData] = useState("");
  const { userID } = useParams();
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.post(
          "http://localhost:8080/user/profile/" + userID,
          null, // body là null nếu là POST request
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("respone ne:   " + response.data.data);
        setUserData(response.data.data);
        setPosts(response.data.data.postDTOList);
        //  console.log("d]u ma may"+JSON.stringify(response.data.data.postDTOList));
        //  console.log(userData.name);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchProfile();
  }, [token]);

  return (
    <div className="profile">
      <Helmet>
        <title>{userData.name}</title>
      </Helmet>
      <div className="images">
        <img
          src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
          className="cover"
        />
        <img
          // src={userData && userData.avatar ? userData.avatar : 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
          src={userData.avatar}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left"></div>
          <div className="center">
            <span>{userData.name}</span>
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        {posts != "" ? (
          <Posts posts={posts} />
        ) : (
          <div className="noPosts">Nothing here</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
