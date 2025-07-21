const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
  getUnreadCounts,
  markChatAsRead,
} = require("../controllers/chat.controller");
const { verifyToken } = require("../middlewares/verifyToken"); // Changed from protect

const router = express.Router();

router.route("/").post(verifyToken, accessChat);
router.route("/").get(verifyToken, fetchChats);
router.route("/unread-counts").get(verifyToken, getUnreadCounts);
router.route("/:chatId/mark-read").put(verifyToken, markChatAsRead);
router.route("/group").post(verifyToken, createGroupChat);
router.route("/rename").put(verifyToken, renameGroup);
router.route("/groupremove").put(verifyToken, removeFromGroup);
router.route("/groupadd").put(verifyToken, addToGroup);

module.exports = router;
