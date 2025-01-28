import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import Layout from "./Layout";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../contexts/themeContext";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthStore();
  const { theme } = useTheme();

  const API_URL ="https://catstagram-production.up.railway.app"

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/friends/list/${user._id}`
      );
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm)
  );

  // Theme-based styling
  const headerGradient =
    theme === "dark"
      ? "from-purple-400 via-pink-500 to-red-500"
      : "from-blue-500 via-green-400 to-yellow-500";

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="p-4 max-w-4xl w-full">
          {/* Dynamic Stylish Friends Heading */}
          <h2
            className={`text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${headerGradient} drop-shadow-lg mb-10 text-center transition-all hover:scale-105 duration-300`}
          >
            Your Friends
          </h2>

          {/* Search Bar */}
          <div className="mb-6 flex justify-center">
            <input
              type="text"
              placeholder="Search friends by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`w-full md:w-1/2 p-3 rounded-md border ${
                theme === "dark"
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              } focus:ring-2 focus:ring-purple-500 focus:outline-none`}
            />
          </div>

          {/* Friends Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <UserCard
                  key={friend._id}
                  user={friend}
                  isPrivate={friend.isPrivate}
                  isFriend={true}
                  onFriendUpdate={fetchFriends}
                />
              ))
            ) : (
              <div className="flex justify-center items-center w-full col-span-2">
                <p className="text-gray-500 text-lg">
                  No friends match your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FriendsList;
