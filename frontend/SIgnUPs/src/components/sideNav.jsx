import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Bookmark,
  MessageCircle,
  Compass,
  UserPlus,
  User,
} from "lucide-react"; // Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const SideNav = ({ user, theme }) => {
  return (
    <div
      className={`h-screen pt-8 flex flex-col items-center overflow-hidden ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Profile Section */}
      <Link to={`/profile?id=${user._id}`}>
        <div className="flex flex-col items-center content-center gap-2 mb-8">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-purple-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
              <User className="w-10 h-10 text-purple-600" />
            </div>
          )}
          <h3
            className={`text-lg font-semibold hidden md:block ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            {user.name}
          </h3>
        </div>
      </Link>

      {/* Create Post Button */}
      <Link to={`/create-post?id=${user._id}`}>
        <button
          className={`relative w-12 md:w-44 h-12 md:h-14 text-white mb-6 rounded-full text-lg font-bold flex items-center justify-center gap-2 group overflow-hidden ${
            theme === "dark" ? "bg-purple-600" : "bg-purple-600 text-white"
          }`}
        >
          <span className="absolute w-0 h-full bg-purple-400 group-hover:w-full transition-all duration-500 left-0 top-0"></span>
          <span className="absolute w-0 h-full bg-purple-500 group-hover:w-full transition-all duration-700 left-0 top-0"></span>
          <span className="absolute w-0 h-full bg-purple-300 group-hover:w-full transition-all duration-1000 left-0 top-0"></span>
          <FontAwesomeIcon
            icon={faPlus}
            className="text-lg relative z-10 group-hover:text-purple-800 transition-colors duration-500"
          />
          <span className="relative z-10 group-hover:text-purple-800 transition-colors duration-500 hidden md:block">
            Create Post
          </span>
        </button>
      </Link>

      {/* Buttons Section */}
      <div className="flex flex-col items-center space-y-4 w-full">
        {/* Explore Friends Button */}
        <Link to={`/explore-friends`}>
          <button
            className={`group flex items-center justify-center w-12 h-12 md:w-44 md:h-14 rounded-full px-3 py-2 ${
              theme === "dark"
                ? "text-white bg-black hover:bg-gray-600"
                : "text-black bg-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
            }`}
          >
            <Compass
              className={`w-8 h-8 md:w-6 md:h-6 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            />
            <span className="hidden md:block">Explore</span>
          </button>
        </Link>

        {/* My Friends Button */}
        <Link to={`/friends`}>
          <button
            className={`group flex items-center justify-center w-12 h-12 md:w-44 md:h-14 rounded-full px-3 py-2 ${
              theme === "dark"
                ? "text-white bg-black hover:bg-gray-600"
                : "text-black bg-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
            }`}
          >
            <Users
              className={`w-8 h-8 md:w-6 md:h-6 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            />
            <span className="hidden md:block">Friends</span>
          </button>
        </Link>

        {/* Requests Button */}
        <Link to={`/friend-requests`}>
          <button
            className={`group flex items-center justify-center w-12 h-12 md:w-44 md:h-14 rounded-full px-3 py-2 ${
              theme === "dark"
                ? "text-white bg-black hover:bg-gray-600"
                : "text-black bg-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
            }`}
          >
            <UserPlus
              className={`w-8 h-8 md:w-6 md:h-6 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            />
            <span className="hidden md:block">Requests</span>
          </button>
        </Link>

        {/* Chat Button */}
        <Link to={`/chat`}>
          <button
            className={`group flex items-center justify-center w-12 h-12 md:w-44 md:h-14 rounded-full px-3 py-2 ${
              theme === "dark"
                ? "text-white bg-black hover:bg-gray-600"
                : "text-black bg-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
            }`}
          >
            <MessageCircle
              className={`w-8 h-8 md:w-6 md:h-6 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            />
            <span className="hidden md:block">Chat</span>
          </button>
        </Link>

        {/* Saved Button */}
        <Link to={`/saved`}>
          <button
            className={`group flex items-center justify-center w-12 h-12 md:w-44 md:h-14 rounded-full px-3 py-2 ${
              theme === "dark"
                ? "text-white bg-black hover:bg-gray-600"
                : "text-black bg-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
            }`}
          >
            <Bookmark
              className={`w-8 h-8 md:w-6 md:h-6 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            />
            <span className="hidden md:block">Saved</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SideNav;
