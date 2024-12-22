const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema(
  {
    sentBy: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId
      ref: "User", // Reference the User model
      required: true,
    },
    sentTo: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId
      ref: "User", // Reference the User model
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Composite index on sentBy and sentTo for quickly checking existing friend requests
friendRequestSchema.index({ sentBy: 1, sentTo: 1 }, { unique: true });

// Index each field separately if queries frequently involve only one of these fields
friendRequestSchema.index({ sentBy: 1 });
friendRequestSchema.index({ sentTo: 1 });

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

module.exports = { FriendRequest };
