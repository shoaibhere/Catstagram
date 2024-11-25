const express = require("express");
const {
  sendMessage,
  getChatHistory,
} = require("../controllers/chat.controller");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/history/:userId/:friendId", getChatHistory);

module.exports = router;
