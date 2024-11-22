const { name } = require("ejs");
const mongoose = require("mongoose");
const signupSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      required: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verificationToken: String,
    verificationTokenExpire: Date,
    friends: [
      {
        email: { type: String, required: false },
        name: { type: String, required: false },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", signupSchema);

module.exports = { User };
