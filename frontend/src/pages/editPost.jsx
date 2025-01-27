import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To extract post ID from URL
import Layout from "./Layout";
import EditPostForm from "../components/editPostForm";
import axios from "axios";

const EditPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://catstagram-production.up.railway.app/api/posts/edit/${id}`);
        if (response.data.success) {
          setPost(response.data.post); // Set post data
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to load post data.");
        console.error("Error fetching post data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <Layout>
      <div className="flex justify-center h-full items-center">
        {post && <EditPostForm post={post} />} {/* Pass post data */}
      </div>
    </Layout>
  );
};

export default EditPost;
