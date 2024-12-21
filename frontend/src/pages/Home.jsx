import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../pages/Layout';
import PostCard from '../components/postCard';
import { useAuthStore } from '../store/authStore';
import { debounce } from 'lodash'; // Ensure lodash is installed or import debounce directly

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, [page]); // Dependency on page state so it refetches when page changes

  async function fetchPosts() {
    if (!hasMore || loading) return;
    setLoading(true); // Start loading indicator

    try {
      const response = await axios.get(`http://localhost:8000/api/posts/${user._id}?page=${page}&limit=10`);
      console.log('Fetched data:', response.data.data); // Debug log
      setLoading(false); // Stop loading indicator
      if (response.data.data.length === 0) {
        setHasMore(false); // No more posts to load
        console.log('No more posts to load.'); // Debug log
      } else {
        setPosts(prevPosts => [...prevPosts, ...response.data.data]); // Append new posts
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false); // Stop loading indicator on error
      setError('Failed to load posts. Please try again later.'); // Set error message
    }
  }

  const handleLoadMore = debounce(() => { // Debounce the load more function
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  }, 300);

  return (
    <Layout>
      <div className="mt-8">
        {error && <p className="text-red-500">{error}</p>}
        {posts.map((post) => (
          <PostCard key={post._id} post={post} user={user} />
        ))}
        <div className="flex justify-center mt-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            hasMore ? (
              <button onClick={handleLoadMore} className="cursor-pointer text-white font-bold relative text-[14px] w-[9em] h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[30px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[35px] before:hover:blur-xl before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700 hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">    
                Load More
              </button>
            ) : (
              <p className="text-gray-500">You've reached the end of the posts on Catstagram</p>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
