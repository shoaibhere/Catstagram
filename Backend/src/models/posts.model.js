const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
      maxLength: 500, // Optional: Limit the caption length
    },
    imageUrl: {
      type: String,
      required: false, // The post can also be text-only, so image is optional
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Reference to the User who posted
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // List of users who liked the post
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",  // Reference to the user who commented
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // List of users who saved the post
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
