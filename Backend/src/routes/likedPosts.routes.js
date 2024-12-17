const express = require("express");
const { likePost, unlikePost } = require("../controllers/likePost.controller");

const router = express.Router();

router.post("/like", likePost);
router.post("/unlike", unlikePost);

module.exports = router;
