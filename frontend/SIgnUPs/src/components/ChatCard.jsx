import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react"; // Importing Lucide User icon

const ChatCard = ({ friend, lastMessage, hasUnreadMessages }) => {
  return (
    <Link to={`/chat/${friend._id}`} key={friend._id}>
      <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-purple-800 transition duration-300 cursor-pointer">
        {/* Profile picture or default User icon */}
        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden flex items-center justify-center">
          {friend.profilePicture ? (
            <img
              src={friend.profilePicture}
              alt={friend.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="text-white" size={24} /> // Use default icon if no profile picture
          )}
        </div>

        <div className="flex-1">
          {/* Friend's name */}
          <h3 className="text-lg font-semibold">{friend.name}</h3>

          {/* Last message, or display a placeholder if no message is available */}
          <p className="text-sm text-gray-300">
            {lastMessage ? lastMessage : "No messages yet"}
          </p>
        </div>

        {/* Unread message indicator */}
        {hasUnreadMessages && (
          <div className="text-blue-400 text-xl">●</div> // Show a dot for unread messages
        )}
      </div>
    </Link>
  );
};

export default ChatCard;
