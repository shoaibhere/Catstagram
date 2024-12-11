const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/verifyToken");
const {
  sendFriendRequest,
  approveFriendRequest,
  declineFriendRequest,
  getPendingFriendRequests,
  removeFriend,
  getFriends,
  getPotentialFriends,
  deleteSentFriendRequest,
} = require("../controllers/friends.controller");

// Send a friend request
router.post("/request/:id", verifyToken, sendFriendRequest);

// Approve a friend request
router.post("/request/approve/:id", verifyToken, approveFriendRequest);

// Decline a friend request
router.post("/request/decline/:id", verifyToken, declineFriendRequest);

// Remove a friend
router.delete("/remove/:id", verifyToken, removeFriend);

// Get the list of friends
router.get("/list", verifyToken, getFriends);

// Get potential friends (users who are not already friends)
router.get("/potential", verifyToken, getPotentialFriends);

// Get pending friend requests for the current user
router.get("/requests", verifyToken, getPendingFriendRequests);

router.delete("/request/:id", verifyToken, deleteSentFriendRequest);

module.exports = router;
