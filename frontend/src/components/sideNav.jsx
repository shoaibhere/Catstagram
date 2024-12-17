import React from "react";
import { Link } from "react-router-dom";
import { Users, User, Bookmark, MessageCircle, Compass } from "lucide-react"; // Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const SideNav = ({ user }) => {
  return (
    <div className="bg-black text-white h-screen pt-8 flex flex-col items-center overflow-hidden">
      {/* Profile Section */}
      <Link to={`/profile/${user._id}`}>
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
          <h3 className="text-lg font-semibold hidden md:block">{user.name}</h3>
        </div>
      </Link>

      {/* Create Post Button */}
      <Link to={`/create-post?id=${user._id}`}>
        <button className="relative w-12 md:w-44 bg-purple-600 text-white p-3 mb-6 rounded-full text-lg font-bold flex items-center justify-center gap-2 group overflow-hidden">
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
        {/* Find Friends Button */}
        <Link to={`/explore-friends`}>
          <button className="bg-black hover:bg-gray-600 text-white w-14 md:w-44 text-center rounded-full px-4 py-3 flex items-center justify-center gap-2 group">
            <Compass className="w-15 h-15 sm:w-8 sm:h-8 md:w-6 md:h-6 group-hover:text-black" />
            <span className="hidden md:block text-white">Explore</span>
          </button>
        </Link>

        {/* Friends Button */}
        <Link to={`/friends`}>
          <button className="bg-black hover:bg-gray-600 text-white w-14 md:w-44 text-center rounded-full px-4 py-3 flex items-center justify-center gap-2 group">
            <Users className="w-15 h-15 sm:w-8 sm:h-8 md:w-6 md:h-6 group-hover:text-black" />
            <span className="hidden md:block text-white">Friends</span>
          </button>
        </Link>

        {/* Chat Button */}
        <Link to={`/chat`}>
          <button className="bg-black hover:bg-gray-600 text-white w-14 md:w-44 text-center rounded-full px-4 py-3 flex items-center justify-center gap-2 group">
            <MessageCircle className="w-10 h-10 sm:w-8 sm:h-8 md:w-6 md:h-6 group-hover:text-black" />
            <span className="hidden md:block text-white">Chat</span>
          </button>
        </Link>

        {/* Saved Button */}
        <Link to={`/saved-posts`}>
          <button className="bg-black hover:bg-gray-600 text-white w-14 md:w-44 text-center rounded-full px-4 py-3 flex items-center justify-center gap-2 group">
            <Bookmark className="w-10 h-10 sm:w-8 sm:h-8 md:w-6 md:h-6 group-hover:text-black" />
            <span className="hidden md:block text-white">Saved</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SideNav;
