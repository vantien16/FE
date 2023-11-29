import "./search.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Post from "../../components/post/Post";
import Posts from "../../components/posts/Posts";
import { Margin } from "@mui/icons-material";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("content");
  const [searchResults, setSearchResults] = useState([]);
  const token = localStorage.getItem("token");
  const crus = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/post/search?content=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        console.log("search", crus);
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          const sortedResults = response.data.data.sort((a, b) => {
            const dateA = new Date(a.create_date);
            const dateB = new Date(b.create_date);
            return dateA - dateB;
          });

          setSearchResults(sortedResults);
        } else {
          console.error("Invalid response structure or missing data array");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (searchTerm) {
      fetchSearchResults();
    } else {
      // Handle the case where there is no search term (optional)
    }
  }, [searchTerm, token]);

  // const fetchSearchResults = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8080/post/search?content=${searchTerm}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //       // Add any necessary headers or configurations
  //     );
  //     console.log(response.data);
  //     console.log("cc", crus);
  //     if (
  //       response.data &&
  //       response.data.data &&
  //       Array.isArray(response.data.data)
  //     ) {
  //       response.data.data.sort((a, b) => {
  //         const dateA = new Date(a.create_date);
  //         const dateB = new Date(b.create_date);
  //         return dateA - dateB;
  //       });

  //       setSearchResults(response.data.data);
  //     } else {
  //       console.error("Invalid response structure or missing data array");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching search results:", error);
  //   }
  // };

  // if (searchTerm) {
  //   fetchSearchResults();
  // } else {
  //   // Handle the case where there is no search term (optional)
  // }

  return (
    <div>
      <h2 style={{ margin: "30px" }}>Search Results for "{searchTerm}"</h2>
      {searchResults.length === 0 ? (
        <p style={{ margin: "30px" }}>No results found.</p>
      ) : (
        <Posts posts={searchResults} setPosts={setSearchResults} />

        // <ul>
        //   {searchResults.map((result) => (
        //     <li key={result.id}>
        //       <h3>{result.title}</h3>
        //       <p>{result.content}</p>
        //       {/* Add more details or styling as needed */}
        //     </li>
        //   ))
        //   }
        // </ul>
      )}
    </div>
  );
};

export default SearchResults;
