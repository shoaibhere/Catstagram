import React from 'react';

const PostCard = ({ post }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6 max-w-xl mx-auto">
      {/* User Info */}
      <div className="flex items-center mb-4">
        <img
          src={post.user.profilePicture || 'https://via.placeholder.com/50'}
          alt="profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h2 className="text-md font-semibold">{post.user.name || 'User Name'}</h2>
          <p className="text-sm text-gray-400">{post.createdAt || 'Just Now'}</p>
        </div>
      </div>

      {/* Post Image */}
      <div className="mb-4">
        <img
          src={post.imageUrl || 'https://via.placeholder.com/600x400'}
          alt="post"
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* Caption */}
      <p className="text-sm text-white mb-4">{post.caption || 'This is a caption for the post.'}</p>

      {/* Like & Comment Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button className="text-xl text-gray-500 hover:text-red-500 mr-4">
            <i className="fa fa-heart"></i>
          </button>
          <span className="text-gray-400">{post.likes || 0} Likes</span>
        </div>
        <div className="flex items-center">
          <button className="text-xl text-gray-500 hover:text-blue-500 mr-4">
            <i className="fa fa-comment"></i>
          </button>
          <span className="text-gray-400">{post.comments?.length || 0} Comments</span>
        </div>
        <button className="text-xl text-gray-500 hover:text-green-500">
          <i className="fa fa-save"></i>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
