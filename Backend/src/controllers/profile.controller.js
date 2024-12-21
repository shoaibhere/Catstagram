const { User } = require("../models/users.model");
const { Post } = require("../models/posts.model");
const cloudinary = require("cloudinary").v2;

const deleteAccount = async (req, res) => {
  const session = await mongoose.startSession(); // Start a session for transaction
  session.startTransaction();

  try {
    const userId = req.params.id;

    // Delete all posts by the user
    await Post.deleteMany({ user: userId }).session(session);

    // Remove the user from other users' friends lists
    await User.updateMany(
      { friends: userId },
      { $pull: { friends: userId } }
    ).session(session);

    // Delete the user account
    await User.findByIdAndDelete(userId).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Clear the cookie
    res.clearCookie("token");

    res.status(200).json({ message: "Account deleted successfully and related posts removed" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Error deleting account. Please try again." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, bio } = req.body;
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
  try {
    const userId = req.params.id;

    // Validate user ID
    if (!userId) {
      return res.status(400).json({ error: "User ID not provided" });
    }

    // Get post count
    const postCount = await Post.countDocuments({ user: userId });
    // Get user and friends count
    const user = await User.findById(userId).select("friends");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friendsCount = user.friends?.length || 0;
    res.status(200).json({ postCount, friendsCount });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Error fetching user stats" });
  }
};

//function to get user profile by id
const getProfileById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deleteAccount,
  updateProfile,
  getUserStats,
  getProfileById,
};
