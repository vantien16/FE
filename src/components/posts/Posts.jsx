import Post from "../post/Post";
import "./posts.scss";

const Posts = ({ posts, setPosts }) => {
  //Doi sua thanh status nua la  bo cmt la Ok
  // const filteredPosts = posts.filter(post => post.image != null);
  // console.log(filteredPosts);

  return (
    <div className="postts">
      {posts.map((post) => (
        <Post
          setPosts={setPosts}
          post={post}
          key={post.id}
          posts={posts}
          // onCommentAdded={onCommentAdded}
        />
      ))}
    </div>
  );
};

export default Posts;
