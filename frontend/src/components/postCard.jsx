import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faComment,
  faHeart,
  faEllipsisV,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { User } from "lucide-react";
import { format } from "date-fns";
import { savePost, unsavePost } from "../services/savedPosts.services";
import { likePost, unlikePost } from "../services/likedPosts.services";
import axios from "axios";
import { useTheme } from "../contexts/themeContext";

const PostCard = ({ post, user }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [showDropdown, setShowDropdown] = useState(false);

  const { theme } = useTheme(); // Using theme from context

  // Theme-based styles
  const containerClass =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white"
      : "bg-gradient-to-br from-gray-100 via-gray-200 to-white text-gray-800";
  const userIconBgClass =
    theme === "dark" ? "bg-purple-300 text-purple-800" : "bg-gray-300 text-gray-800";
  const dropdownClass =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const buttonClass = theme === "dark" ? "hover:text-red-500" : "hover:text-red-700";

  // Initial setup for saved and liked state
  useEffect(() => {
    if (user && user._id) {
      const saved = post.savedBy.some((savedId) => savedId.toString() === user._id.toString());
      setIsSaved(saved);

      const liked = post.likes.includes(user._id);
      setIsLiked(liked);
    }
  }, [user, post._id, post.likes, post.savedBy]);

  const handleSavePost = async () => {
    if (user && user._id) {
      if (isSaved) {
        await unsavePost(user._id, post._id);
        setIsSaved(false);
      } else {
        await savePost(user._id, post._id);
        setIsSaved(true);
      }
    }
  };

  const handleLikePost = async () => {
    if (user && user._id) {
      if (isLiked) {
        await unlikePost(user._id, post._id);
        setIsLiked(false);
        setLikeCount((prevCount) => prevCount - 1);
      } else {
        await likePost(user._id, post._id);
        setIsLiked(true);
        setLikeCount((prevCount) => prevCount + 1);
      }
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.get(`http://localhost:8000/api/posts/delete/${post._id}`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post.");
    }
  };

  if (!post || !post.user) return null;

  return (
    <div
      className={`w-[350px] ${containerClass} rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 mb-4 max-w-md mx-auto transform hover:scale-105 transition-transform duration-300 relative`}
    >
      {/* User Info and Post Meta */}
      <div className="flex items-center mb-3 justify-between">
        <div className="flex items-center">
          {post.user.profileImage ? (
            <img
              src={post.user.profileImage}
              className="w-10 h-10 rounded-full object-cover ring-4 ring-purple-400 shadow-md mr-3"
              alt="User Profile"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full ${userIconBgClass} flex items-center justify-center ring-4 ring-purple-400 shadow-md mr-3`}
            >
              <User className="w-6 h-6" />
            </div>
          )}
          <div>
            <Link to={`/profile/${post.user._id}`}>
              <h2 className="text-md font-semibold">{post.user.name || "User Name"}</h2>
            </Link>
            <p className="text-xs text-gray-400">
              {format(new Date(post.createdAt), "dd MMMM, yyyy, hh:mm a")}
            </p>
          </div>
        </div>

        {user && user._id === post.user._id && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            {showDropdown && (
              <div
                className={`absolute top-8 right-0 w-24 ${dropdownClass} shadow-lg rounded-lg z-10`}
              >
                <Link
                  to={`/edit-post/${post._id}`}
                  className="block px-3 py-2 hover:bg-gray-200 w-full text-left"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit
                </Link>
                <button
                  className="block px-3 py-2 text-red-700 hover:bg-red-200 w-full text-left"
                  onClick={handleDeletePost}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Image */}
      <div className="mb-3 relative mx-auto w-full aspect-square max-w-full overflow-hidden rounded-lg shadow-md">
        <img
          src={post.image || "https://via.placeholder.com/600x600"}
          alt="post"
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Caption */}
      <p className="text-sm font-semibold mb-3 leading-snug">{post.caption || "Caption"}</p>

      {/* Like, Comment, Save Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            className={`text-xl ${isLiked ? "text-red-500" : "text-gray-500"} ${buttonClass} mr-3`}
            onClick={handleLikePost}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <span className="text-gray-400 text-xs">{likeCount} Likes</span>
        </div>

        <div className="flex items-center">
          <button className="text-xl text-gray-500 hover:text-blue-500 mr-3">
            <FontAwesomeIcon icon={faComment} />
          </button>
          <span className="text-gray-400 text-xs">{post.comments.length} Comments</span>
        </div>

        <div className="flex items-center">
          <button
            className={`text-xl ${
              isSaved ? "text-green-500" : "text-gray-500"
            } hover:text-blue-500 mr-3`}
            onClick={handleSavePost}
          >
            <FontAwesomeIcon icon={isSaved ? fasBookmark : farBookmark} />
          </button>
          <span className="text-gray-400 text-xs">{isSaved ? "Saved" : "Save"}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
