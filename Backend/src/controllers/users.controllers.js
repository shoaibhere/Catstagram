const { User } = require("../models/users.model.js");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const generateTokenSetCookie = require("../utils/cookie.js");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../../mailtrap/email.js");

const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const file = req.file; // Access uploaded file

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(Math.random() * 1000000);

    // Upload profile picture to Cloudinary (optional)
    let profileImageUrl = "";
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        width: 150,
        height: 150,
        crop: "fill",
      });
      profileImageUrl = result.secure_url;
    }

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000,
      profileImage: profileImageUrl,
    });

    await newUser.save();
    generateTokenSetCookie(res, newUser._id);

    await sendVerificationEmail(newUser.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

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
module.exports = { signup, verifyEmail };
