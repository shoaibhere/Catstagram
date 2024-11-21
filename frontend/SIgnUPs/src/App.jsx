<<<<<<< Updated upstream
import React from "react";
import SideNav from "./components/sideNav";
import Navbar from "./components/navbar";
=======
import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "./components/SideNav";
import Navbar from "./components/Navbar";
import Factsbar from "./components/Factsbar";
import PostCard from "./components/postCard";
import CreateAcc from "./components/CreateAcc";
>>>>>>> Stashed changes

const App = () => {
  return (
<<<<<<< Updated upstream
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Billabong&display=swap"
        rel="stylesheet"
      ></link>
      <Navbar />
      <SideNav />
    </>
=======
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Top Navbar (Fixed) */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex h-full pt-16">
        {" "}
        {/* pt-16 adds padding to avoid overlap with navbar */}
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
>>>>>>> Stashed changes
  );
};

export default App;
