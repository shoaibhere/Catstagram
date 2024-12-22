const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    caption: { type: String, required: true, maxLength: 500 },
    image: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],  // Array of Comment IDs
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

// Apply transaction to findOneAndDelete middleware
postSchema.pre('findOneAndDelete', async function(next) {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const post = await this.model.findOne(this.getQuery()).session(session);
        if (post) {
            // Delete all comments associated with this post
            if (post.comments.length > 0) {
                await mongoose.model('Comment').deleteMany({ _id: { $in: post.comments } }, { session });
            }

            // Remove this post from the savedPosts list of all users 
            await mongoose.model('User').updateMany(
                { savedPosts: post._id },
                { $pull: { savedPosts: post._id } },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();
        next();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
});

const Post = mongoose.model("Post", postSchema);
module.exports = { Post };
