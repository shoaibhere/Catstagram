import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import Layout from "./Layout";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../contexts/themeContext";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const { user } = useAuthStore();
  const { theme } = useTheme();

  const API_URL =
    import.meta.env.MODE === "development"
      ? "https://catstagram-backend.onrender.com"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
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
    </Layout>
  );
};

export default FriendsList;
