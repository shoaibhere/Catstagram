const express = require("express");
const router = express.Router();
const {
  getOneComment,
  getComments,
  addComment,
  removeComment,
  editComment,
} = require("../controllers/comments.controller");

router.get('/:postId',getComments);
router.get('/get-one/:commentId',getOneComment);
router.post('/add-comment/:postId/:userId',addComment);
router.get('/remove-comment/:commentId/:userId',removeComment);
router.post('/edit-comment/:commentId/:userId',editComment);

module.exports = router;
