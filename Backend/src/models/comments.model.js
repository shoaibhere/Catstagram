const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref:"User",
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
// Index on user to quickly find comments made by a specific user
commentSchema.index({ user: 1 });

// Optionally, index on createdAt to sort comments by date
commentSchema.index({ createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment };
