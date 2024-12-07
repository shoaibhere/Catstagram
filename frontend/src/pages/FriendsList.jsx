import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import Layout from "../pages/Layout";
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
    <Layout>
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
    </Layout>
  );
};

export default FriendsList;
