const { User } = require("../models/users.model.js");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const generateTokenSetCookie = require("../utils/cookie.js");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} = require("../../mailtrap/email.js");
const crypto = require("crypto");
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

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    generateTokenSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();
    res
      .status(200)
      .json({ message: "Login successful", ...user._doc, password: undefined });
  } catch (error) {
    console.log("Login Function Error: " + error.message);
    throw new Error("Failed to login: " + error.message);
  }
};
const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiresAt;
    await user.save();

    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.log("Forgot Password Function Error: " + error.message);
    res.status(400).json({ message: "Failed to reset password" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid  token" + token });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    await sendResetSuccessEmail(user.email);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("Reset Password Function Error: " + error.message);
    res.status(400).json({ message: "Failed to reset password" });
  }
};

const checkAuth = async (req, res) => {
  try {
    console.log("before");
    const user = await User.findById(req.user.id).select("-password"); //select shows everything in user minus
    console.log("helloooooooo");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Check Auth Function Error: " + error.message);
    res
      .status(400)
      .json({ message: "Failed to check authentication" + error.message });
  }
};
module.exports = {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
};
