const { Post } = require("../models/posts.model");
const { User } = require("../models/users.model");

// Create a new post
const createPost = async (req, res) => {
  const { caption, imageUrl } = req.body;
  const userId = req.userId; // Assuming the user ID is available in the request after authentication

  try {
    if (!caption) {
      throw new Error("Caption is required");
    }

    const newPost = new Post({
      caption,
      imageUrl,
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

// Like a post
const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId; // User's ID from the JWT token

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // If the user already liked the post, do nothing
    if (post.likes.includes(userId)) {
      return res.status(400).json({ success: false, message: "You already liked this post" });
    }

    post.likes.push(userId);
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post liked successfully",
      post,
    });
  } catch (error) {
    console.error("Error in likePost:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Unlike a post
const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // If the user hasn't liked the post, return an error
    if (!post.likes.includes(userId)) {
      return res.status(400).json({ success: false, message: "You haven't liked this post yet" });
    }

    // Remove userId from the likes array
    post.likes = post.likes.filter((like) => like.toString() !== userId.toString());
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      post,
    });
  } catch (error) {
    console.error("Error in unlikePost:", error);
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

// Save a post
const savePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // If the user has already saved the post, do nothing
    if (post.savedBy.includes(userId)) {
      return res.status(400).json({ success: false, message: "You already saved this post" });
    }

    post.savedBy.push(userId);
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post saved successfully",
      post,
    });
  } catch (error) {
    console.error("Error in savePost:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Remove saved post
const removeSavedPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // If the user hasn't saved the post, return an error
    if (!post.savedBy.includes(userId)) {
      return res.status(400).json({ success: false, message: "You haven't saved this post" });
    }

    // Remove the userId from the savedBy array
    post.savedBy = post.savedBy.filter((savedUser) => savedUser.toString() !== userId.toString());
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post removed from saved list",
      post,
    });
  } catch (error) {
    console.error("Error in removeSavedPost:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPost,
  likePost,
  unlikePost,
  addComment,
  savePost,
  removeSavedPost,
};
