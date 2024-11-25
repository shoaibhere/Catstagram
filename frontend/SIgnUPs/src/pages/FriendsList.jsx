import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import Navbar from "../components/navbar";
import SideNav from "../components/sideNav";
import Factsbar from "../components/factsbar";
import { useAuthStore } from "../store/authStore";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const { user } = useAuthStore();

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:8000"
      : "/api/friends";

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/friends/list`);
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col text-white bg-gradient-to-b from-gray-900 via-black to-gray-900">
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
        <div className="w-[60%] ml-[20%] min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
          <div className="p-4">
            {/* Stylish Friends Heading */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg mb-10 text-center transition-all hover:scale-105 duration-300">
              Your Friends
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {friends.map((friend) => (
                <UserCard
                  key={friend._id}
                  user={friend}
                  isFriend={true}
                  onFriendUpdate={fetchFriends}
                />
              ))}
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

export default FriendsList;
