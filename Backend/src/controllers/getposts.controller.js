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
    const { limit } = getPaginationParams(req.query);

    // Fetch blocked users for the current user
    const blockedUsers = await User.find({ blocked: currentUser }).select("_id");
    const blockedUserIds = blockedUsers.map((user) => user._id);

    // Use aggregation pipeline with $match and $sample
    const posts = await Post.aggregate([
      {
        $match: {
          user: { $nin: blockedUserIds }, // Exclude posts by blocked users
        },
      },
      { $sample: { size: limit } }, // Randomly sample 'limit' posts
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          comments: {
            $cond: {
              if: { $isArray: "$comments" },
              then: "$comments",
              else: [],
            },
          }, // Ensure comments is always an array
        },
      },
      {
        $project: {
          "user.password": 0, // Exclude sensitive fields
          "comments.user.password": 0,
        },
      },
    ]);

    // Count total posts matching the criteria
    const totalPosts = await Post.countDocuments({
      user: { $nin: blockedUserIds },
    });

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
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
