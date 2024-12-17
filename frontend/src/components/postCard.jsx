import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faSave,
  faHeart,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { User } from "lucide-react";
import { format } from "date-fns";
import {
  savePost,
  unsavePost,
  getSavedPosts,
} from "../services/savedPosts.services";
import {
  likePost,
  unlikePost,
} from "../services/likedPosts.services";

const PostCard = ({ post, user }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

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
        setLikeCount(prevCount => prevCount - 1);
      } else {
        await likePost(user._id, post._id);
        setIsLiked(true);
        setLikeCount(prevCount => prevCount + 1);
      }
    }
  };

  if (!post || !post.user) return null;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 mb-4 max-w-xs mx-auto transform hover:scale-105 transition-transform duration-300">
      {/* User Info and Post Meta */}
      <div className="flex items-center mb-3">
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

      {/* Post Image */}
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
          <button
            className={`text-xl ${isLiked ? "text-red-500" : "text-gray-500"} hover:text-red-500 mr-3 transform hover:scale-110 transition-transform duration-200`}
            onClick={handleLikePost}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <span className="text-gray-400 text-xs">
            {likeCount === 1 ? '1 Like' : `${likeCount} Likes`}
          </span>
        </div>

        <div className="flex items-center">
          <button className="text-xl text-gray-500 hover:text-blue-500 mr-3 transform hover:scale-110 transition-transform duration-200">
            <FontAwesomeIcon icon={faComment} />
          </button>
          <span className="text-gray-400 text-xs">
            {post.comments.length === 1 ? '1 Comment' : `${post.comments.length} Comments`}
          </span>
        </div>

        <button
          className={`text-xl ${isSaved ? "text-green-500" : "text-gray-500"} transform hover:scale-110 transition-transform duration-200`}
          onClick={handleSavePost}
        >
          <FontAwesomeIcon icon={isSaved ? faCheck : faSave} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
