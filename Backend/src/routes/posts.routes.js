const express = require("express");
const {
  createPost,
  addComment,
} = require("../controllers/posts.controller");
const upload = require("../middlewares/multer.middleware");
const { verifyToken } = require("../middlewares/verifyToken.js");
const {
  getPosts,
  getPostsByUserId,
} = require("../controllers/getposts.controller.js");

const router = express.Router();

router.post("/", upload.single("profileImage"), verifyToken, createPost); // Ensure 'profileImage' is used

router.post("/comment/:postId", verifyToken, addComment); // Comment on a post
router.get("/", getPosts);
router.get("/:userId", verifyToken, getPostsByUserId);

module.exports = router;
