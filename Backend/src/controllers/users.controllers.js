const crypto = require("crypto");
const { User } = require("../models/users.model.js");
const { PendingUser } = require("../models/pendingUser.model.js");
const bcryptjs = require("bcryptjs");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const generateTokenSetCookie = require("../utils/cookie.js");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} = require("../../mailtrap/email.js");

// Utility function to generate and set token in cookie
const generateTokenSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.cookie('token', token, {
    httpOnly: true, // ensures that the cookie is only accessible by the server
    secure: process.env.NODE_ENV === 'production', // set to true in production for HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiration time
  });

  return token;
};

// Signup route
const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const pendingUser = await PendingUser.findOne({ email });
    if (pendingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already pending verification",
      });
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const pendingUserData = new PendingUser({
      email,
      password, 
      name,
      verificationToken,
      verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000, // Token expires in 24 hours
    });

    await pendingUserData.save();
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: "Verification email sent. Please verify your email to complete registration.",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Email verification route
const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const pendingUser = await PendingUser.findOne({
      verificationToken: code,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    const user = new User({
      email: pendingUser.email,
      password: pendingUser.password, // Use already hashed password
      name: pendingUser.name,
      isVerified: true,
    });

    await user.save();
    await sendWelcomeEmail(user.email, user.name);

    await PendingUser.deleteOne({ email: pendingUser.email });

    generateTokenSetCookie(res, user._id); // Set token as cookie

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined, // Don't return password
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login route
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    generateTokenSetCookie(res, user._id); // Set token as cookie
    user.lastLogin = new Date();
    await user.save();

    const userResponse = { ...user.toObject(), password: undefined };
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error in login: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Logout route
const logout = async (req, res) => {
  res.clearCookie("token"); // Clears the token cookie
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Forgot Password route
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 36000000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiresAt;

    await user.save();

    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Reset Password route
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = password; // The new password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save(); // The pre-save hook will hash the password

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Error resetting password",
    });
  }
};

// Change Password route
const changePassword = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = newPassword; // Set new password, which will be hashed by the pre-save hook
    await user.save();

    generateTokenSetCookie(res, userId); // Optionally re-authenticate the user

    res.json({
      message: "Password changed successfully",
      token: req.cookies.token, // Send updated token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Auth check route (protected route)
const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Block User route
const blockUser = async (req, res) => {
  const token = req.cookies.token;
  const { userIdToBlock } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "Current user not found" });
    }

    const userToBlock = await User.findById(userIdToBlock);
    if (!userToBlock) {
      return res.status(404).json({ success: false, message: "User to block not found" });
    }

    if (currentUser.blocked.includes(userIdToBlock)) {
      return res.status(400).json({ success: false, message: "User is already blocked" });
    }

    currentUser.blocked.push(userIdToBlock);
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: `User ${userToBlock.name} blocked successfully`,
      blocked: currentUser.blocked,
    });
  } catch (error) {
    console.log("Error in blockUser: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  checkAuth,
  blockUser,
};
