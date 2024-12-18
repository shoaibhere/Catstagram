const { Post } = require("../models/posts.model");
const { User } = require("../models/users.model");

// Helper function to handle pagination and query parameters
function getPaginationParams(query) {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// Fetch all posts with pagination
const getPosts = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const posts = await Post.find()
      .populate("user", "name profileImage")
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
      error: error.message
    });
  }
};

// Fetch posts by specific user ID with pagination
const getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select("name profileImage email");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { page, limit, skip } = getPaginationParams(req.query);

    const posts = await Post.find({ user: userId })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: {
        user: user,
        posts: posts
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
      error: error.message
    });
  }
};

module.exports = { getPosts, getPostsByUserId };
