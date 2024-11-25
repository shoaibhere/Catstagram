const Message = require("../models/message.model");
const User = require("../models/users.model"); // Import the User model

// Create a new message
exports.sendMessage = async (req, res) => {
  const { sender, receiver, content } = req.body;

  try {
    const newMessage = new Message({
      sender,
      receiver,
      content,
    });

    await newMessage.save();
    return res.status(201).json(newMessage); // Respond with the created message
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).send("Server error");
  }
};

// Get chat history between two users
exports.getChatHistory = async (req, res) => {
  const { user_id, friend_id } = req.params; // userId and friendId are passed in the URL params

  try {
    // Fetch messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: user_id, receiver: friend._id },
        { sender: friend_id, receiver: user._id },
      ],
    }).sort({ timestamp: 1 }); // Sort by timestamp to maintain conversation order

    // Fetch the user document using _id to get the friends list
    const user = await User.findById(user._id); // Using _id as per MongoDB's default

    // Check if the user has friends, and extract their friend data
    const friends = user ? user.friends : [];

    // Respond with both chat history and the friends list
    return res.status(200).json({ messages, friends });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).send("Server error");
  }
};
