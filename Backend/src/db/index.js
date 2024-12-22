const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Comment } = require('../models/comments.model');
const { Post } = require('../models/posts.model');
const { FriendRequest } = require('../models/friendRequest.model');
const { User } = require('../models/users.model');
dotenv.config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    User.createIndexes();
    Post.createIndexes();
    Comment.createIndexes();
    FriendRequest.createIndexes();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
