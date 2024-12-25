import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import { useAuthStore } from "../store/authStore";
import Layout from "./Layout";
import { useTheme } from "../contexts/themeContext";

const FriendsExplore = () => {
  const [potentialFriends, setPotentialFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useTheme();

  const API_URL =
    import.meta.env.MODE === "development"
      ? `${process.env.API_URL}`
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredFriends = potentialFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headerGradient =
    theme === "dark"
      ? "from-green-400 via-teal-500 to-blue-500"
      : "from-pink-500 via-red-500 to-yellow-500";

  const inputClass =
    theme === "dark"
      ? "text-white bg-gray-700 border-gray-600 placeholder-gray-400"
      : "text-gray-700 bg-white border-gray-300 placeholder-gray-500";

  return (
    <Layout>
      <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-10`}>
        <h2
          className={`overflow-hidden text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${headerGradient} drop-shadow-lg mb-10 text-center transition-all hover:scale-105 duration-300`}
        >
          Explore Friends
        </h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={`mb-8 p-3 w-full md:w-1/2 rounded-md ${inputClass}`}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                isFriend={false}
                onFriendUpdate={fetchPotentialFriends}
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
    </Layout>
  );
};

export default FriendsExplore;
