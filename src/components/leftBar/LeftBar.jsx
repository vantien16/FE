import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Market from "../../assets/3.png";
import Pet from "../../assets/14.png";
import Messages from "../../assets/10.png";
import Applied from "../../assets/16.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const LeftBar = () => {
  // const { currentUser } = useContext(AuthContext);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          {/* <Link to='/profile/${currentUser.id}' className="custom-link"> */}
          <Link to="/my-profile" className="custom-link">
            <div className="user">
              <img src={currentUser.avatar} alt="" />
              <span>{currentUser.name}</span>
            </div>
          </Link>
          <Link to="my-pets" className="custom-link">
            <div className="item">
              <img src={Pet} alt="" />
              <span>Pets</span>
            </div>
          </Link>
          {/* <div className="item">
            <img src={Groups} alt="" />
            <span>Groups</span>
          </div>
          <div className="item">
            <img src={Market} alt="" />
            <span>Marketplace</span>
          </div>
          <div className="item">
            <img src={Watch} alt="" />
            <span>Watch</span>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <span>Memories</span>
          </div> */}
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <Link to="market-place" className="custom-link">
            <div className="item">
              <img src={Market} alt="" />
              <span>Marketplace</span>
            </div>
          </Link>
          <Link to="view-apply" className="custom-link">
            <div className="item">
              <img src={Applied} alt="" />
              <span>Applied</span>
            </div>
          </Link>
          {/* <div className="item">
            <img src={Gaming} alt="" />
            <span>Gaming</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Gallery</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Videos</span>
          </div> */}
          <Link to="/chat" className="custom-link">
            <div className="item">
              <img src={Messages} alt="" />
              <span>Messages</span>
            </div>
          </Link>
        </div>
        <hr />
        {/* <div className="menu">
          <span>Others</span>
          <div className="item">
            <img src={Fund} alt="" />
            <span>Fundraiser</span>
          </div>
          <div className="item">
            <img src={Tutorials} alt="" />
            <span>Tutorials</span>
          </div>
          <div className="item">
            <img src={Courses} alt="" />
            <span>Courses</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LeftBar;
