import { useEffect, useState } from "react";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import axios from "axios";
import { Helmet } from "react-helmet";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const [refreshCmt, setRefreshCmt] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentAdded = () => {
    setRefreshCmt((prevTotal) => prevTotal + 1);
  };
  const handlePostCreated = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get(
          `http://localhost:8080/post/getAllPost`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && Array.isArray(response.data.data)) {
          setPosts(response.data.data);
          console.log(response.data.data); // Log the response data to inspect its structure.
        } else {
          console.error("Invalid response data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, [token]);

  return (
    <div className="home">
      <Helmet>
        <title>Home</title>
      </Helmet>
      {/* <Stories/> */}
      {/* <Share /> */}
      <Share onPostCreated={handlePostCreated} key={refreshKey} />
      {posts && (
        <Posts
          posts={posts}
          setPosts={setPosts}
          // onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};

export default Home;
