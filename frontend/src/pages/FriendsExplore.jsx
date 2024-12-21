import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import { useAuthStore } from "../store/authStore";
import Layout from "./Layout";
import { useTheme } from '../contexts/themeContext';  // Use theme context for theming support

const FriendsExplore = () => {
  const [potentialFriends, setPotentialFriends] = useState([]);
  const { user } = useAuthStore();
  const { theme } = useTheme();  // Using theme from theme context

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:8000"
      : "/api/friends";

  useEffect(() => {
    fetchPotentialFriends();
  }, []);

  const fetchPotentialFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/friends/potential`);
      setPotentialFriends(response.data);
    } catch (error) {
      console.error("Error fetching potential friends:", error);
    }
  };

  // Dynamic theming for main content and headers
  const headerGradient = theme === "dark" 
    ? "from-green-400 via-teal-500 to-blue-500"
    : "from-pink-500 via-red-500 to-yellow-500";


  return (
    <Layout>
      <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]`}>
        <h2 className={`overflow-hidden text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${headerGradient} drop-shadow-lg mb-10 text-center transition-all hover:scale-105 duration-300`}>
          Explore Friends
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {potentialFriends.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              isFriend={false}
              onFriendUpdate={fetchPotentialFriends}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FriendsExplore;
