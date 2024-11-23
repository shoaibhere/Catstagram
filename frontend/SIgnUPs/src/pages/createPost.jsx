import React, { useState, useEffect } from "react";
import SideNav from "../components/SideNav";
import Navbar from "../components/Navbar";
import Factsbar from "../components/factsbar";
import { useAuthStore } from "../store/authStore";
import CreatePostForm from "../components/createPostForm.jsx";


const createPost = () => {
  const { user, logout } = useAuthStore();


  return (
    <div className="h-screen w-full flex flex-col text-white p-4">
      {/* Top Navbar (Fixed) */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex h-full pt-16">
        {/* Left Sidebar (Fixed on the Left Side) */}
        <div className="fixed left-0 top-16 bottom-0 w-1/5 bg-black p-4 z-10">
          <SideNav user={user} />
        </div>

        {/* Main Content Area (Scrollable, filling remaining space) */}
        <div className="flex-grow ml-[20%] mr-[20%] p-4 overflow-y-auto">
          <div className="flex justify-center h-full items-center">
            <CreatePostForm user={user}/>
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

export default createPost;
