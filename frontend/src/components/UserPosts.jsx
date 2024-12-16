import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./postCard";

const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const API_URL =
      import.meta.env.MODE === "development"
        ? "http://localhost:8000"
        : "/api/posts";

    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/api/posts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: page,
            limit: 10,
          },
        });

        // Set user details from the first request
        if (page === 1) {
          setUserDetails(response.data.data.user);
          setTotalPosts(response.data.pagination.totalPosts);
        }

        if (response.data.data.posts.length === 0) {
          setHasMore(false);
        }

        setPosts((prevPosts) =>
          page === 1
            ? response.data.data.posts
            : [...prevPosts, ...response.data.data.posts]
        );
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId, page]);

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center py-10 ">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <div className="mt-8 bg-gray-800 rounded-lg p-6 mx-[150px]">
      <h2 className="text-2xl font-bold text-white mb-6">User Posts</h2>
      {posts.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No posts yet</div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "1fr",
          }}
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} style={{ width: "100%" }} />
          ))}
        </div>
      )}

      {/* Show Load More only if total posts exceed 10 and there are more posts to load */}
      {totalPosts > 10 && hasMore && posts.length < totalPosts && (
        <div className="text-center mt-6">
          <button
            onClick={loadMorePosts}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
