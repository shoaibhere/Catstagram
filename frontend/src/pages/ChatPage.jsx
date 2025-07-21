import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Layout from "./Layout";
import { useAuthStore } from "../store/authStore";
import { User, MessageCircle, Users, Plus, Loader, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SocketService from "../services/socket";
import { useTheme } from "../contexts/themeContext";
import LoadingSpinner from "../components/LoadingSpinner";

const UnreadBadge = ({ count }) => {
  if (!count || count === 0) return null;
  const displayCount = count > 99 ? "99+" : count.toString();

  return (
    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {displayCount}
    </div>
  );
};

const TypingIndicator = ({ typingUsers, isGroupChat }) => {
  const { theme } = useTheme();

  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return isGroupChat ? `${typingUsers[0].name} is typing` : "typing";
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].name} and ${typingUsers[1].name} are typing`;
    } else {
      return `${typingUsers[0].name} and ${
        typingUsers.length - 1
      } others are typing`;
    }
  };

  return (
    <div className="flex items-center">
      <span className={`text-xs ${
        theme === "dark" ? "text-emerald-400" : "text-emerald-600"
      }`}>
        {getTypingText()}
      </span>
      <div className="flex ml-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-1 h-1 mx-0.5 rounded-full ${
              theme === "dark" ? "bg-emerald-400" : "bg-emerald-600"
            }`}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [allFriends, setAllFriends] = useState([]);
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [typingStatus, setTypingStatus] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const API_URL = "https://catstagram-production.up.railway.app/api";

  useEffect(() => {
    if (user?._id && user?.name) {
      SocketService.connect(user._id, user.name);

      const connectionInterval = setInterval(() => {
        const connected = SocketService.getConnectionStatus();
        if (!connected) {
          SocketService.connect(user._id, user.name);
        }
      }, 3000);

      setupSocketListeners();

      return () => {
        clearInterval(connectionInterval);
        try {
          if (SocketService && typeof SocketService.offTyping === "function") {
            SocketService.offTyping();
          }
          if (SocketService && typeof SocketService.offMessageReceived === "function") {
            SocketService.offMessageReceived();
          }
          if (SocketService && typeof SocketService.disconnect === "function") {
            SocketService.disconnect();
          }
        } catch (error) {
          console.log("Error during socket cleanup:", error);
        }
        setTypingStatus({});
      };
    }
  }, [user]);

  const setupSocketListeners = () => {
    try {
      if (SocketService && typeof SocketService.onTyping === "function") {
        SocketService.onTyping((data) => {
          const { chatId, user: typingUser } = data;

          if (typingUser._id !== user._id) {
            setTypingStatus((prev) => {
              const currentTypers = prev[chatId] || [];
              const isAlreadyTyping = currentTypers.some(
                (u) => u._id === typingUser._id
              );

              if (!isAlreadyTyping) {
                return {
                  ...prev,
                  [chatId]: [...currentTypers, typingUser],
                };
              }
              return prev;
            });
          }
        });
      }

      if (SocketService && typeof SocketService.onStopTyping === "function") {
        SocketService.onStopTyping((data) => {
          const { chatId, user: typingUser } = data;

          setTypingStatus((prev) => {
            const currentTypers = prev[chatId] || [];
            const filteredTypers = currentTypers.filter(
              (u) => u._id !== typingUser._id
            );

            if (filteredTypers.length === 0) {
              const newStatus = { ...prev };
              delete newStatus[chatId];
              return newStatus;
            } else {
              return {
                ...prev,
                [chatId]: filteredTypers,
              };
            }
          });
        });
      }

      if (SocketService && typeof SocketService.onMessageReceived === "function") {
        SocketService.onMessageReceived((newMessage) => {
          if (newMessage.sender._id !== user._id) {
            setUnreadCounts((prev) => ({
              ...prev,
              [newMessage.chat._id]: (prev[newMessage.chat._id] || 0) + 1,
            }));
          }

          setChats((prevChats) => {
            const updatedChats = prevChats.map((chat) => {
              if (chat._id === newMessage.chat._id) {
                return {
                  ...chat,
                  latestMessage: newMessage,
                  updatedAt: newMessage.createdAt,
                };
              }
              return chat;
            });

            const chatExists = prevChats.some(
              (chat) => chat._id === newMessage.chat._id
            );
            if (!chatExists) {
              setTimeout(() => {
                fetchChats();
              }, 500);
            }

            return updatedChats.sort((a, b) => {
              const aTime = new Date(
                a.latestMessage?.createdAt || a.updatedAt || 0
              );
              const bTime = new Date(
                b.latestMessage?.createdAt || b.updatedAt || 0
              );
              return bTime - aTime;
            });
          });
        });
      }
    } catch (error) {
      console.error("Error setting up socket listeners:", error);
    }
  };

  useEffect(() => {
    if (chats.length > 0 && SocketService.getConnectionStatus()) {
      chats.forEach((chat) => {
        SocketService.joinChat(chat._id);
      });
    }
  }, [chats]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await fetchChats();
      await fetchFriends();
      await fetchUnreadCounts();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/chat/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChats(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
      setChats([]);
      return [];
    }
  };

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("token");

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

      setAllFriends(friendsList);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setAllFriends([]);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/chat/unread-counts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUnreadCounts(response.data || {});
    } catch (error) {
      console.error("Error fetching unread counts:", error);
      setUnreadCounts({});
    }
  };

  const markChatAsRead = async (chatId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/chat/${chatId}/mark-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUnreadCounts((prev) => {
        const newCounts = { ...prev };
        delete newCounts[chatId];
        return newCounts;
      });
    } catch (error) {
      console.error("Error marking chat as read:", error);
      setUnreadCounts((prev) => {
        const newCounts = { ...prev };
        delete newCounts[chatId];
        return newCounts;
      });
    }
  };

  const availableFriends = React.useMemo(() => {
    return allFriends.filter((friend) => {
      if (friend._id === user._id) return false;

      const hasExistingChat = chats.some((chat) => {
        if (chat.isGroupChat) return false;
        return chat.users.some((chatUser) => chatUser._id === friend._id);
      });

      return !hasExistingChat;
    });
  }, [allFriends, chats, user._id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const accessOrCreateChat = async (friendId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/chat/`,
        { userId: friendId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const chat = response.data;

      if (SocketService.getConnectionStatus()) {
        SocketService.joinChat(chat._id);
      }

      await fetchData();

      navigate(`/chat/${chat._id}`, { state: { chatData: chat } });

    } catch (error) {
      console.error("Error accessing chat:", error);
      alert("Failed to create chat");
    }
  };

  const navigateToExistingChat = async (chat) => {
    await markChatAsRead(chat._id);
    navigate(`/chat/${chat._id}`, { state: { chatData: chat } });

  };

  const navigateToCreateGroup = () => {
    navigate("/create-group");
  };

  const getChatDisplayInfo = (chat) => {
    if (chat.isGroupChat) {
      return {
        name: chat.chatName,
        image: null,
        isGroup: true,
        memberCount: chat.users.length,
      };
    } else {
      const otherUser = chat.users.find((u) => u._id !== user._id);
      return {
        name: otherUser?.name || "Unknown User",
        image: otherUser?.profileImage || otherUser?.pic,
        isGroup: false,
      };
    }
  };

  const getLastMessageText = (chat) => {
    if (chat.latestMessage) {
      const senderName = chat.latestMessage.sender.name;
      const isMyMessage = chat.latestMessage.sender._id === user._id;
      const prefix = chat.isGroupChat
        ? isMyMessage
          ? "You: "
          : `${senderName}: `
        : "";
      return `${prefix}${chat.latestMessage.content}`;
    }
    return chat.isGroupChat ? "Group created" : "Start a conversation";
  };

  const getLastMessageTime = (chat) => {
    if (chat.latestMessage) {
      const date = new Date(chat.latestMessage.createdAt || chat.updatedAt);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "";
  };

  const renderChatCard = (chat) => {
    const displayInfo = getChatDisplayInfo(chat);
    const typingUsers = typingStatus[chat._id] || [];
    const isTyping = typingUsers.length > 0;
    const unreadCount = unreadCounts[chat._id] || 0;
    const hasUnread = unreadCount > 0;

    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        key={chat._id}
        className={`p-4 mb-3 rounded-lg shadow-xl cursor-pointer transition-colors ${
          hasUnread
            ? "border-emerald-950 bg-emerald-50 dark:bg-emerald-900/20"
            : {containerClass}
        }`}
        onClick={() => navigateToExistingChat(chat)}
      >
        <div className="flex items-center">
          <div className="relative">
            {displayInfo.isGroup ? (
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border-2 border-emerald-500">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : displayInfo.image ? (
              <img
                src={displayInfo.image}
                alt={displayInfo.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
            )}
            {hasUnread && <UnreadBadge count={unreadCount} />}
          </div>

          <div className="ml-3 flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h3 className={`font-medium truncate ${
                hasUnread
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                  : theme === "dark"
                  ? "text-gray-200"
                  : "text-gray-800"
              }`}>
                {displayInfo.name}
                {displayInfo.isGroup && (
                  <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                    ({displayInfo.memberCount})
                  </span>
                )}
              </h3>
              <span className={`text-xs ${
                hasUnread
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                  : theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}>
                {getLastMessageTime(chat)}
              </span>
            </div>

            {isTyping ? (
              <TypingIndicator
                typingUsers={typingUsers}
                isGroupChat={displayInfo.isGroup}
              />
            ) : (
              <p className={`text-sm truncate ${
                hasUnread
                  ? "text-gray-800 dark:text-gray-200 font-medium"
                  : theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}>
                {getLastMessageText(chat)}
              </p>
            )}
          </div>

          <div className="ml-2 relative">
            {displayInfo.isGroup ? (
              <Users
                className={`w-5 h-5 ${
                  theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            ) : (
              <MessageCircle
                className={`w-5 h-5 ${
                  theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            )}
            {hasUnread && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full"></div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderFriendCard = (friend) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      key={friend._id}
      className={`p-4 mb-3 rounded-lg shadow-xl cursor-pointer transition-colors ${
 {containerClass}
        } `}
      onClick={() => accessOrCreateChat(friend._id)}
    >
      <div className="flex items-center">
        {friend.profileImage ? (
          <img
            src={friend.profileImage}
            alt={friend.name}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
        )}

        <div className="ml-3 flex-1 min-w-0">
          <h3 className={`font-medium truncate ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}>
            {friend.name}
          </h3>
          <p className={`text-sm truncate ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Tap to start chatting
          </p>
        </div>

        <MessageCircle
          className={`w-5 h-5 ${
            theme === "dark" ? "text-emerald-400" : "text-emerald-600"
          }`}
        />
      </div>
    </motion.div>
  );

  const prepareSectionData = () => {
    const sections = [];

    if (chats.length > 0) {
      const sortedChats = [...chats].sort((a, b) => {
        const aUnread = unreadCounts[a._id] || 0;
        const bUnread = unreadCounts[b._id] || 0;

        if (aUnread > 0 && bUnread === 0) return -1;
        if (bUnread > 0 && aUnread === 0) return 1;

        const aTime = new Date(a.latestMessage?.createdAt || a.updatedAt || 0);
        const bTime = new Date(b.latestMessage?.createdAt || b.updatedAt || 0);
        return bTime - aTime;
      });

      sections.push({
        title: "Recent Chats",
        data: sortedChats,
        renderItem: renderChatCard,
      });
    }

    if (availableFriends.length > 0) {
      const friendsToShow = showAllFriends
        ? availableFriends
        : availableFriends.slice(0, 5);
      sections.push({
        title: "Start New Chat",
        data: friendsToShow,
        renderItem: renderFriendCard,
      });
    }

    return sections;
  };


  if (loading) {
    return (
      <Layout>
      <div className="w-full">
        <LoadingSpinner/>
      </div>
      </Layout>

    );
  }

  const containerClass = theme === "dark"
    ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white"
    : "bg-gradient-to-br from-gray-100 via-gray-200 to-white text-gray-800";

  const sections = prepareSectionData();
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  return (
      <Layout>
    <div className={`p-4 m-0 flex flex-col h-screen w-full`}>
      {/* Header */}
      <div className={`p-4 w-full shadow-2xl rounded-xl`}>
        <div className="flex items-center justify-between w-full">
          <h1 className={`text-xl font-bold ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}>
            Chats {totalUnread > 0 && (
              <span className="ml-1 text-emerald-500">({totalUnread})</span>
            )}
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-full ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <RefreshCw
                className={`w-5 h-5 ${
                  refreshing
                    ? "animate-spin text-emerald-500"
                    : theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              />
            </button>
            <button
              onClick={navigateToCreateGroup}
              className={`p-2 rounded-full ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <Plus
                className={`w-5 h-5 ${
                  theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {sections.length > 0 ? (
          sections.map((section) => (
            <div key={section.title} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-bold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}>
                  {section.title}
                  {section.title === "Recent Chats" && totalUnread > 0 && (
                    <span className="ml-1 text-emerald-500">({totalUnread})</span>
                  )}
                </h2>
                {section.title === "Start New Chat" &&
                  availableFriends.length > 5 && (
                    <button
                      onClick={() => setShowAllFriends(!showAllFriends)}
                      className={`text-sm ${
                        theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      {showAllFriends ? "Show Less" : "Show All"}
                    </button>
                  )}
              </div>
              {section.data.map(section.renderItem)}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className={`text-lg font-bold mb-2 ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}>
              No chats yet
            </h2>
            <p className={`text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {availableFriends.length === 0
                ? "All your friends already have chats with you!"
                : "Start a conversation with your friends!"}
            </p>
          </div>
        )}
      </div>
    </div>
      </Layout>

  );
};

export default ChatPage;