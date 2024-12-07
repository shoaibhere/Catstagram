// src/pages/Home.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../pages/Layout";
import PostCard from "../components/postCard";

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
    <Layout>
      <div className="mt-8">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
