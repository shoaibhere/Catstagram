import React from "react";
import { Link } from "react-router-dom";
import { Home, Bookmark, Compass, User, PlusCircle } from 'lucide-react';
import { useTheme } from "../contexts/themeContext";

const SideNav = ({ user }) => {
  const { theme } = useTheme();

  const navItems = [
    { icon: Home, label: "Home", link: "/" },
    { icon: Compass, label: "Explore", link: "/explore-friends" },
    { icon: PlusCircle, label: "Create Post", link: `/create-post?id=${user._id}` },
    { icon: Bookmark, label: "Saved", link: "/saved-posts" },
    { 
      icon: (
        <div className=" w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              className="w-full h-full rounded-full object-cover ring-2 ring-purple-200"
              alt={user.name}
            />
          ) : (
            <User className="w-6 h-6 text-purple-600" />
          )}
        </div>
      ), 
      label: user.name, 
      link: `/profile/${user._id}` 
    }
    
  ];
  

  return (
    <div
      className={`flex sm:flex-col items-center sm:h-screen sm:pt-8 sm:overflow-hidden
                  fixed bottom-0 left-0 right-0 sm:relative
                  ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}
                  sm:w-full w-full sm:h-auto h-16 flex-row justify-around sm:justify-start`}
    >
      {/* Profile Section - Hidden on mobile */}
      <Link to={`/profile/${user._id}`} className="hidden sm:flex sm:flex-col sm:items-center sm:mb-8">
        <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-2">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              className="w-full h-full rounded-full object-cover ring-2 ring-purple-200"
              alt={user.name}
            />
          ) : (
            <User className="w-10 h-10 text-purple-600" />
          )}
        </div>
        <h3
          className={`text-lg font-semibold hidden sm:block
                      ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          {user.name}
        </h3>
      </Link>

      {/* Navigation Items */}
      <div className="flex flex-row w-full sm:w-3/4 justify-between sm:justify-center sm:items-center sm:p-0 p-4 sm:flex sm:flex-col">
      {navItems.map((item, index) => (
  <Link key={index} to={item.link} className="sm:w-full">
    <button
      className={`group flex items-center justify-center sm:w-44 sm:h-14 w-12 h-12 rounded-full sm:px-3 sm:py-2 sm:mb-4
        ${item.icon !== PlusCircle &&
          `${theme === "dark"
            ? "text-white bg-black hover:bg-gray-600"
            : "text-black bg-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
          }`}
        ${item.icon === PlusCircle && "bg-purple-600 hover:bg-purple-400 text-white"}
      ${React.isValidElement(item.icon) && "sm:hidden"}`}
    >
      {/* Render the icon */}
      {React.isValidElement(item.icon) ? (
        item.icon
      ) : (
        <item.icon className={`w-6 h-6 ${theme === "dark" ? "text-white" : `${item.icon !== PlusCircle && "text-black"}`}`} />
      )}
      <span className="hidden sm:block ml-2">{item.label}</span>
    </button>
  </Link>
))}


      </div>
    </div>
  );
};

export default SideNav;
