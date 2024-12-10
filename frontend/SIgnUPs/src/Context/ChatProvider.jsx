import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [loading, setLoading] = useState(false); // Add loading state

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch userInfo from localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo && userInfo.user) {
      setUser(userInfo.user);
    } else {
      navigate("/"); // Redirect if no user info
    }

    // setLoading(false); // Stop loading after userInfo is set
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        loading, // Pass loading state
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const ChatState = () => {
  return useContext(ChatContext);
};

export { ChatState, ChatProvider };
