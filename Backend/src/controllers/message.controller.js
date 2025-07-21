const asyncHandler = require("express-async-handler");
const Message = require("../models/message.model");
const User = require("../models/users.model");
const Chat = require("../models/chat.model");

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat")
      .sort({ createdAt: 1 }); // Sort by creation time ascending
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.userId,
    content: content,
    chat: chatId,
  };

  try {
    // Create and populate the message in one operation
    let message = await Message.create(newMessage);

    // Modern way to populate (Mongoose v6+)
    message = await Message.populate(message, [
      { path: "sender", select: "name pic" },
      { path: "chat" },
      { path: "chat.users", select: "name pic email" },
    ]);

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    // Get the io instance from app
    const io = req.app.get("io");
    if (io) {
      // Emit to all users in the chat except the sender
      message.chat.users.forEach((user) => {
        if (user._id.toString() !== req.userId.toString()) {
          io.to(user._id.toString()).emit("message recieved", message);
        }
      });
    }

    res.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = { allMessages, sendMessage };
