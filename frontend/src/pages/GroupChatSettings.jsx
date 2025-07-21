import Layout from "./Layout";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { User, Users, Edit3, UserMinus, LogOut,X } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/themeContext";
import LoadingSpinner from "../components/LoadingSpinner";

const GroupChatSettings = () => {
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const location = useLocation();
  
  const chatData = location.state?.chatData;

  const API_URL = "https://catstagram-production.up.railway.app/api";

  useEffect(() => {
    setGroupData(chatData);
    setNewGroupName(chatData?.chatName || "");
    setLoading(false);
  }, [chatData]);

  const isAdmin = groupData?.groupAdmin?._id === user._id;

  const renameGroup = async () => {
    if (!newGroupName.trim() || newGroupName === groupData.chatName) {
      setEditingName(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/chat/rename`,
        {
          chatId: chatId,
          chatName: newGroupName.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGroupData(response.data);
      setEditingName(false);
      alert("Group name updated successfully");
    } catch (error) {
      console.error("Error renaming group:", error);
      alert("Failed to update group name");
    }
  };

  const removeUser = async (userId) => {
    if (!confirm("Are you sure you want to remove this member from the group?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/chat/groupremove`,
        {
          chatId: chatId,
          userId: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGroupData(response.data);
      alert("Member removed successfully");
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove member");
    }
  };

  const leaveGroup = () => {
    if (!confirm("Are you sure you want to leave this group?")) {
      return;
    }

    const performLeave = async () => {
      try {
        const token = localStorage.getItem("token");

        await axios.put(
          `${API_URL}/chat/groupremove`,
          {
            chatId: chatId,
            userId: user._id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        navigate("/chats");
        alert("You have left the group");
      } catch (error) {
        console.error("Error leaving group:", error);
        alert("Failed to leave group");
      }
    };

    performLeave();
  };

  const renderMember = (member) => (
    <div
      key={member._id}
      className={`p-4 mb-2 rounded-lg shadow-2xl ${containerClass}`}
    >
      <div className="flex items-center">
        {member.profileImage ? (
          <img
            src={member.profileImage}
            alt={member.name}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
        )}

        <div className="ml-3 flex-1">
          <div className="flex items-center">
            <h3 className={`font-medium ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}>
              {member.name}
              {member._id === groupData?.groupAdmin?._id && (
                <span className="ml-1 text-xs text-purple-500">(Admin)</span>
              )}
              {member._id === user._id && (
                <span className="ml-1 text-xs text-emerald-500">(You)</span>
              )}
            </h3>
          </div>
          <p className={`text-xs ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            {member.email}
          </p>
        </div>

        {isAdmin && member._id !== user._id && (
          <button
            onClick={() => removeUser(member._id)}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
          >
            <UserMinus className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
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

  return (
      <Layout>
    <div className={`w-full flex flex-col h-screen`}>
      {/* Header */}
      <div className={`p-4`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() =>navigate(`/chat/${chatId}`, { state: { chatData } })}
            
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className={theme === "dark" ? "text-gray-300" : "text-gray-600"} />
          </button>
          <h1 className={`text-xl font-bold ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}>
            Group Settings
          </h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Group Info */}
      <div className={`p-4  rounded-xl shadow-2xl`}>
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border-2 border-purple-500 mr-4">
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>

          <div className="flex-1">
            {editingName ? (
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onBlur={renameGroup}
                onKeyPress={(e) => e.key === "Enter" && renameGroup()}
                className={`text-xl font-bold w-full focus:outline-none ${
                  theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                } border-b ${
                  theme === "dark" ? "border-purple-500" : "border-purple-400"
                }`}
                autoFocus
                maxLength={50}
              />
            ) : (
              <div
                className="flex items-center"
                onClick={() => isAdmin && setEditingName(true)}
              >
                <h2 className={`text-xl font-bold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}>
                  {groupData?.chatName}
                </h2>
                {isAdmin && (
                  <Edit3
                    className={`w-4 h-4 ml-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                )}
              </div>
            )}
            <p className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {groupData?.users?.length} members
            </p>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className={`text-lg font-bold mb-4 ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}>
          Members
        </h2>
        {groupData?.users?.length > 0 ? (
          groupData.users.map(renderMember)
        ) : (
          <p className={`text-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            No members found
          </p>
        )}
      </div>

      {/* Leave Group Button */}
      <div className={`p-4`}>
        <button
          onClick={leaveGroup}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center border ${
            theme === "dark"
              ? "border-red-700 bg-red-900/20 hover:bg-red-900/30"
              : "border-red-300 bg-red-50 hover:bg-red-100"
          }`}
        >
          <LogOut className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-600 dark:text-red-400 font-medium">
            Leave Group
          </span>
        </button>
      </div>
    </div>
      </Layout>

  );
};

export default GroupChatSettings;