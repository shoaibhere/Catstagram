import React from "react";

const SideNav = ({ user, setActiveTab }) => {
  return (
    <div className="flex flex-col items-start">
      {/* Add Profile Info */}
      <div className="mb-6">
        <img
          src={user.profilePicture || "/default-profile.jpg"}
          alt="Profile"
          className="rounded-full w-24 h-24"
        />
        <h3 className="mt-2 text-white">{user.username}</h3>
      </div>

      {/* Tab Buttons */}
      <button
        className="px-6 py-2 rounded-md mb-4 bg-purple-600 text-white hover:bg-purple-700"
        onClick={() => setActiveTab("friends")}
      >
        My Friends
      </button>
      <button
        className="px-6 py-2 rounded-md mb-4 bg-purple-600 text-white hover:bg-purple-700"
        onClick={() => setActiveTab("potential")}
      >
        Find Friends
      </button>

      {/* Friend Requests Button */}
      <button
        className="px-6 py-2 rounded-md mb-4 bg-purple-600 text-white hover:bg-purple-700"
        onClick={() => setActiveTab("requests")}
      >
        Friend Requests
      </button>
    </div>
  );
};

export default SideNav;
