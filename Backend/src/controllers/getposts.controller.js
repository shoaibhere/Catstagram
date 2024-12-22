const { Post } = require("../models/posts.model");
const { User } = require("../models/users.model");

function getPaginationParams(query) {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  return { page, limit };
}

const getPosts = async (req, res) => {
  try {
    const currentUser = req.params.currentuserid;
    const { page, limit } = getPaginationParams(req.query);
    const search = req.query.search || '';

    // Fetch the current user and their blocked list
    const currentUserDetails = await User.findById(currentUser);
    const blockedUserIds = currentUserDetails.blocked || [];

    // Fetch private users not friends
    const privateAndNotFriends = await User.find({
      _id: { $nin: [currentUser, ...currentUserDetails.friends] },
      isPrivate: true
    }).select("_id");
    const privateAndNotFriendIds = privateAndNotFriends.map(user => user._id.toString());

    // Combine IDs to exclude from the posts
    const excludeUserIds = [...blockedUserIds, ...privateAndNotFriendIds];

    // Create a search query if there is a search term
    const searchQuery = search ? {
      $or: [
        { caption: { $regex: search, $options: 'i' } }, // Search by caption
        { 'user.name': { $regex: search, $options: 'i' } } // Search by user name
      ]
    } : {};

    // Total count of posts (for pagination calculation)
    const totalPosts = await Post.countDocuments({
      $and: [
        { user: { $nin: excludeUserIds } },
        searchQuery
      ]
    });

    // Fetch the posts with pagination and search
    const posts = await Post.find({
      $and: [
        { user: { $nin: excludeUserIds } },
        searchQuery
      ]
    })
    .populate("user", "name profileImage")
    .populate("comments", "text createdAt user")
    .sort({ createdAt: -1 }) // Sorting by creation time, newest first
    .skip((page - 1) * limit)
    .limit(limit);

    res.json({
      success: true,
      data: posts,
      pagination: {
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page
      }
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




const getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUser = req.params.currentuserid;

    const user = await User.findById(userId).select("name profileImage email blocked");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.blocked.includes(currentUser)) {
      return res.status(403).json({ success: false, message: "The User has blocked you" });
    }

    const posts = await Post.find({ user: userId })
      .populate("user", "name profileImage")
      .populate({
        path: "comments",
        select: "text createdAt user",
        populate: { path: "user", select: "name profileImage" }
      })
      .sort({ createdAt: -1 });
      posts.forEach((post) => {
        if (!post.comments) post.comments = [];
      });


    res.status(200).json({
      success: true,
      data: {
        user: user,
        posts: posts
      }
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
