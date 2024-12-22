import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Ban } from 'lucide-react';
import { useTheme } from "../contexts/themeContext";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:8000/api" : "/api";

const UserCard = ({ user, isFriend, onFriendUpdate }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/friends/requests-get-one/${user._id}`);
        const { friendRequestStatus, requestId } = response.data;
        setRequestSent(friendRequestStatus === 'pending');
        setRequestId(requestId);
        // You might want to add logic here to set isBlocked based on the API response
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    fetchUserStatus();
  }, [user._id]);

  const handleBlockUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/user/block-user`, { userIdToBlock: user._id });
      if (response.data.success) {
        setIsBlocked(true);
        alert(`User ${user.name} has been blocked.`);
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to block the user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/user/unblock-user`, { userIdToUnblock: user._id });
      if (response.data.success) {
        setIsBlocked(false);
        alert(`User ${user.name} has been unblocked.`);
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Failed to unblock the user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFriendRequest = async () => {
    if (isLoading || requestSent) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/friends/request/${user._id}`);
      const { requestId } = response.data;
      setRequestSent(true);
      setRequestId(requestId);
      onFriendUpdate();
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsendRequest = async () => {
    if (isLoading || !requestSent || !requestId) return;
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/friends/request/${requestId}`);
      setRequestSent(false);
      setRequestId(null);
      onFriendUpdate();
    } catch (error) {
      console.error("Error unsending friend request:", error);
      alert("Failed to unsend friend request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/friends/remove/${user._id}`);
      onFriendUpdate();
    } catch (error) {
      console.error("Error removing friend:", error);
      alert("Failed to remove friend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = isBlocked
    ? "Blocked"
    : isFriend
    ? "Remove Friend"
    : requestSent
    ? "Cancel Request"
    : "Send Friend Request";

  const buttonGradient = isBlocked
    ? "bg-red-500 text-white cursor-not-allowed"
    : isFriend
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
      className={`relative w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black border-purple-600"
          : "bg-white border-gray-300"
      }`}
    >
      <button
        onClick={isBlocked ? handleUnblockUser : handleBlockUser}
        title={isBlocked ? "Unblock User" : "Block User"}
        className={`absolute top-2 right-2 p-2 rounded-full transition-colors duration-200 ${
          isBlocked
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-transparent text-red-600 hover:text-red-800"
        }`}
        disabled={isLoading}
      >
        <Ban className="w-5 h-5" />
      </button>

      <div className="flex flex-col md:flex-row items-center gap-4">
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

        <div className="flex-grow text-center md:text-left">
          <h3
            className={`text-xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            <Link to={`/profile/${user._id}`}>{user.name}</Link>
          </h3>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } mb-2`}
          >
            {user.email}
          </p>

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
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                isBlocked || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : `bg-gradient-to-r ${buttonGradient}`
              }`}
              disabled={isBlocked || isLoading}
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

