import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

// Initialize the socket connection (replace with your server URL)
const socket = io();

const Chat = ({ user }) => {
  const { friendId } = useParams(); // Get friendId from the URL parameter
  const [messages, setMessages] = useState([]); // To store chat history
  const [newMessage, setNewMessage] = useState(""); // New message input
  const [friend, setFriend] = useState({}); // Store the friend's data

  // Fetch chat history when component loads
  useEffect(() => {
    // Replace this with your API call to get chat history
    socket.emit("joinChat", { senderId: user._id, recipientId: friendId });

    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    return () => {
      socket.off("chatHistory");
    };
  }, [friendId, user._id]);

  // Handle new messages from socket
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Function to handle sending messages
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: user._id,
      recipientId: friendId,
      message: newMessage,
    };

    socket.emit("sendMessage", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]); // Optimistic UI update
    setNewMessage("");
  };

  return (
    <div className="w-full h-full bg-gray-900 p-6 overflow-y-auto">
      {/* Friend's header */}
      <div className="flex items-center space-x-4 p-4 border-b-2 border-purple-600">
        <img
          src={friend.avatar || "https://via.placeholder.com/50"}
          alt="Friend's profile"
          className="w-12 h-12 rounded-full border-2 border-white"
        />
        <div>
          <h3 className="text-xl font-semibold">{friend.name}</h3>
          <p className="text-sm text-gray-300">Online</p>
        </div>
      </div>

      {/* Chat History */}
      <div className="chat-history bg-gray-100 p-4 rounded-lg mb-4 h-3/4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.senderId === user._id
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            } p-2 rounded-lg mb-2`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="send-message flex items-center space-x-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
