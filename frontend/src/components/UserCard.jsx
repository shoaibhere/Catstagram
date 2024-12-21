import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User } from "lucide-react";
import { useTheme } from "../contexts/themeContext";

const UserCard = ({ user, isFriend, onFriendUpdate }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false); // Track if a friend request has been sent
  const { theme } = useTheme(); // Access theme context

  const API_URL =
    import.meta.env.MODE === "development"
      ? "https://catstagram-backend.onrender.com/api/friends"
      : "/api/friends";

  useEffect(() => {
    // Retrieve the saved request status from localStorage during component mount
    const requestId = localStorage.getItem(`requestSent-${user._id}`);
    if (requestId) {
      setRequestSent(true);
    }
  }, [user._id]);

  const handleFriendRequest = async () => {
    try {
      setIsLoading(true);
      if (requestSent) return; // Prevent duplicate requests

      const response = await axios.post(`${API_URL}/request/${user._id}`);
      const { requestId } = response.data;

      setRequestSent(true);
      localStorage.setItem(`requestSent-${user._id}`, requestId); // Save the request ID to localStorage
      onFriendUpdate();
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/remove/${user._id}`);
      onFriendUpdate();
    } catch (error) {
      console.error("Error removing friend:", error);
      alert("Failed to remove friend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsendRequest = async () => {
    try {
      setIsLoading(true);
      const requestId = localStorage.getItem(`requestSent-${user._id}`);
      if (!requestId) return;

      await axios.delete(`${API_URL}/request/${requestId}`);
      setRequestSent(false);
      localStorage.removeItem(`requestSent-${user._id}`); // Remove the request ID from localStorage
      onFriendUpdate();
    } catch (error) {
      console.error("Error unsending friend request:", error);
      alert("Failed to unsend friend request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = isFriend
    ? "Remove Friend"
    : requestSent
    ? "Cancel Request"
    : "Send Friend Request";

  const buttonGradient = isFriend
    ? theme === "dark"
      ? "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
      : "from-red-400 to-red-500 hover:from-red-500 hover:to-red-600"
    : requestSent
    ? theme === "dark"
      ? "from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
      : "from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600"
    : theme === "dark"
    ? "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
    : "from-green-400 to-green-500 hover:from-green-500 hover:to-green-600";

  return (
    <div
      className={`w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black border-purple-600"
          : "bg-white border-gray-300"
      }`}
    >
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Avatar */}
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 shadow-md ${
              theme === "dark" ? "ring-purple-400" : "ring-gray-300"
            }`}
          />
        ) : (
          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ring-4 shadow-md ${
              theme === "dark"
                ? "bg-purple-300 text-purple-800 ring-purple-400"
                : "bg-gray-100 text-gray-600 ring-gray-300"
            }`}
          >
            <User className="w-8 h-8 md:w-10 md:h-10" />
          </div>
        )}

        {/* User Details */}
        <div className="flex-grow text-center md:text-left">
          <h3
            className={`text-xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            <Link to={`/profile/${user._id}`}>
            {user.name}
            </Link>
          </h3>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } mb-2`}
          >
            {user.email}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-2 mt-4">
            <button
              onClick={() => navigate(`/profile/${user._id}`)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
                  : "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700"
              }`}
              disabled={isLoading}
            >
              View Profile
            </button>

            <button
              onClick={
                isFriend
                  ? handleRemoveFriend
                  : requestSent
                  ? handleUnsendRequest
                  : handleFriendRequest
              }
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 bg-gradient-to-r ${buttonGradient}`}
              disabled={isLoading}
            >
              {isLoading ? "..." : buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
