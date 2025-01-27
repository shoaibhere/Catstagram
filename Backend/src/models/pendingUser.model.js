const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  verificationToken: { type: String, required: true },
  verificationTokenExpire: { type: Date, required: true },
});

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
module.exports = { PendingUser };

