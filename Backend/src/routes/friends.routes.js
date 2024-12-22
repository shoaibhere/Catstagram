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
  getSentFriendRequests,
  getUserWithFriendRequestStatus,
  checkFriendStatus,
} = require("../controllers/friends.controller");

router.post("/request/:id", verifyToken, sendFriendRequest);

router.post("/request/approve/:id", verifyToken, approveFriendRequest);

router.post("/request/decline/:id", verifyToken, declineFriendRequest);

router.delete("/remove/:id", verifyToken, removeFriend);

router.get("/list/:id", verifyToken, getFriends);

router.get("/check/:id", verifyToken, checkFriendStatus);

router.get("/potential", verifyToken, getPotentialFriends);

router.get("/requests/pending", verifyToken, getPendingFriendRequests);

router.get("/requests/sent", verifyToken, getSentFriendRequests);

router.get("/status/:userId", verifyToken, getUserWithFriendRequestStatus);

router.delete("/request/:id", verifyToken, deleteSentFriendRequest);

module.exports = router;
