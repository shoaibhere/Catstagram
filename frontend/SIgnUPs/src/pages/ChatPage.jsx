import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore"; // Adjust as per your actual auth store
import { Link } from "react-router-dom"; // Import Link for routing
import ChatCard from "../components/ChatCard"; // Import the ChatCard component
import SideNav from "../components/sideNav"; // Import the SideNav component
import Navbar from "../components/navbar";

const ChatPage = () => {
  const [friends, setFriends] = useState([]);

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
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Navbar Component */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <Navbar />
      </div>

      <div className="flex h-full pt-16">
        {/* Main content area */}
        <div className="fixed left-0 top-20 bg-gradient-to-b from-purple-800 to-purple-900 p-6 overflow-y-auto z-20 h-full">
          {/* Main background gradient */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Friend List Section */}
            <div className="space-y-2 flex-1 overflow-y-auto">
              <h2 className="text-2xl mb-4 font-bold border-b-2 border-white pb-2">
                Messages
              </h2>
              {friends.map((friend) => {
                // Assuming friend object contains `lastMessage` and `hasUnreadMessages`
                const lastMessage = friend.lastMessage || "No messages yet"; // Fake or placeholder message
                const hasUnreadMessages = friend.hasUnreadMessages || false; // Default to false if not available

                return (
                  <Link
                    to={`/chat/${friend._id}`}
                    key={friend._id}
                    className="block rounded-lg overflow-hidden shadow-lg bg-gradient-to-r from-purple-800 to-purple-900 mb-4"
                  >
                    <ChatCard
                      friend={friend}
                      lastMessage={lastMessage}
                      hasUnreadMessages={hasUnreadMessages}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
