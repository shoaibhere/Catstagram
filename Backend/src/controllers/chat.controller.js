const Message = require("../models/message.model");
const User = require("../models/users.model");

// Send a new message
exports.sendMessage = async (req, res) => {
  const { sender, receiver, content } = req.body;

  try {
    const newMessage = new Message({
      sender,
      receiver,
      content,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).send("Server error");
  }
};

// Get chat history between two users
exports.getChatHistory = async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    const user = await User.findById(userId);
    const friends = user?.friends || [];

    res.status(200).json({ messages, friends });
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    res.status(500).send("Server error");
  }
};
