import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const UserCard = ({ user, isFriend, onFriendUpdate }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:8000"
      : "/api/friends";

  const handleFriendAction = async () => {
    try {
      setIsLoading(true);
      if (isFriend) {
        await axios.delete(`${API_URL}/api/friends/remove/${user._id}`);
      } else {
        await axios.post(`${API_URL}/api/friends/add/${user._id}`);
      }
      onFriendUpdate();
    } catch (error) {
      console.error("Error updating friend status:", error);
      alert("Failed to update friend status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-purple-900 to-black rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-purple-600 p-6 transform hover:scale-105 transition-transform duration-300">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Avatar */}
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 ring-purple-400 shadow-md"
          />
        ) : (
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-purple-300 flex items-center justify-center ring-4 ring-purple-400 shadow-md">
            <User className="w-8 h-8 md:w-10 md:h-10 text-purple-800" />
          </div>
        )}

        {/* User Details */}
        <div className="flex-grow text-center md:text-left">
          <h3 className="text-xl font-bold text-white">{user.name}</h3>
          <p className="text-sm text-gray-400 mb-2">{user.email}</p>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-2 mt-4">
            {/* View Profile Button with Blue Gradient */}
            <button
              onClick={() => navigate(`/profile/${user._id}`)}
              className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-semibold rounded-full hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
              disabled={isLoading}
            >
              View Profile
            </button>

            {/* Add/Remove Friend Button with Distinct Gradient */}
            <button
              onClick={handleFriendAction}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                isFriend
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "..." : isFriend ? "Remove Friend" : "Add Friend"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
