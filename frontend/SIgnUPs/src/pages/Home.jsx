import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "../components/SideNav";
import Navbar from "../components/Navbar";
import Factsbar from "../components/factsbar";
import PostCard from "../components/postCard";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Home = () => {
  const { user, logout } = useAuthStore();
  const [posts, setPosts] = useState([]);

  const handleLogout = () => {
    logout();
  };
  // Demo post data for testing
  useEffect(() => {
    async function fetchPosts() {
      const response = await axios.get("http://localhost:8000/api/posts");
      const allPosts = response.data.data;
      setPosts(allPosts);
    }
    fetchPosts();
  }, []);

  return (
    <div className="h-screen w-full flex flex-col  text-white">
      {/* Top Navbar (Fixed) */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <Navbar />
      </div>
      {/* Main Content Area */}
      <div className="flex h-full pt-16">
        {/* pt-16 adds padding to avoid overlap with navbar */}
        {/* Left Sidebar (Fixed on the Left Side) */}
        <div className="fixed left-0 top-16 bottom-0 w-1/5 bg-black p-4 z-10">
          <SideNav user={user} />
        </div>
        {/* Main Content Area (Scrollable, filling remaining space) */}
        <div className="flex-grow ml-[20%] mr-[20%] p-4 overflow-y-auto">
          {/* bg-gray-900 */}
          <div className="mt-8">
            {/* Posts Timeline */}
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
        {/* Right Sidebar (Fixed on the Right Side) */}
        <div className="fixed right-7 top-16 h-full bottom-0 w-1/5 p-4 bg-gray-800 z-10">
          <Factsbar />
        </div>
      </div>
    </div>
  );
};

export default Home;
