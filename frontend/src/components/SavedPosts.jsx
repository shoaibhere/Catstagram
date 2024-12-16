import React, { useEffect, useState } from "react";
import PostCard from "./postCard";
import { getSavedPosts } from "../services/savedPosts.services";
import Layout from "../pages/Layout";

const SavedPosts = ({ user }) => {
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const posts = await getSavedPosts(user._id);
        setSavedPosts(posts);
      } catch (error) {
        console.error("Error fetching saved posts", error);
      }
    };

    fetchSavedPosts();
  }, [user._id]);

  // Function to remove a post from savedPosts state
  const handleUnsavePost = (postId) => {
    setSavedPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== postId)
    );
  };

  return (
    <Layout>
      <div className="min-h-screen text-white flex flex-col items-center pt-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg mb-10 text-center transition-all hover:scale-105 duration-300">
          Saved Posts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {savedPosts.length > 0 ? (
            savedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                onUnsave={handleUnsavePost} // Pass the handler
              />
            ))
          ) : (
            <p>No saved posts yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SavedPosts;
