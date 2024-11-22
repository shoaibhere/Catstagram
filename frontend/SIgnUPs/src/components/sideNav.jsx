// SideNav.js
import React from "react";
import { Link } from "react-router-dom";

const SideNav = ({ name }) => {
  return (
    <div className="bg-black text-white w-64 pl-1 py-4 space-y-6 h-screen">
      {/* Profile section */}
      <Link to={`/profile`}>
        <div className="flex flex-col items-center mb-6 gap-2">
          <img
            src="https://via.placeholder.com/50"
            alt="Profile"
            className="w-16 h-16 rounded-full mb-2"
          />
          <h3 className="text-lg font-semibold">{name}</h3>{" "}
          {/* Display the name here */}
        </div>
      </Link>

      {/* Buttons */}
      <Link to={`/friends`}>
        <button className="bg-black hover:bg-gray-600 text-white w-full text-center rounded-l-full px-4 py-3 mb-2">
          Friends
        </button>
      </Link>
      <Link to={`/saved`}>
        <button className="bg-black hover:bg-gray-600 text-white w-full text-center rounded-l-full px-4 py-3 mb-2">
          Saved
        </button>
      </Link>
      <Link to={`/find-friends`}>
        <button className="bg-black hover:bg-gray-600 text-white w-full text-center rounded-l-full px-4 py-3 mb-2">
          Find People
        </button>
      </Link>
    </div>
  );
};

export default SideNav;
