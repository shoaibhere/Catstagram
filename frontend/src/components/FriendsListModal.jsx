import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../contexts/themeContext";
import { User } from "lucide-react";

const FriendsListModal = ({ isOpen, onClose, userId }) => {
  const [mutualFriends, setMutualFriends] = useState([]);
  const [otherFriends, setOtherFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { theme } = useTheme();

  const API_URL =
    import.meta.env.MODE === "development" ? "http://localhost:8000/" : "/";

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen, userId]);

  const fetchFriends = async () => {
    try {
      setLoading(true);

      // Fetch profile's friends
      const profileFriendsResponse = await axios.get(
        `${API_URL}api/friends/list/${userId}`
      );

      const profileFriends = Array.isArray(profileFriendsResponse.data)
        ? profileFriendsResponse.data
        : profileFriendsResponse.data.friends || [];

      // Only fetch mutual friends if viewing someone else's profile
      if (userId !== user._id) {
        const myFriendsResponse = await axios.get(
          `${API_URL}api/friends/list/${user._id}`
        );

        const myFriends = Array.isArray(myFriendsResponse.data)
          ? myFriendsResponse.data
          : myFriendsResponse.data?.friends || [];

        // Calculate mutual friends
        const mutual = profileFriends.filter((profileFriend) =>
          myFriends.some((myFriend) => myFriend._id === profileFriend._id)
        );

        // Calculate other friends
        const others = profileFriends.filter(
          (profileFriend) =>
            !myFriends.some((myFriend) => myFriend._id === profileFriend._id)
        );

        setMutualFriends(mutual);
        setOtherFriends(others);
      } else {
        // If viewing own profile, all friends go to otherFriends
        setMutualFriends([]);
        setOtherFriends(profileFriends);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      setMutualFriends([]);
      setOtherFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const modalClasses =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
  const headerClasses = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const cardClasses = theme === "dark" ? "bg-gray-700" : "bg-gray-100";

  if (!isOpen) return null;

  const renderFriendCard = (friend) => (
    <div
      key={friend._id}
      className={`${cardClasses} rounded-lg p-4 flex items-center space-x-4 transition-transform hover:scale-105 duration-200`}
    >
      {friend.profileImage ? (
        <img
          src={friend.profileImage}
          alt={friend.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-8 h-8 text-gray-500" />
        </div>
      )}
      <div>
        <p className="font-semibold">{friend.name}</p>
        <p className="text-sm text-gray-500">{friend.email}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${modalClasses} w-full max-w-2xl rounded-lg shadow-xl p-6 max-h-[80vh] overflow-hidden`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${headerClasses}`}>
            Friends List
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-100px)]">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              {/* Mutual Friends Section - Only show if not viewing own profile */}
              {userId !== user._id && mutualFriends.length > 0 && (
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-4 ${headerClasses}`}>
                    Mutual Friends ({mutualFriends.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mutualFriends.map(renderFriendCard)}
                  </div>
                </div>
              )}

              {/* Other Friends Section */}
              {otherFriends.length > 0 && (
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${headerClasses}`}>
                    {userId === user._id ? "All Friends" : "Other Friends"} (
                    {otherFriends.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {otherFriends.map(renderFriendCard)}
                  </div>
                </div>
              )}

              {mutualFriends.length === 0 && otherFriends.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No friends to display
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsListModal;
