const express = require("express");
const { savePost, unsavePost, getSavedPosts } = require("../controllers/savedPosts.controller");

const router = express.Router();

router.post("/save", savePost);
router.post("/unsave", unsavePost);
router.get("/:userId", getSavedPosts);

module.exports = router;
