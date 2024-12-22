const { User } = require("../models/users.model");
const { Post } = require("../models/posts.model");
const cloudinary = require("cloudinary").v2;

const deleteAccount = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.clearCookie("token");
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting account" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, bio, isPrivate } = req.body; // Add isPrivate to destructured fields
    let profileImage = req.user?.profileImage;

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        profileImage = result.secure_url;
      } catch (cloudinaryError) {
        return res
          .status(500)
          .json({ error: "Failed to upload profile image" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        bio,
        profileImage,
        isPrivate: isPrivate === "true",
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserStats = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID not provided" });
  }
  const postCount = await Post.countDocuments({ user: userId });
  const user = await User.findById(userId).select("friends");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const friendsCount = user.friends?.length || 0;
  res.status(200).json({ postCount, friendsCount });
};

const getProfileById = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).select("-password");
  res.status(200).json(user);
};

const checkIfBlocked = async (req, res) => {
  const { userId, profileId } = req.params;
  const user = await User.findById(userId);
  const profile = await User.findById(profileId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const isBlocked = profile.blocked.includes(userId);
  res.status(200).json({ isBlocked });
};
  
module.exports = {
  deleteAccount,
  updateProfile,
  getUserStats,
  getProfileById,
  checkIfBlocked
};
