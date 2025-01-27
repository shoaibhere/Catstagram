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
  "pussy",
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

const pendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  verificationToken: { type: String, required: true },
  verificationTokenExpire: { type: Date, required: true },
});

// Pre-save hook to check for offensive words in the name
pendingUserSchema.pre("save", function (next) {
  const offensiveWordsFound = badWords.filter((word) =>
    new RegExp(`\\b${word}\\b`, "i").test(this.name)
  );

  if (offensiveWordsFound.length > 0) {
    const error = new Error(
      `The name contains prohibited words: ${offensiveWordsFound.join(", ")}`
    );
    return next(error);
  }

  next();
});

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
module.exports = { PendingUser };
