const { User } = require("../models/users.model");

// Add friend
const addFriend = async (req, res) => {
  try {
    const friendId = req.params.id;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    await User.findByIdAndUpdate(userId, {
      $push: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $push: { friends: userId },
    });

    res.status(200).json({ message: "Friend added successfully" });
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
  addFriend,
  removeFriend,
  getFriends,
  getPotentialFriends,
};
