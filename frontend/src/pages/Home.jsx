import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../pages/Layout";
import PostCard from "../components/postCard";
import { useAuthStore } from "../store/authStore";
import { debounce } from "lodash";
import { useTheme } from "../contexts/themeContext";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const { theme } = useTheme();

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.user?.name?.toLowerCase().includes(searchTerm) ||
        post.caption?.toLowerCase().includes(searchTerm)
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  const fetchPosts = async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:8000/api/posts/${user._id}?page=${page}&limit=10`
      );
      setLoading(false);
      if (response.data.data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...response.data.data]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
      setError("Failed to load posts. Please try again later.");
    }
  };

  const handleLoadMore = debounce(() => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, 300);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const headerGradient =
    theme === "dark"
      ? "from-purple-400 via-pink-500 to-red-500"
      : "from-blue-500 via-green-400 to-yellow-500";

  const inputClass =
    theme === "dark"
      ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
      : "bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-500";

  const textStyle = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center pt-8">
        <h2
          className={`text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${headerGradient} drop-shadow-lg mb-10 text-center transition-all hover:scale-105 duration-300`}
        >
          Explore Posts
        </h2>

        {/* Search Bar */}
        <div className="mb-6 w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search posts by user or caption..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${inputClass}`}
          />
        </div>

        {/* Posts List */}
        <div className="flex flex-col space-y-6 w-full max-w-3xl">
          {error && <p className="text-red-500">{error}</p>}
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} user={user} />
            ))
          ) : (
            <div className="flex justify-center items-center w-full">
              <p className={`${textStyle} text-lg`}>No Posts Found.</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-4">
          {loading ? (
            <p>Loading...</p>
          ) : hasMore ? (
            <button
              onClick={handleLoadMore}
              className="cursor-pointer text-white font-bold relative text-[14px] w-[9em] h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[30px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[35px] before:hover:blur-xl before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700 hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            >
              Load More
            </button>
          ) : (
            <p className="text-gray-500">
              No More Posts...
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
