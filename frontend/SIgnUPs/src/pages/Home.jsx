import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "../components/PostCard"; // Assuming PostCard component

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get("http://localhost:8000/api/posts");
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="mt-8">
      {posts
        .filter((post) => post.user) // Only render posts with a user
        .map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
    </div>
  );
};

export default Home;
