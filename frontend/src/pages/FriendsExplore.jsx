import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import Layout from "../pages/Layout";
import { useAuthStore } from "../store/authStore";

const FriendsExplore = () => {
  const [potentialFriends, setPotentialFriends] = useState([]);
  const { user } = useAuthStore();

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

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 drop-shadow-lg mb-10 text-center transition-all hover:scale-105 duration-300">
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
