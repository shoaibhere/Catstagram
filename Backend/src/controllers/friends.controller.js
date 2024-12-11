const { User } = require("../models/users.model");
const { FriendRequest } = require("../models/friendRequest.model"); // Import the FriendRequest model

// Send a friend request
const sendFriendRequest = async (req, res) => {
  try {
    const { id: friendId } = req.params;
    const userId = req.userId;

    // Check if a request already exists or if they are already friends
    const existingRequest = await FriendRequest.findOne({
      sentBy: userId,
      sentTo: friendId,
    });

    const user = await User.findById(userId);
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Create and save the friend request
    const friendRequest = new FriendRequest({
      sentBy: userId,
      sentTo: friendId,
    });
    await friendRequest.save();

    res.status(200).json({ message: "Friend request sent successfully" });
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
    const pendingRequests = await FriendRequest.find({
      sentTo: userId,
    }).populate("sentBy", "name email profileImage");

    res.status(200).json(pendingRequests);
  } catch (error) {
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
    const user = await User.findById(req.userId).populate(
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

module.exports = {
  sendFriendRequest,
  approveFriendRequest,
  declineFriendRequest,
  getPendingFriendRequests,
  removeFriend,
  getFriends,
  getPotentialFriends,
};
