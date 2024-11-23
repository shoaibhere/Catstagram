import React, { useState, useEffect } from "react";
import SideNav from "../components/SideNav";
import Navbar from "../components/Navbar";
import Factsbar from "../components/factsbar";
import { useAuthStore } from "../store/authStore";
import { format } from 'date-fns';
import axios from 'axios';

const UserProfile = () => {
  const { user, logout } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedCaption, setEditedCaption] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Simulated demo posts for now
  useEffect(() => {
    const demoPosts = [
      { id: 1, imageUrl: "https://via.placeholder.com/150", caption: "Post 1" },
      { id: 2, imageUrl: "https://via.placeholder.com/150", caption: "Post 2" },
      { id: 3, imageUrl: "https://via.placeholder.com/150", caption: "Post 3" },
      { id: 4, imageUrl: "https://via.placeholder.com/150", caption: "Post 4" },
    ];
    setPosts(demoPosts);
  }, []);
  

  const handleDeleteAccount = () => {
    console.log("Account Deleted");
  };

  const handleEditAccount = () => {
    console.log("Edit Account");
  };

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const handleEditPost = (postId, caption) => {
    setEditingPostId(postId);
    setEditedCaption(caption);
  };

  const handleSaveEdit = () => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === editingPostId
          ? { ...post, caption: editedCaption }
          : post
      )
    );
    setEditingPostId(null);
    setEditedCaption("");
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditedCaption("");
  };

  return (
    <div className="h-screen w-full flex flex-col text-white p-4">
      {/* Top Navbar (Fixed) */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex h-full pt-16">
        {/* Left Sidebar (Fixed on the Left Side) */}
        <div className="fixed left-0 top-16 bottom-0 w-1/5 bg-black p-4 z-10">
          <SideNav user={user} />
        </div>

        {/* Main Content Area (Scrollable, filling remaining space) */}
        <div className="flex-grow ml-[20%] mr-[20%] p-4 overflow-y-auto">
          <div className="flex flex-col items-center mb-10">
            <img
              src={user.profilePicture || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-400">@{user.email}</p>
            <p className="text-gray-400">Date Joined: {format(new Date(user.createdAt), 'dd-MMMM, yyyy')}</p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleEditAccount}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Edit Account
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Posts Section */}
          <h3 className="text-xl font-semibold mb-6">Your Posts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-800 p-4 rounded-lg relative group"
              >
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full h-40 object-cover rounded"
                />
                {editingPostId === post._id ? (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={editedCaption}
                      onChange={(e) => setEditedCaption(e.target.value)}
                      className="bg-gray-700 p-2 text-white w-full rounded"
                    />
                    <div className="mt-2 flex gap-4">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-2 text-sm text-gray-300">{post.caption}</p>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleEditPost(post._id, post.caption)}
                        className="bg-blue-600 text-xs px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="bg-red-600 text-xs px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar (Fixed on the Right Side) */}
        <div className="fixed right-7 top-16 h-full bottom-0 w-1/5 p-4 bg-gray-800 z-10">
          <Factsbar />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
