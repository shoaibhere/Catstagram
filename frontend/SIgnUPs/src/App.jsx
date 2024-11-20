import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "./components/SideNav";
import Navbar from "./components/Navbar";
import Factsbar from "./components/Factsbar";
import PostCard from "./components/postCard"; // Import PostCard component

const App = () => {
  const [posts, setPosts] = useState([]);

  // Fetch posts from your backend API (replace with actual backend URL)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/posts"); // Replace URL with your backend API endpoint
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex h-full">
        {/* Left Sidebar */}
        <SideNav />

        {/* Main Content Area (for posts) */}
        <div className="flex-grow flex justify-center p-4">
          <div className="w-full max-w-3xl">
            {/* Posts Timeline */}
            <div className="mt-8">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </div>

        {/* Facts Bar (on the right) */}
        <div className="w-1/4 p-4">
          <Factsbar />
        </div>
      </div>
    </div>
  );
};

export default App;
