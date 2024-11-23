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
    // You can replace this with actual API data
    const demoPosts = [
      {
        _id: "1",
        user: {
          name: "John Doe",
          profilePicture: "https://via.placeholder.com/50",
        },
        caption: "Exploring the city!",
        imageUrl: "https://via.placeholder.com/600x400",
        likes: 120,
        comments: [
          { user: "Jane", text: "Looks awesome!" },
          { user: "Tom", text: "Nice shot!" },
        ],
        createdAt: "2024-11-21 10:00",
      },
      {
        _id: "2",
        user: {
          name: "Sarah Lee",
          profilePicture: "https://via.placeholder.com/50",
        },
        caption: "My favorite meal!",
        imageUrl: "https://via.placeholder.com/600x400",
        likes: 95,
        comments: [
          { user: "Alice", text: "Yum!" },
          { user: "Bob", text: "Looks delicious!" },
        ],
        createdAt: "2024-11-21 12:30",
      },
      {
        _id: "3",
        user: {
          name: "Sarah Lee",
          profilePicture: "https://via.placeholder.com/50",
        },
        caption: "My favorite meal!",
        imageUrl: "https://via.placeholder.com/600x400",
        likes: 95,
        comments: [
          { user: "Alice", text: "Yum!" },
          { user: "Bob", text: "Looks delicious!" },
        ],
        createdAt: "2024-11-21 12:30",
      },
      {
        _id: "4",
        user: {
          name: "Sarah Lee",
          profilePicture: "https://via.placeholder.com/50",
        },
        caption: "My favorite meal!",
        imageUrl: "https://via.placeholder.com/600x400",
        likes: 95,
        comments: [
          { user: "Alice", text: "Yum!" },
          { user: "Bob", text: "Looks delicious!" },
        ],
        createdAt: "2024-11-21 12:30",
      },
    ];

    setPosts(demoPosts);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col  text-white">
      {/* Top Navbar (Fixed) */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <Navbar />
        <Link
        to={`/create-post?id=${user._id}`}>
        <button class="overflow-hidden float-right fixed right-[22%] top-[565px] w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group">
          Create Post
          <span class="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
          <span class="absolute w-36 h-32 -top-8 -left-2 bg-purple-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
          <span class="absolute w-36 h-32 -top-8 -left-2 bg-purple-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>
          <span class="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <FontAwesomeIcon icon={faPlus} />
          </span>
        </button>
        </Link>
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
