const { User } = require("../models/users.model");
const { Post } = require("../models/posts.model");

// Save a post
const savePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if post is already saved by the user
    if (user.savedPosts.includes(postId)) {
      return res.status(400).json({ message: "Post already saved" });
    }

    // Add the post to the user's savedPosts array
    user.savedPosts.push(postId);
    await user.save();

    // Add the user to the post's savedBy array
    post.savedBy.push(userId);
    await post.save();

    res.status(200).json({ message: "Post saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Remove a saved post
const unsavePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Remove the post from the user's savedPosts array
    user.savedPosts = user.savedPosts.filter((id) => id.toString() !== postId);
    await user.save();

    // Remove the user from the post's savedBy array
    post.savedBy = post.savedBy.filter((id) => id.toString() !== userId);
    await post.save();

    res.status(200).json({ message: "Post unsaved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

const getSavedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user._id;  // Assuming you extract the current user's ID from authentication middleware

    const user = await User.findById(userId).populate({
      path: "savedPosts",
      populate: {
        path: "user",
        select: "name profileImage isPrivate friends"
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out posts that the current user should not see
    const visiblePosts = user.savedPosts.filter(post => {
      const postOwner = post.user;
      // Check if the post owner has a private account and if the current user is not their friend
      return !postOwner.isPrivate || postOwner.friends.includes(currentUser.toString()) || postOwner._id.toString() === currentUser.toString();
    });

    res.status(200).json(visiblePosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};


module.exports = { savePost, unsavePost, getSavedPosts };
