const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/message.controller");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.route("/:chatId").get(verifyToken, allMessages);
router.route("/").post(verifyToken, sendMessage);

module.exports = router;
