const { Post } = require("../models/posts.model");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a new post
const createPost = async (req, res) => {
  const { caption, profileImage } = req.body;
  console.log(req.body);
  const userId = req.userId;
  const imageUrl = req.file.path;// Assuming the user ID is available in the request after authentication

  try {
    if (!imageUrl) {
      throw new Error("Image is required"); // Handle case where file is missing
    }
    // Create a new post
    const newPost = new Post({
      caption,
      image: imageUrl,
      user: userId,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Comment on a post
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { commentText } = req.body;
  const userId = req.userId;

  try {
    if (!commentText) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const newComment = {
      user: userId,
      text: commentText,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      post,
    });
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPost,
  addComment,
};
