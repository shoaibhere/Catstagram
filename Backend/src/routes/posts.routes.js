const express = require("express");
const { createPost, likePost, unlikePost, addComment, savePost, removeSavedPost } = require("../controllers/postController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Post Routes
router.post("/", verifyToken, createPost);  // Create a post
router.put("/like/:postId", verifyToken, likePost);  // Like a post
router.put("/unlike/:postId", verifyToken, unlikePost);  // Unlike a post
router.post("/comment/:postId", verifyToken, addComment);  // Comment on a post
router.put("/save/:postId", verifyToken, savePost);  // Save a post
router.put("/unsave/:postId", verifyToken, removeSavedPost);  // Remove saved post

module.exports = router;
