const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/verifyToken"); 
const { 
    addFriend,
    removeFriend,
    getFriends,
    getPotentialFriends 
} = require("../controllers/friends.controller");

router.post("/add/:id", verifyToken, addFriend);
router.delete("/remove/:id", verifyToken, removeFriend);
router.get("/list", verifyToken, getFriends);
router.get("/potential", verifyToken, getPotentialFriends);

module.exports = router;