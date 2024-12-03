const { Post } = require("../models/posts.model");
const { User } = require("../models/users.model");

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch posts and populate the user field with name and profileImage
    const posts = await Post.find()
      .populate("user", "name profileImage") // Populate the 'user' field with 'name' and 'profileImage'
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
    });
  }
};

// New function to get posts by specific user ID
const getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // First, verify that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find posts by the specific user and populate user details
    const posts = await Post.find({ user: userId })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          profileImage: user.profileImage,
          email: user.email,
        },
        posts: posts,
      },
      pagination: {
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user's posts",
    });
  }
};

module.exports = { getPosts, getPostsByUserId };
