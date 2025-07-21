import SideNav from "../components/sideNav";
import Navbar from "../components/navbar";
import Factsbar from "../components/factsbar";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { User, Send, Users, Settings, Loader, ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Layout from "./Layout";
import SocketService from "../services/socket";
import { useTheme } from "../contexts/themeContext";
import LoadingSpinner from "../components/LoadingSpinner";

const TypingIndicator = ({ typingUsers }) => {
  const { theme } = useTheme();

  if (!typingUsers || typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) return `${typingUsers[0].name} is typing...`;
    if (typingUsers.length === 2)
      return `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`;
    return `${typingUsers[0].name} and ${
      typingUsers.length - 1
    } others are typing...`;
  };
};

const DateSeparator = ({ date }) => {
  const { theme } = useTheme();

  const formatDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDateOnly = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (messageDateOnly.getTime() === todayOnly.getTime()) {
      return "Today";
    } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="flex items-center my-4">
      <div
        className={`flex-1 h-px ${
          theme === "dark" ? "bg-gray-600" : "bg-gray-300"
        }`}
      />
      <div
        className={`mx-3 px-4 py-1 rounded-full ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        <span
          className={`text-xs font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {formatDate(date)}
        </span>
      </div>
      <div
        className={`flex-1 h-px ${
          theme === "dark" ? "bg-gray-600" : "bg-gray-300"
        }`}
      />
    </div>
  );
};

const ChatMessage = () => {
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const messagesEndRef = useRef(null);
  const { theme } = useTheme();
  const location = useLocation();

  const sidebarClasses = theme === "dark" ? "bg-black" : "bg-white";
  const navbarClasses = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const factsbarClasses = theme === "dark" ? "bg-black" : "bg-white";

  const chatData = location.state?.chatData;
  console.log("Chat Data: " + chatData);
  const API_URL = "https://catstagram-production.up.railway.app/api";

  useEffect(() => {
    fetchMessages();
    setupSocket();

    return () => {
      cleanupSocket();
    };
  }, [chatId, user._id]);

  useEffect(() => {
    if (!socketConnected || !chatData) return;

    const updateStatus = () => {
      if (chatData.isGroupChat) {
        // Group chat logic
        const onlineCount = chatData.users.filter(
          (user) => SocketService.getOnlineStatus(user._id) === "online"
        ).length;
        setOnlineStatus(
          onlineCount > 0 ? `${onlineCount} online` : "All offline"
        );
      } else {
        // 1:1 chat logic
        const otherUser = chatData.users.find((u) => u._id !== user._id);
        if (otherUser) {
          const status = SocketService.getOnlineStatus(otherUser._id);
          setOnlineStatus(status === "online" ? "Online" : "Offline");
          setLastSeen(otherUser.lastSeen);
        }
      }
    };

    // Initial update
    updateStatus();

    // Listen for presence updates
    const presenceUpdate = (userId) => {
      if (!chatData.isGroupChat) {
        const otherUser = chatData.users.find((u) => u._id !== user._id);
        if (otherUser && otherUser._id === userId) {
          updateStatus();
        }
      } else {
        updateStatus();
      }
    };

    SocketService.socket.on("user-online", presenceUpdate);
    SocketService.socket.on("user-offline", presenceUpdate);

    return () => {
      SocketService.socket.off("user-online", presenceUpdate);
      SocketService.socket.off("user-offline", presenceUpdate);
    };
  }, [socketConnected, chatData, user._id]);

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "recently";
    const now = new Date();
    const lastSeenDate = new Date(timestamp);
    const diffMinutes = Math.floor((now - lastSeenDate) / 60000);

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return lastSeenDate.toLocaleDateString();
  };

  const groupMessagesByDate = (messages) => {
    const grouped = [];
    let currentDate = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();

      if (currentDate !== messageDate) {
        grouped.push({
          type: "date",
          id: `date-${messageDate}`,
          date: message.createdAt,
        });
        currentDate = messageDate;
      }

      grouped.push({
        type: "message",
        ...message,
      });
    });

    return grouped;
  };

  const setupSocket = () => {
    SocketService.connect(user._id, user.name);

    const checkConnection = setInterval(() => {
      const connected = SocketService.getConnectionStatus();
      setSocketConnected(connected);

      if (connected && !SocketService.hasJoinedChat) {
        SocketService.joinChat(chatId);
        SocketService.hasJoinedChat = true;
      }
    }, 1000);

    SocketService.onMessageReceived((newMessage) => {
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(
          (msg) => msg._id === newMessage._id
        );
        if (!messageExists) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    SocketService.onTyping((data) => {
      if (data.user._id !== user._id) {
        setTypingUsers((prev) => {
          const exists = prev.find((u) => u._id === data.user._id);
          if (!exists) {
            return [...prev, data.user];
          }
          return prev;
        });
      }
    });

    SocketService.onStopTyping((data) => {
      setTypingUsers((prev) => prev.filter((u) => u._id !== data.user._id));
    });

    return () => {
      clearInterval(checkConnection);
    };
  };

  const cleanupSocket = () => {
    SocketService.offMessageReceived();
    SocketService.offTyping();
    SocketService.hasJoinedChat = false;
    setTypingUsers([]);
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      const response = await axios.get(`${API_URL}/message/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(response.data);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView();
      }, 500);
    } catch (error) {
      console.error("Error fetching messages:", error);
      alert("Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      setSending(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/message/`,
        {
          content: messageContent,
          chatId: chatId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sentMessage = response.data;
      setMessages((prevMessages) => [...prevMessages, sentMessage]);

      if (socketConnected) {
        SocketService.sendMessage(sentMessage);
      }

      if (typingTimeout) {
        clearTimeout(typingTimeout);
        setTypingTimeout(null);
      }
      SocketService.stopTyping(chatId);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (text) => {
    setNewMessage(text);

    if (!socketConnected) return;

    SocketService.startTyping(chatId);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      SocketService.stopTyping(chatId);
    }, 3000);

    setTypingTimeout(timeout);
  };

  const getChatDisplayInfo = () => {
    if (!chatData) return { name: "Chat", image: null, isGroup: false };

    if (chatData.isGroupChat) {
      return {
        name: chatData.chatName,
        image: null,
        isGroup: true,
        memberCount: chatData.users.length,
      };
    } else {
      const otherUser = chatData.users.find((u) => u._id !== user._id);
      return {
        name: otherUser?.name || "Unknown User",
        image: otherUser?.profileImage || otherUser?.pic,
        isGroup: false,
      };
    }
  };

  const navigateToGroupSettings = () => {
    if (chatData?.isGroupChat) {
      navigate(`/group-settings/${chatId}`, { state: { chatData } });
    }
  };

  const renderItem = (item) => {
    if (item.type === "date") {
      return <DateSeparator date={item.date} />;
    }

    const isMyMessage = item.sender._id === user._id;

    return (
      <div
        key={item._id}
        className={`max-w-[40%] my-1 p-3 rounded-xl shadow-2xl ${
          isMyMessage
            ? "ml-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white"
            : theme === "dark"
            ? "mr-auto bg-gray-700 text-gray-100"
            : "mr-auto bg-gray-100 text-gray-800"
        }`}
      >
        {!isMyMessage && chatData?.isGroupChat && (
          <div
            className={`text-xs font-medium mb-1 ${
              isMyMessage
                ? "text-gray-200"
                : theme === "dark"
                ? "text-gray-300"
                : "text-gray-600"
            }`}
          >
            {item.sender.name}
          </div>
        )}
        <div className="text-sm">{item.content}</div>
        <div
          className={`text-xs mt-1 text-right ${
            isMyMessage
              ? "text-gray-200"
              : theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    );
  };

  const displayInfo = getChatDisplayInfo();
  const groupedMessages = groupMessagesByDate(messages);

  if (loading) {
    return (
      <Layout>
        <div className="w-full">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
        {/* Main Content Area (Dynamic children) */}
        <div className="flex-grow p-4 overflow-y-auto mb-10">
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 shadow-xl rounded-lg`}
          >
            <div></div>

            <div className="flex items-center">
              {displayInfo.isGroup ? (
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-2">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                </div>
              ) : displayInfo.image ? (
                <img
                  src={displayInfo.image}
                  alt={displayInfo.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
              )}
              <div className="text-center">
                <h2
                  className={`font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {displayInfo.name}
                  {displayInfo.isGroup && (
                    <span className="text-xs font-normal ml-1 text-gray-500 dark:text-gray-400">
                      ({displayInfo.memberCount})
                    </span>
                  )}
                </h2>
                {/* Replace the simple online status with: */}
                <div className="text-xs mt-1">
                  {onlineStatus === "Online" ? (
                    <span className="text-emerald-500">Online</span>
                  ) : onlineStatus === "Offline" ? (
                    <span className="text-gray-500">
                      Last seen {formatLastSeen(lastSeen)}
                    </span>
                  ) : (
                    <span
                      className={
                        onlineStatus == "online"
                          ? "text-emerald-500"
                          : "text-gray-500"
                      }
                    >
                      {onlineStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {displayInfo.isGroup ? (
              <button
                onClick={navigateToGroupSettings}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Settings
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }
                />
              </button>
            ) : (
              <div></div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {groupedMessages.length > 0 ? (
              <>
                {groupedMessages.map(renderItem)}
                <div ref={messagesEndRef} />
                <TypingIndicator typingUsers={typingUsers} />
              </>
            ) : (
              <div className="flex flex-col items-center text-center justify-center h-full">
                <Users className="w-16 h-16 text-gray-400 mb-4" />
                <p
                  className={`text-lg ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {displayInfo.isGroup
                    ? "Welcome to the group! Start the conversation!"
                    : "No messages yet. Start the conversation!"}
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className={`fixed z-40 mb-16 sm:mb-0 bottom-0 left-0 right-0 p-4 sm:left-[20%] sm:right-[20%]`}>
  <div className="flex items-center w-full max-w-screen-md mx-auto">
    <input
      type="text"
      value={newMessage}
      onChange={(e) => handleTyping(e.target.value)}
      placeholder={`Message ${displayInfo.name}...`}
      className={`flex-1 py-2 px-4 rounded-full shadow-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
        theme === "dark"
          ? "bg-gray-700 text-white placeholder-gray-400"
          : "bg-gray-100 text-gray-800 placeholder-gray-500"
      }`}
      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      disabled={sending}
    />
    <button
      onClick={sendMessage}
      disabled={!newMessage.trim() || sending}
      className={`ml-2 p-2 rounded-full ${
        newMessage.trim() && !sending
          ? "bg-emerald-500 hover:bg-emerald-600"
          : theme === "dark"
          ? "bg-gray-700"
          : "bg-gray-200"
      }`}
    >
      {sending ? (
        <Loader className="w-5 h-5 animate-spin text-white" />
      ) : (
        <Send
          className={`w-5 h-5 ${
            newMessage.trim() && !sending
              ? "text-white"
              : theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        />
      )}
    </button>
  </div>
</div>
        </div>
    </Layout>
  );
};

export default ChatMessage;
