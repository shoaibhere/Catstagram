import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const UserCard = ({ user, isFriend, onFriendUpdate, request }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false); // Track if a friend request has been sent

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:8000/api/friends"
      : "/api/friends";

  // Check localStorage for previous request sent status
  useEffect(() => {
    const storedRequestStatus = localStorage.getItem(`requestSent-${user._id}`);
    if (storedRequestStatus === "true") {
      setRequestSent(true); // If a request was already sent, update the state
    }
  }, [user._id]);

  const handleFriendRequest = async () => {
    try {
      setIsLoading(true);
      if (requestSent) {
        return; // Prevent sending the request if it's already sent
      }

      // Send the friend request and get the request ID in the response
      const response = await axios.post(`${API_URL}/request/${user._id}`);
      const { requestId } = response.data;

      // Set state to reflect that the request has been sent
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

      // Remove friend (replace with your actual endpoint)
      await axios.delete(`${API_URL}/remove/${user._id}`);

      // Trigger parent update to reflect the changes
      onFriendUpdate();
    } catch (error) {
      console.error("Error removing friend:", error);
      alert("Failed to remove friend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Unsend the friend request using request._id
  const handleUnsendRequest = async () => {
    try {
      setIsLoading(true);

      // Get the requestId from localStorage
      const requestId = localStorage.getItem(`requestSent-${user._id}`);

      if (!requestId) {
        console.error("Request ID is missing in localStorage.");
        return;
      }

      // Make the API call to unsend the friend request using requestId
      await axios.delete(`${API_URL}/request/${requestId}`);

      // Update the state and localStorage to reflect that the request is unsent
      setRequestSent(false);
      localStorage.removeItem(`requestSent-${user._id}`); // Remove requestId from localStorage
      onFriendUpdate();
    } catch (error) {
      console.error("Error unsending friend request:", error);
      alert("Failed to unsend friend request. Please try again.");
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

              {isFriend ? (
                <button
                  onClick={handleRemoveFriend}
                  className="px-3 py-1.5 text-sm border border-red-500 text-red-500 rounded transition-colors duration-200 hover:bg-red-50"
                  disabled={isLoading}
                >
                  {isLoading ? "..." : "Remove Friend"}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleFriendRequest}
                    className={`px-3 py-1.5 text-sm border rounded transition-colors duration-200 ${
                      requestSent
                        ? "border-gray-500 text-gray-500 hover:bg-gray-50 cursor-not-allowed"
                        : "border-green-500 text-green-500 hover:bg-green-50"
                    }`}
                    disabled={isLoading || requestSent} // Disable button if request is sent
                  >
                    {isLoading
                      ? "..."
                      : requestSent
                      ? "Request Sent"
                      : "Send Friend Request"}
                  </button>

                  {requestSent && (
                    <button
                      onClick={handleUnsendRequest}
                      className="px-3 py-1.5 text-sm border border-red-500 text-red-500 rounded transition-colors duration-200 hover:bg-red-50"
                      disabled={isLoading}
                    >
                      {isLoading ? "..." : "Unsend Request"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
