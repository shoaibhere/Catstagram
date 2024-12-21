import React, { useEffect, useState } from "react";
import PostCard from "./postCard";
import { getSavedPosts } from "../services/savedPosts.services";
import Layout from "../pages/Layout";
import { useTheme } from "../contexts/themeContext";

const SavedPosts = ({ user }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const { theme } = useTheme();

  const fetchSavedPosts = async () => {
    try {
      const posts = await getSavedPosts(user._id);
      setSavedPosts(posts);
    } catch (error) {
      console.error("Error fetching saved posts", error);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, [user._id]);

  const handleUnsavePost = (postId) => {
    setSavedPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== postId)
    );
  };

  // Themed styles
  const headerGradient =
    theme === "dark"
      ? "from-purple-400 via-pink-500 to-red-500"
      : "from-blue-500 via-green-400 to-yellow-500";

  const buttonSelected =
    theme === "dark"
      ? "bg-purple-700 text-white"
      : "bg-blue-700 text-white";
  const buttonUnselected =
    theme === "dark"
      ? "bg-gray-700 text-purple-300 hover:bg-purple-800"
      : "bg-gray-300 text-blue-500 hover:bg-blue-400";

  const textStyle =
    theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center pt-8">
        <h2
          className={`text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${headerGradient} drop-shadow-lg mb-10 text-center transition-all hover:scale-105 duration-300`}
        >
          Saved Posts
        </h2>
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 rounded-md flex items-center ${
              viewMode === "grid" ? buttonSelected : buttonUnselected
            } transition duration-300`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-md flex items-center ${
              viewMode === "list" ? buttonSelected : buttonUnselected
            } transition duration-300`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            List
          </button>
        </div>
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6"
              : "flex flex-col space-y-6 w-full max-w-2xl"
          }`}
        >
          {savedPosts.length > 0 ? (
            savedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                onUnsave={handleUnsavePost}
                viewMode={viewMode}
              />
            ))
          ) : (
            <p className={textStyle}>No saved posts yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SavedPosts;
