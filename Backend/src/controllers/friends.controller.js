const { User } = require("../models/users.model");

const { FriendRequest } = require("../models/friendRequest.model");

// Send a friend request
const sendFriendRequest = async (req, res) => {
  try {
    const { id: friendId } = req.params;
    const userId = req.userId;

    // Get the user and the target friend from the database
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    // Check if the user is blocked by the friend
    if (
      friend.blocked.some(
        (blockedUser) => blockedUser._id.toString() === userId
      )
    ) {
      return res.status(400).json({
        message: "You are blocked by this user. Cannot send a friend request.",
      });
    }

    // Check if a friend request already exists or if they are already friends
    const existingRequest = await FriendRequest.findOne({
      "sentBy._id": userId,
      "sentTo._id": friendId,
    });

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Create and save the friend request
    const friendRequest = new FriendRequest({
      sentBy: user, // Store the entire user object
      sentTo: friend, // Store the entire friend object
    });
    await friendRequest.save();

    // Return the friend request ID in the response
    res.status(200).json({
      message: "Friend request sent successfully",
      requestId: friendRequest._id, // Send the request ID back to the frontend
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve a friend request
const approveFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params; // Request ID from URL params
    const userId = req.userId; // Current user (approver) ID from token

    // Find the friend request by requestId
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(400).json({ message: "Invalid or expired request" });
    }

    // Check if the current user is the intended recipient of the request
    if (friendRequest.sentTo.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to approve this request" });
    }

    // Add the users to each other's friends list
    await User.findByIdAndUpdate(userId, {
      $push: { friends: friendRequest.sentBy }, // Add sender to the approver's friend list
    });
    await User.findByIdAndUpdate(friendRequest.sentBy, {
      $push: { friends: userId }, // Add approver to the sender's friend list
    });

    // Delete the friend request after approval
    await FriendRequest.findByIdAndDelete(requestId);

    res
      .status(200)
      .json({ message: "Friend request approved and users are now friends" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Decline a friend request
const declineFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const userId = req.userId;

    // Find and verify the friend request
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest || friendRequest.sentTo.toString() !== userId) {
      return res.status(400).json({ message: "Invalid or expired request" });
    }

    // Remove the friend request without adding friends
    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending friend requests (for the current user)
const getPendingFriendRequests = async (req, res) => {
  try {
    const userId = req.userId;

    // Find friend requests where the user is the recipient
    const pendingRequests = await FriendRequest.find({ sentTo: userId })
      .populate("sentBy") // Populate the full `User` object for the sender
      .populate("sentTo"); // Populate the full `User` object for the receiver

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: error.message });
  }
};

const getSentFriendRequests = async (req, res) => {
  try {
    const userId = req.userId;

    // Find friend requests where the user is the recipient
    const pendingRequests = await FriendRequest.find({ sentBy: userId })
      .populate("sentBy") // Populate the full `User` object for the sender
      .populate("sentTo"); // Populate the full `User` object for the receiver

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: error.message });
  }
};

// Remove friend
const removeFriend = async (req, res) => {
  try {
    const friendId = req.params.id;
    const userId = req.userId;

    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId },
    });

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's friends
const getFriends = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate(
      "friends",
      "name email profileImage"
    );

    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get potential friends (users who are not friends)
const getPotentialFriends = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const users = await User.find(
      {
        _id: {
          $nin: [...user.friends, user._id],
        },
      },
      "name email profileImage"
    );

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteSentFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params; // Friend request ID from params
    const userId = req.userId; // Authenticated user ID (sender)

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Check if the current user is the sender of the friend request
    if (friendRequest.sentBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this request" });
    }

    // Delete the friend request
    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Friend request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkFriendStatus = async (req, res) => {
  try {
    const { id: targetUserId } = req.params;
    const currentUserId = req.userId;

    if (targetUserId === currentUserId) {
      return res.status(200).json({
        isFriend: false,
        isOwnProfile: true,
        isPublic: true,
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBlocked = targetUser.blocked.includes(currentUserId);
    if (isBlocked) {
      return res.status(200).json({
        isFriend: false,
        isOwnProfile: false,
        isPublic: false,
        isBlocked: true,
      });
    }

    const isFriend = targetUser.friends.includes(currentUserId);

    if (targetUser.isPrivate) {
      return res.status(200).json({
        isFriend,
        isOwnProfile: false,
        isPublic: false,
      });
    }
    res.status(200).json({
      isFriend,
      isOwnProfile: false,
      isPublic: true,
      isBlocked: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendFriendRequest,
  approveFriendRequest,
  declineFriendRequest,
  getPendingFriendRequests,
  removeFriend,
  getFriends,
  getPotentialFriends,
  deleteSentFriendRequest,
  getSentFriendRequests,
  checkFriendStatus,
};
