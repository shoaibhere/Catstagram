const express = require("express");
const { createPost, likePost, addComment, savePost } = require("../controllers/posts.controller");
const upload = require("../middlewares/multer.middleware");
const { verifyToken } = require("../middlewares/verifyToken.js");


const router = express.Router();

router.post("/", upload.single("profileImage"),verifyToken, createPost); // Ensure 'profileImage' is used

router.put("/like/:postId",verifyToken,likePost);  // Like a post
router.post("/comment/:postId",verifyToken, addComment);  // Comment on a post
router.put("/save/:postId",verifyToken, savePost);  // Save a post

module.exports = router;
