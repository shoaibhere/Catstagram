import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import SideNav from "../components/sideNav";
import Navbar from "../components/Navbar";
import Factsbar from "../components/factsbar";
import { useAuthStore } from "../store/authStore";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState("friends");
  const { user } = useAuthStore();

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:8000"
      : "/api/friends";

  useEffect(() => {
    if (activeTab === "friends") {
      fetchFriends();
    }
  }, [activeTab]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/friends/list`);
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col text-white">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="flex pt-16 relative">
        {/* Left Sidebar */}
        <div className="fixed left-0 top-16 bottom-0 w-[20%] bg-black p-4 z-40">
          <SideNav user={user} />
        </div>

        {/* Main Content */}
        <div className="w-[60%] ml-[20%] min-h-[calc(100vh-4rem)]">
          {/* Tab Buttons */}
          <div className="sticky top-16 z-30 mt-2 py-4">
            <div className="flex justify-center space-x-4">
              <button
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === "friends"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setActiveTab("friends")}
              >
                My Friends
              </button>
              <button
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === "requests"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setActiveTab("requests")}
              >
                Friend Requests
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeTab === "friends" ? (
                friends.map((friend) => (
                  <UserCard key={friend._id} user={friend} isFriend={true} />
                ))
              ) : (
                <div>Click on the "Friend Requests" tab to manage requests</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="fixed right-0 top-16 bottom-0 w-[20%] bg-gray-800 p-4 z-40">
          <Factsbar />
        </div>
      </div>
    </div>
  );
};

export default Friends;
