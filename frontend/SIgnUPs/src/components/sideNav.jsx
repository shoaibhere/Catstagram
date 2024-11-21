import React from "react";

const SideNav = () => {
  return (
      <div className="bg-black h-screen text-white w-64 pl-1 py-4 space-y-6 h-full">

      {/* Profile section */}
      <div className="flex flex-col items-center mb-6">
        <a href="#" className="mb-2">
          <img
            src="https://via.placeholder.com/50"
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
        </a>
        <h3 className="text-lg font-semibold">Daniel Wajid</h3>
      </div>

      {/* Buttons */}
      <button className="bg-black hover:bg-gray-600 text-white w-full text-center rounded-l-full px-4 py-3 mb-2">
        Friends
      </button>
      <button className="bg-black hover:bg-gray-600 text-white w-full text-center rounded-l-full px-4 py-3 mb-2">
        Saved
      </button>
      <button className="bg-black hover:bg-gray-600 text-white w-full text-center rounded-l-full px-4 py-3 mb-2">
        Find People
      </button>
    </div>
  );
};

export default SideNav;
