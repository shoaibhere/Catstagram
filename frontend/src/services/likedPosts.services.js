import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/liked-posts"
    : "/api/liked-posts";

export const likePost = async (userId, postId) => {
  try {
    const response = await axios.post(`${API_URL}/like`, {
      userId,
      postId,
    });
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const unlikePost = async (userId, postId) => {
  try {
    const response = await axios.post(`${API_URL}/unlike`, {
      userId,
      postId,
    });
    return response.data;
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
};