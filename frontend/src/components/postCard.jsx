import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import process from 'process';

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
import CommentSection from "./commentSection";
import Modal from "./Modal";

const PostCard = ({ post, user }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const { theme } = useTheme();

  const containerClass = theme === "dark"
    ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white"
    : "bg-gradient-to-br from-gray-100 via-gray-200 to-white text-gray-800";

  const userIconBgClass = theme === "dark"
    ? "bg-purple-300 text-purple-800"
    : "bg-gray-300 text-gray-800";

  const dropdownClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";

  useEffect(() => {
    if (user?._id) {
      setIsSaved(post.savedBy?.some((savedId) => savedId.toString() === user._id.toString()) || false);
      setIsLiked(post.likes?.includes(user._id) || false);
    }
  }, [user, post.savedBy, post.likes]);

  const toggleSavePost = async () => {
    if (isSaved) {
      await unsavePost(user._id, post._id);
      setIsSaved(false);
    } else {
      await savePost(user._id, post._id);
      setIsSaved(true);
    }
  };

  const toggleLikePost = async () => {
    if (isLiked) {
      await unlikePost(user._id, post._id);
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      await likePost(user._id, post._id);
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/delete/${post._id}`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post.");
    }
  };

  const formatCount = (count, singular) => `${count} ${count === 1 ? singular : `${singular}s`}`;

  if (!post || !post.user) return null;

  return (
    <div className={`w-[350px] ${containerClass} rounded-xl shadow-lg hover:shadow-xl p-4 mb-4 mx-auto transform hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {post.user.profileImage ? (
            <img
              src={post.user.profileImage}
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover ring-4 ring-purple-400 shadow-md mr-3"
            />
          ) : (
            <div className={`w-10 h-10 rounded-full ${userIconBgClass} flex items-center justify-center ring-4 ring-purple-400 shadow-md mr-3`}>
              <User className="w-6 h-6" />
            </div>
          )}
          <div>
            <Link to={`/profile/${post.user._id}`} className="font-semibold">
              {post.user.name || "User Name"}
            </Link>
            <p className="text-xs text-gray-400">
              {format(new Date(post.createdAt), "dd MMMM, yyyy, hh:mm a")}
            </p>
          </div>
        </div>
        {user?._id === post.user._id && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            {showDropdown && (
              <div className={`absolute top-8 right-0 w-24 ${dropdownClass} shadow-lg rounded-lg z-10`}>
                <Link to={`/edit-post/${post._id}`} className="block px-3 py-2 hover:bg-gray-200">
                  <FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit
                </Link>
                <button onClick={handleDeletePost} className="block px-3 py-2 text-red-700 hover:bg-red-200 w-full text-left">
                  <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-3 relative mx-auto w-full aspect-square max-w-full overflow-hidden rounded-lg shadow-md">
        <img
          src={post.image || "https://via.placeholder.com/600x600"}
          alt="Post"
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
      </div>

      <p className="text-sm font-semibold mb-3">{post.caption || "Caption"}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button className={`text-xl ${isLiked ? "text-red-500" : "text-gray-500"} hover:text-red-500`} onClick={toggleLikePost}>
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <span className="text-gray-400 text-xs">{formatCount(likeCount, "Like")}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-xl text-gray-500 hover:text-blue-500" onClick={() => setIsCommentModalOpen(true)}>
            <FontAwesomeIcon icon={faComment} />
          </button>
          <span className="text-gray-400 text-xs">{formatCount(commentCount, "Comment")}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className={`text-xl ${isSaved ? "text-green-500" : "text-gray-500"} hover:text-blue-500`} onClick={toggleSavePost}>
            <FontAwesomeIcon icon={isSaved ? fasBookmark : farBookmark} />
          </button>
          <span className="text-gray-400 text-xs">{isSaved ? "Saved" : "Save"}</span>
        </div>
      </div>

      <Modal isOpen={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)}>
        <CommentSection postId={post._id} userId={user._id} onCommentCountChange={setCommentCount} />
      </Modal>
    </div>
  );
};

export default PostCard;
