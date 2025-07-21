import Layout from "./Layout";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { User, Users, Check, X, Plus, AlertCircle,Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/themeContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

const CreateGroupChat = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const API_URL = "https://catstagram-production.up.railway.app/api";

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (groupName.trim() && validationError) {
      setValidationError("");
    }
  }, [groupName, validationError]);

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      const response = await axios.get(`${API_URL}/friends/list/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let friendsList = [];
      if (Array.isArray(response.data)) {
        friendsList = response.data;
      } else if (response.data?.friends) {
        friendsList = response.data.friends;
      } else if (response.data?.data) {
        friendsList = response.data.data;
      }

      setFriends(friendsList.filter((friend) => friend._id !== user._id));
    } catch (error) {
      console.error("Error fetching friends:", error);
      alert("Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  const toggleFriendSelection = (friend) => {
    setSelectedFriends((prev) => {
      const isSelected = prev.find((f) => f._id === friend._id);
      if (isSelected) {
        return prev.filter((f) => f._id !== friend._id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const validateForm = () => {
    if (!groupName.trim()) {
      setValidationError("Please enter a group name first");
      return false;
    }

    if (selectedFriends.length < 2) {
      setValidationError("Please select at least 2 friends to create a group");
      return false;
    }

    setValidationError("");
    return true;
  };

  const createGroup = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setCreating(true);
      const token = localStorage.getItem("token");

      const userIds = selectedFriends.map((friend) => friend._id);

      const response = await axios.post(
        `${API_URL}/chat/group`,
        {
          name: groupName.trim(),
          users: JSON.stringify(userIds),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const createdGroup = response.data;

      alert("Group created successfully!");
      navigate(`/chat/${createdGroup._id}`, { state: { chatData: createdGroup } });

    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const renderFriendItem = (friend) => {
    const isSelected = selectedFriends.find((f) => f._id === friend._id);

    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        key={friend._id}
        className={`p-4 mb-2 rounded-lg shadow-xl cursor-pointer ${
          isSelected
            ? "border-emerald-950 bg-emerald-50 dark:bg-emerald-900/20"
            : {containerClass}
        }`}
        onClick={() => toggleFriendSelection(friend)}
      >
        <div className="flex items-center">
          {friend.profileImage ? (
            <img
              src={friend.profileImage}
              alt={friend.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
          )}

          <div className="ml-3 flex-1">
            <h3 className={`font-medium ${
              (theme === "dark" && !isSelected) ? "text-gray-200" : "text-gray-800"
            }`}>
              {friend.name}
            </h3>
            <p className={`text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {friend.email}
            </p>
          </div>

          <div className="ml-2">
            {isSelected ? (
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div
                className={`w-6 h-6 rounded-full border-2 ${
                  theme === "dark" ? "border-gray-500" : "border-gray-300"
                }`}
              />
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSelectedFriend = (friend) => (
    <motion.div
      key={friend._id}
      className={`flex items-center px-3 py-2 rounded-full ${
       containerClass} mr-2 mb-2`}
    >
      {friend.profileImage ? (
        <img
          src={friend.profileImage}
          alt={friend.name}
          className="w-5 h-5 rounded-full mr-2"
        />
      ) : (
        <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-2">
          <User className="w-3 h-3 text-gray-600 dark:text-gray-300" />
        </div>
      )}
      <span className={`text-sm ${
        theme === "dark" ? "text-gray-200" : "text-gray-800"
      }`}>
        {friend.name}
      </span>
      <button
        onClick={() => toggleFriendSelection(friend)}
        className="ml-2 text-red-500"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
  const containerClass = theme === "dark"
    ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white"
    : "bg-gradient-to-br from-gray-100 via-gray-200 to-white text-gray-800";

    if (loading) {
    return (
      <Layout>        
      <div className="w-full">
        <LoadingSpinner/>
      </div>
      </Layout>
    );
  }
  const isFormValid = groupName.trim() && selectedFriends.length >= 2;

  return (
      <Layout>
    <div className={`w-full flex flex-col h-screen`}>
      {/* Header */}
      <div className={`p-4 shadow-xl rounded-lg`}>
        <div className="flex items-center justify-between">
          <div></div>
          <h1 className={`text-xl font-bold ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}>
            Create Group
          </h1>
          <button
            onClick={createGroup}
            disabled={!isFormValid || creating}
            className={`px-4 py-2 rounded-full ${
              isFormValid
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : theme === "dark"
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {creating ? (
              <Loader className="animate-spin text-white" />
            ) : (
              "Create"
            )}
          </button>
        </div>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div
          className={`mx-4 mt-4 p-3 rounded-lg flex items-center ${
            theme === "dark" ? "bg-red-900/30 border-red-700" : "bg-red-50 border-red-200"
          } border`}
        >
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-sm text-red-600 dark:text-red-400">
            {validationError}
          </span>
        </div>
      )}

      {/* Group Name Input */}
      <div className={`p-4`}>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border-2 border-purple-500 mr-3">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            className={`flex-1 text-lg font-medium focus:outline-none bg-inherit border rounded-lg p-4 ${
              theme === "dark" ? " text-white" : " text-gray-800"
            } ${
              validationError && !groupName.trim()
                ? "border-b border-red-500"
                : ""
            }`}
            maxLength={50}
          />
        </div>
      </div>

      {/* Selected Friends */}
      {selectedFriends.length > 0 && (
        <div className={`p-4 border rounded-lg `}>
          <h2 className={`text-sm font-semibold mb-3 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}>
            Selected ({selectedFriends.length})
          </h2>
          <div className="flex flex-wrap">
            {selectedFriends.map(renderSelectedFriend)}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className={`text-lg font-bold mb-4 ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}>
          Choose friends ({friends.length})
        </h2>
        {friends.length > 0 ? (
          friends.map(renderFriendItem)
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Users className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className={`text-lg font-bold mb-2 ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}>
              No friends found
            </h2>
            <p className={`text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              Add some friends to create a group chat
            </p>
          </div>
        )}
      </div>
    </div>
      </Layout>
  );
};

export default CreateGroupChat;