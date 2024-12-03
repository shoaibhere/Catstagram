import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faSave, faHeart } from "@fortawesome/free-solid-svg-icons";
import { User } from "lucide-react";
import { format } from "date-fns";

const PostCard = ({ post }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 mb-4 max-w-xs mx-auto transform hover:scale-105 transition-transform duration-300">
      <div className="flex items-center mb-3">
        {/* Profile Image */}
        {post.user.profileImage ? (
          <img
            src={post.user.profileImage}
            className="w-10 h-10 rounded-full object-cover ring-4 ring-purple-400 shadow-md mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center ring-4 ring-purple-400 shadow-md mr-3">
            <User className="w-6 h-6 text-purple-800" />
          </div>
        )}

        {/* User Info */}
        <div>
          <h2 className="text-md font-semibold text-white shadow-md">
            {post.user.name || "User Name"}
          </h2>
          <p className="text-xs text-gray-400">
            {format(new Date(post.createdAt), "dd MMMM, yyyy, hh:mm a") ||
              "Just Now"}
          </p>
        </div>
      </div>

      {/* Post Image with Smaller Centered Square Aspect Ratio */}
      <div className="mb-3 relative mx-auto w-full aspect-square max-w-[250px] max-h-[250px] overflow-hidden rounded-lg shadow-md">
        <img
          src={post.image || "https://via.placeholder.com/600x600"}
          alt="post"
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Caption */}
      <p className="text-sm font-semibold text-white mb-3 leading-snug">
        {post.caption || "This is a caption for the post."}
      </p>

      {/* Like & Comment Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button className="text-xl text-gray-500 hover:text-red-500 mr-3 transform hover:scale-110 transition-transform duration-200">
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <span className="text-gray-400 text-xs">{post.likes || 0} Likes</span>
        </div>

        <div className="flex items-center">
          <button className="text-xl text-gray-500 hover:text-blue-500 mr-3 transform hover:scale-110 transition-transform duration-200">
            <FontAwesomeIcon icon={faComment} />
          </button>
          <span className="text-gray-400 text-xs">
            {post.comments?.length || 0} Comments
          </span>
        </div>

        <button className="text-xl text-gray-500 hover:text-green-500 transform hover:scale-110 transition-transform duration-200">
          <FontAwesomeIcon icon={faSave} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
