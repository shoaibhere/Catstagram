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
    <div className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-2 border-purple-500 ml-2">
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
              <User className="w-7 h-7 text-purple-600" />
            </div>
          )}

          {/* User Details */}
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{user.email}</p>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/profile/${user._id}`)}
                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-200"
                disabled={isLoading}
              >
                View Profile
              </button>
              <button
                onClick={handleFriendAction}
                className={`px-3 py-1.5 text-sm border rounded transition-colors duration-200 ${
                  isFriend
                    ? "border-red-500 text-red-500 hover:bg-red-50"
                    : "border-green-500 text-green-500 hover:bg-green-50"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "..." : isFriend ? "Remove Friend" : "Add Friend"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
