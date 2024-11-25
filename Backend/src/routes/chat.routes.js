const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getChatHistory,
} = require("../controllers/chat.controller");

// POST route for sending a new message
router.post("/send", sendMessage);

// GET route for fetching chat history between two users
router.get("/history/:userId/:friendId", getChatHistory);

module.exports = router;
