const mongoose = require("mongoose");

const badWords = [
  "abuse",
  "hate",
  "kill",
  "dumb",
  "stupid",
  "idiot",
  "ugly",
  "loser",
  "trash",
  "bastard",
  "moron",
  "jerk",
  "fool",
  "nonsense",
  "crazy",
  "psycho",
  "racist",
  "sexist",
  "pervert",
  "slut",
  "whore",
  "prostitute",
  "suck",
  "hell",
  "damn",
  "bloody",
  "nasty",
  "retard",
  "creep",
  "pussy",
  "dick",
  "cock",
  "asshole",
  "bitch",
  "cunt",
  "faggot",
  "penis",
  "vagina",
  "boobs",
  "tits",
  "cum",
  "horny",
  "prick",
  "hoe",
];

const postSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true, maxLength: 500 },
    image: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Array of Comment IDs
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Index on user to efficiently fetch posts by a specific user
postSchema.index({ user: 1 });

// Index on createdAt for sorting posts by date
postSchema.index({ createdAt: -1 });

// Pre-save hook to filter bad words in the caption
postSchema.pre("save", function (next) {
  const offensiveWordsFound = badWords.filter((word) =>
    new RegExp(`\\b${word}\\b`, "i").test(this.caption)
  );

  if (offensiveWordsFound.length > 0) {
    const error = new Error(
      `The caption contains prohibited words: ${offensiveWordsFound.join(", ")}`
    );
    return next(error);
  }

  next();
});
// Index on user to efficiently fetch posts by a specific user
postSchema.index({ user: 1 });

// Index on createdAt for sorting posts by date
postSchema.index({ createdAt: -1 });

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
