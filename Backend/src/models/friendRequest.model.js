const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema(
  {
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sentTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

module.exports = { FriendRequest };
