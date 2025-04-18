import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./postCard";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../contexts/themeContext";
import { text } from "@fortawesome/fontawesome-svg-core";

const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const { user } = useAuthStore();
  const { theme } = useTheme(); // Use theme context

  useEffect(() => {
    const API_URL = "https://catstagram-production.up.railway.app"

    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/api/posts/${userId}/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserDetails(response.data.data.user);
        setPosts(response.data.data.posts);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId, user._id]);

  if (loading) {
    return (
      <div className="block sm:flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  const containerClassName =
    theme === "dark"
      ? "bg-gray-800 text-white"
      : "bg-gray-100 text-gray-900";

  return (
    <div>
      <h2 className={`text-2xl text-gray-400 text-center font-bold mb-6`}>User Posts</h2>
      {posts.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No posts yet</div>
      ) : (
        <div className="flex flex-col space-y-6 w-full max-w-3xl">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts;
