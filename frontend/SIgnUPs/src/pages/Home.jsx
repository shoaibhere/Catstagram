import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "../components/SideNav";
import Navbar from "../components/Navbar";
import Factsbar from "../components/factsbar";
import PostCard from "../components/postCard";

const Home = () => {
  const [posts, setPosts] = useState([]);

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
      </div>

      {/* Main Content Area */}
      <div className="flex h-full pt-16"> {/* pt-16 adds padding to avoid overlap with navbar */}
        {/* Left Sidebar (Fixed on the Left Side) */}
        <div className="fixed left-0 top-16 bottom-0 w-1/5 bg-black p-4 z-10">
          <SideNav />
        </div>

        {/* Main Content Area (Scrollable, filling remaining space) */}
        <div className="flex-grow ml-[20%] mr-[20%] p-4 overflow-y-auto bg-gray-900">
          <div className="mt-8">
            {/* Posts Timeline */}
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar (Fixed on the Right Side) */}
        <div className="fixed right-7 top-16 bottom-0 w-1/5 p-4 bg-gray-800 z-10">
          <Factsbar />
        </div>
      </div>
    </div>
  );
};

export default Home;