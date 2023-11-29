import React, { useEffect, useState } from "react";
import axios from "axios";
import "./applied.scss";
import Applieds from "../../components/applieds/Applieds";
import { Helmet } from "react-helmet";
import SlideSwitch from "../../components/slideswitch/SlideSwitch";

const MarketPlace = () => {
  const currentUser = localStorage.getItem("currentUser");
  const [userData, setUserData] = useState(null);
  const [jwt, setJwt] = useState();

  const cruser = JSON.parse(localStorage.getItem("currentUser"));

  const [applieds, setApplieds] = useState([]);

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/apply/view-applies",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedExchanges = response.data.sort((a, b) => {
          return new Date(b.applyDate) - new Date(a.applyDate);
        });
        console.log(response.data);
        setApplieds(sortedExchanges);
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchData();
  }, [token]);
  return (
    <div className="applied">
      <Helmet>
        <title>Applied</title>
      </Helmet>
      <div className="appliedContainer">
        {applieds != "" ? (
          <Applieds applieds={applieds} setApplieds={setApplieds} />
        ) : (
          <div className="noPosts">Nothing here</div>
        )}
      </div>
    </div>
  );
};

export default MarketPlace;
