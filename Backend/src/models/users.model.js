const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const signupSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    bio: { type: String },
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verificationToken: String,
    verificationTokenExpire: Date,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    isPrivate: {
        type: Boolean,
        default: false,
      },
}, { timestamps: true });

signupSchema.index({ email: 1 }, { unique: true });

// Optionally, index lastLogin to quickly query recently active users
signupSchema.index({ lastLogin: -1 });

signupSchema.index({ friends: 1 });
signupSchema.index({ blocked: 1 });
signupSchema.index({ savedPosts: 1 });

// Handle related data deletion when a User is deleted
signupSchema.pre('findOneAndDelete', async function(next) {
    const session = await mongoose.startSession(); // Start a new session for the transaction
    try {
        session.startTransaction(); // Start the transaction
        const doc = await this.model.findOne(this.getQuery()).session(session);
        if (doc) {
            // Remove user from likes, comments, savedBy in Posts, and delete all their posts and comments
            const posts = await mongoose.model('Post').find({ user: doc._id }, '_id', { session });
            const postIds = posts.map(post => post._id);
            await mongoose.model('Post').updateMany({}, { $pull: { likes: doc._id, savedBy: doc._id, 'comments': { user: doc._id } } }, { session });
            await mongoose.model('Comment').deleteMany({ user: doc._id }, { session });
            await mongoose.model('Post').deleteMany({ user: doc._id }, { session });

            // Remove the user from friends, blocked lists, and savedPosts references of other users
            await mongoose.model('User').updateMany({}, { $pull: { friends: doc._id, blocked: doc._id, savedPosts: { $in: postIds } } }, { session });

            // Delete all friend requests sent by or to this user
            await mongoose.model('FriendRequest').deleteMany({ $or: [{ sentBy: doc._id }, { sentTo: doc._id }] }, { session });
        }

        await session.commitTransaction(); // Commit the transaction if all operations succeed
        session.endSession(); // End the session
        next();
    } catch (error) {
        await session.abortTransaction(); // Abort the transaction on error
        session.endSession(); // End the session
        next(error); // Pass the error to the next middleware
    }
});

const User = mongoose.model("User", signupSchema);
module.exports = { User };