const { User } = require("../models/users.model");

const { FriendRequest } = require("../models/friendRequest.model");

const sendFriendRequest = async (req, res) => {
  const sentToId = req.params.id; // Extract the recipient's ID from request parameters
  const sentById = req.userId; // Assuming the authenticated user's ID is stored in req.userId

  try {
    if (sentById.toString() === sentToId) {
      return res
        .status(400)
        .json({ message: "Cannot send a friend request to yourself." });
    }

    // Ensure both users exist
    const sender = await User.findById(sentById);
    const recipient = await User.findById(sentToId);
    if (!sender || !recipient) {
      return res.status(404).json({ message: "One or both users not found." });
    }

    // Check existing requests or if already friends
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sentBy: sentById, sentTo: sentToId },
        { sentBy: sentToId, sentTo: sentById },
      ],
    });
    const areAlreadyFriends = sender.friends.includes(sentToId);
    const isBlocked = recipient.blocked.includes(sentById);
    const hasBeenBlocked = sender.blocked.includes(sentToId);

    if (existingRequest) {
      return res
        .status(409)
        .json({
          message: "Friend request already exists or has been handled.",
        });
    }

    if (isBlocked) {
      return res
        .status(409)
        .json({
          message: "You have been blocked by this user.",
        });
    }

    if (hasBeenBlocked) {
      return res
        .status(409)
        .json({
          message: "Can't send, You blocked this user.",
        });
    }


    if (areAlreadyFriends) {
      return res.status(409).json({ message: "Users are already friends." });
    }

    // Create and save the friend request
    const newRequest = new FriendRequest({
      sentBy: sentById,
      sentTo: sentToId,
      status: "pending",
    });
    await newRequest.save();

    res.status(201).json({
      message: "Friend request sent successfully.",
      request: {
        id: newRequest._id,
        status: newRequest.status,
        sentTo: {
          id: recipient._id,
          name: recipient.name,
        },
        sentBy: {
          id: sender._id,
          name: sender.name,
        },
      },
    });
  } catch (error) {
    console.error("Error sending friend request: ", error);
    res
      .status(500)
      .json({ message: "Internal server error while sending friend request." });
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


const getPotentialFriends = async (req, res) => {
  try {
    const currentUserId = req.userId;

    // Fetch all friend requests involving the current user (either sent or received)
    const friendRequests = await FriendRequest.find({
      $or: [{ sentBy: currentUserId }, { sentTo: currentUserId }],
      status: "pending", // Optional: filter by pending status if necessary
    });

    // Extract user IDs from these friend requests to exclude them from potential friends
    const requestedUserIds = friendRequests.reduce((acc, req) => {
      acc.add(req.sentBy.toString());
      return acc;
    }, new Set());

    // Fetch the current user to include their friends and themselves in the exclusion list
    const currentUser = await User.findById(currentUserId);

    // Include current user's friends and their own ID in the exclusion set
    currentUser.friends.forEach((friend) =>
      requestedUserIds.add(friend.toString())
    );
    requestedUserIds.add(currentUserId);

    const users = await User.find(
      { _id: { $nin: Array.from(requestedUserIds) } },
      "name email profileImage isPrivate" // Select only the necessary fields
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching potential friends:", error);
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

const getUserWithFriendRequestStatus = async (req, res) => {
  try {
    const { userId } = req.params; // the ID of the user to retrieve
    const currentUser = req.userId; // ID of the requesting user from auth middleware

    const user = await User.findById(userId)
      .select("name email profileImage")
      .lean(); // Convert to plain JS object for easy manipulation

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if there's an existing friend request between the currentUser and the retrieved user
    const friendRequest = await FriendRequest.findOne({
      $or: [
        { sentBy: currentUser, sentTo: userId },
        { sentBy: userId, sentTo: currentUser },
      ],
    });

    const currentUserDetails = await User.findById(currentUser);
    const isBlocked = currentUserDetails.blocked.includes(userId.toString()); // Check if the user is blocked

    // Add friend request status and blocked status to the user object
    res.json({
      ...user,
      friendRequestStatus: friendRequest ? friendRequest.status : null,
      requestId: friendRequest ? friendRequest._id : null,
      isBlocked
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
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
  getUserWithFriendRequestStatus,
  checkFriendStatus,
};
