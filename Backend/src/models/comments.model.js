const mongoose = require("mongoose");

const badWords = [
  "abuse",
  "hate",
  "kill",
  "dumb",
  "stupid",
  "pussy",
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

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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

// Pre-save hook to check for offensive words
commentSchema.pre("save", function (next) {
  const offensiveWordsFound = badWords.filter((word) =>
    new RegExp(`\\b${word}\\b`, "i").test(this.text)
  );

  if (offensiveWordsFound.length > 0) {
    const error = new Error(
      `Your comment contains prohibited words: ${offensiveWordsFound.join(", ")}`
    );
    return next(error);
  }

  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment };
