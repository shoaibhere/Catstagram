const express = require("express");
const signup = require("../controllers/users.controllers");
const upload = require("../middlewares/multer.middleware");
const { User } = require("../models/users.model");
const { sendWelcomeEmail } = require("../../mailtrap/email.js");
const router = express.Router();

router.post("/signup", upload.single("profilePicture"), signup);
const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      message: "Email verified successfully",
      ...user._doc,
      password: undefined,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
};
router.post("/verify-email", verifyEmail);
module.exports = router;
