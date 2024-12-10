import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000"); // Adjust backend URL if necessary

const IndividualChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { userId, friendId } = useParams(); // Get userId and friendId for 1-on-1 chat

  useEffect(() => {
    // Join the chat room (use userId + friendId as room ID)
    const room = `${userId}-${friendId}`;
    socket.emit("join-room", room);

    // Listen for incoming messages
    socket.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up on component unmount
    return () => {
      socket.off("receive-message");
    };
  }, [userId, friendId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    // Emit the message to the server
    const room = `${userId}-${friendId}`;
    socket.emit("message", { room, message: newMessage });

    // Clear the input after sending
    setNewMessage("");
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index}>
            <p>{message}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default IndividualChatPage;
