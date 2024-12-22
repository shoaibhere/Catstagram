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
friendRequestSchema.post('save', async function(doc, next) {
  if (doc.status === "approved" || doc.status === "declined") {
      await doc.remove(); // This deletes the current document after saving changes
  }
  next();
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

module.exports = { FriendRequest };
