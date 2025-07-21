const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat.model");
const User = require("../models/users.model");
const Message = require("../models/message.model");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.userId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await Chat.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.userId, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await Chat.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Get unread message counts for all user's chats
//@route           GET /api/chat/unread-counts
//@access          Protected
const getUnreadCounts = asyncHandler(async (req, res) => {
  try {
    // Get all chats for the user
    const userChats = await Chat.find({
      users: { $elemMatch: { $eq: req.userId } },
    }).select("_id lastReadBy");

    const unreadCounts = {};

    // Process each chat to calculate unread count
    for (const chat of userChats) {
      const chatId = chat._id.toString();

      // Get user's last read timestamp for this chat
      const userLastRead = chat.lastReadBy?.get(req.userId) || new Date(0);

      // Count messages in this chat that are newer than user's last read
      // and not sent by the current user
      const unreadCount = await Message.countDocuments({
        chat: chat._id,
        createdAt: { $gt: userLastRead },
        sender: { $ne: req.userId },
      });

      // Only include in response if there are unread messages
      if (unreadCount > 0) {
        unreadCounts[chatId] = unreadCount;
      }
    }

    res.status(200).json(unreadCounts);
  } catch (error) {
    console.error("Error getting unread counts:", error);
    res.status(500);
    throw new Error("Failed to get unread counts");
  }
});

//@description     Mark chat as read for current user
//@route           PUT /api/chat/:chatId/mark-read
//@access          Protected
const markChatAsRead = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    // Verify chat exists and user is a member
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: req.userId } },
    });

    if (!chat) {
      res.status(404);
      throw new Error("Chat not found or you're not a member");
    }

    // Update the user's last read timestamp for this chat
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          [`lastReadBy.${req.userId}`]: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedChat) {
      res.status(404);
      throw new Error("Failed to mark chat as read");
    }

    res.status(200).json({
      success: true,
      message: "Chat marked as read",
      chatId: chatId,
      lastReadAt: new Date(),
    });
  } catch (error) {
    console.error("Error marking chat as read:", error);
    res.status(500);
    throw new Error("Failed to mark chat as read");
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.userId);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.userId,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

// @desc    Add user to Group
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

// @desc    Get group chat details
// @route   GET /api/chat/group/:chatId
// @access  Protected
const getGroupChatDetails = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!chat) {
      res.status(404);
      throw new Error("Chat Not Found");
    }

    if (!chat.isGroupChat) {
      res.status(400);
      throw new Error("This is not a group chat");
    }

    res.json(chat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  getUnreadCounts,
  markChatAsRead,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  getGroupChatDetails,
};
