import React, { useState } from "react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const toggleSave = () => {
    setSaved(!saved);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg my-4 max-w-lg mx-auto">
      {/* Profile Section */}
      <div className="flex items-center p-4">
        <img
          className="w-10 h-10 rounded-full object-cover mr-4"
          src={post.user.profileImage || "/default-avatar.png"}
          alt={post.user.username}
        />
        <div>
          <p className="font-semibold text-gray-800">{post.user.username}</p>
          <p className="text-sm text-gray-500">2 hours ago</p>
        </div>
      </div>

      {/* Post Caption */}
      <div className="px-4 py-2">
        <p className="text-gray-800">{post.caption}</p>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="relative w-full pb-3/4">
          <img
            src={post.imageUrl}
            alt="Post"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      {/* Actions Section */}
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex space-x-4">
          <button
            onClick={toggleLike}
            className={`text-xl ${liked ? "text-red-500" : "text-gray-500"}`}
          >
            {liked ? "❤️ Liked" : "🤍 Like"}
          </button>
          <button className="text-xl text-gray-500">💬 Comment</button>
          <button
            onClick={toggleSave}
            className={`text-xl ${saved ? "text-yellow-500" : "text-gray-500"}`}
          >
            {saved ? "🔖 Saved" : "🔖 Save"}
          </button>
        </div>
      </div>

      {/* Like Count */}
      <div className="px-4 py-2 text-gray-600">
        <p>{liked ? "1 like" : "0 likes"}</p>
      </div>

      {/* Comments Section */}
      <div className="px-4 py-2">
        <p className="text-gray-500">View all comments</p>
        <div className="flex items-center mt-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
