import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faSave, faHeart } from '@fortawesome/free-solid-svg-icons';
import { User } from "lucide-react";
import { format } from 'date-fns';

const PostCard = ({ post }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4 max-w-md mx-auto">
      <div className="flex items-center mb-3">
      {post.user.profileImage ? (
            <img
              src={post.user.profileImage}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-200 mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-100 mr-3 flex items-center justify-center">
              <User className="w-7 h-7 text-purple-600" />
            </div>
          )}
        <div>
          <h2 className="text-md font-semibold text-white">{post.user.name || 'User Name'}</h2>
          <p className="text-sm text-gray-400">{format(new Date(post.createdAt), 'dd-MMMM, yyyy, hh:mm a') || 'Just Now'}</p>
        </div>
      </div>

      {/* Post Image with 1:1 Aspect Ratio */}
      <div className="mb-3 relative w-full h-64"> {/* Container for square aspect */}
        <img
          src={post.image || 'https://via.placeholder.com/600x600'} // Ensure the fallback is square
          alt="post"
          className="w-full h-full object-cover rounded-lg" // Make sure the image is square and crops excess
        />
      </div>

      {/* Caption */}
      <p className="text-sm text-white mb-3">{post.caption || 'This is a caption for the post.'}</p>

      {/* Like & Comment Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button className="text-xl text-gray-500 hover:text-red-500 mr-3">
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <span className="text-gray-400 text-sm">{post.likes || 0} Likes</span>
        </div>
        <div className="flex items-center">
          <button className="text-xl text-gray-500 hover:text-blue-500 mr-3">
            <FontAwesomeIcon icon={faComment} />
          </button>
          <span className="text-gray-400 text-sm">{post.comments?.length || 0} Comments</span>
        </div>
        <button className="text-xl text-gray-500 hover:text-green-500">
          <FontAwesomeIcon icon={faSave} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
