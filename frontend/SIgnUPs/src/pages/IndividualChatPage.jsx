import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // For reading the friendId from the URL
import { useAuthStore } from "../store/authStore"; // Auth store to get user info

const IndividualChatPage = () => {
  const [friends, setFriends] = useState([]);
  const { user } = useAuthStore(); // Get the authenticated user
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [newMessage, setNewMessage] = useState(""); // State for the new message input
  const [loading, setLoading] = useState(false); // State for loading indicator
  const messagesEndRef = useRef(null); // Ref to scroll to the newest message

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:8000"
      : "/api/messages"; // Adjust as per your backend URL

  // Fetch messages for the specific chat
  useEffect(() => {
    fetchMessages();
  }, [friends._id]);

  // Scroll to the latest message whenever the messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await axios.get(`${API_URL}/chat/${friends._id}`, {
        params: { userId: user._id }, // Fetch messages for the current user and the friend
      });
      setMessages(response.data); // Set messages from the response
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false); // Set loading to false after fetch is complete
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Don't send empty messages

    try {
      const response = await axios.post(`${API_URL}/send`, {
        userId: user._id,
        friendID: friends._id,
        message: newMessage,
      });

      setMessages((prevMessages) => [...prevMessages, response.data]); // Add the new message to the messages state
      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <div className="fixed top-0 left-0 right-0 z-20">
        {/* You can reuse your Navbar or create a new one for this page */}
      </div>

      <div className="flex h-full pt-16">
        {/* Chat Window */}
        <div className="flex flex-col flex-1 p-6 overflow-y-auto">
          {/* Messages Section */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="loader">Loading...</div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === user._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-4 rounded-lg text-sm ${
                      message.senderId === user._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}

            {/* Scroll to the latest message */}
            <div ref={messagesEndRef} />
          </div>

          {/* Send Message Section */}
          <div className="flex items-center mt-4 space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-3 bg-purple-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualChatPage;
