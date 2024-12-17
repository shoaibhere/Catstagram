const express = require("express");
const {
  createPost,
  addComment,
  deletePost,
  editPostget,
  editPost,
} = require("../controllers/posts.controller");
const upload = require("../middlewares/multer.middleware");
const { verifyToken } = require("../middlewares/verifyToken.js");
const {
  getPosts,
  getPostsByUserId,
} = require("../controllers/getposts.controller.js");

const router = express.Router();

router.post("/", upload.single("profileImage"), verifyToken, createPost); // Ensure 'profileImage' is used
router.get("/delete/:id",verifyToken,deletePost);
router.get("/edit/:id",verifyToken,editPostget);
router.post("/edit/:id",upload.single("profileImage"),verifyToken,editPost);

router.post("/comment/:id", verifyToken, addComment); // Comment on a post
router.get("/", getPosts);
router.get("/:userId", verifyToken, getPostsByUserId);

module.exports = router;
