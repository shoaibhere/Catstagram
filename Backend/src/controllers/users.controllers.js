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
const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Check if all fields are provided
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userNameExists = await User.findOne({ name });
    if (userNameExists) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }
    // Check if the name exceeds 15 characters
    if (name.length > 15) {
      throw new Error("Username must not exceed 15 characters");
    }

    // Check if the user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Check if the email is already pending verification
    const pendingUser = await PendingUser.findOne({ email });
    if (pendingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already pending verification",
      });
    }

    // Generate verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save to a temporary collection (consider hashing the password)
    const pendingUserData = new PendingUser({
      email,
      password, // You should hash the password before saving it
      name,
      verificationToken,
      verificationTokenExpire: Date.now() + 1 * 60 * 60 * 1000, // Token expires in 1 hours
    });

    await pendingUserData.save();
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message:
        "Verification email sent. Please verify your email to complete registration.",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

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

    // Move verified user to the main Users collection
    const user = new User({
      email: pendingUser.email,
      password: pendingUser.password, // Use the already hashed password
      name: pendingUser.name,
      isVerified: true,
    });
    
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    
    // Remove the pending user record
    await PendingUser.deleteOne({ email: pendingUser.email });

    generateTokenSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateTokenSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    const userResponse = { ...user.toObject(), password: undefined }; // Ensure password is not included in the response
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: userResponse,
      token: token,
    });
  } catch (error) {
    console.error("Error in login: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true, // Match the httpOnly setting used during set-cookie
    secure: true, // Match the secure setting
    sameSite: "none", // Match the sameSite setting
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
  
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 36000000); // Adds 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiresAt;

    await user.save();

    // send email
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
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = password; // The new password, which will be hashed by the pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save(); // The pre-save hook hashes the password before saving

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Error resetting password",
    });
  }
};

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

    const newToken = generateTokenSetCookie(res, userId); // Optionally re-authenticate the user

    res.json({
      message: "Password changed successfully",
      token: newToken,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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
const blockUser = async (req, res) => {
  const token = req.cookies.token; // This assumes the cookie is named 'token'
  const { userIdToBlock } = req.body; // Assume IDs are provided in the request body

  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in your .env file
    const userId = decoded.userId; // Extract userId from the token

    // Find the current user by ID extracted from token
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "Current user not found" });
    }

    // Check if the user to block exists
    const userToBlock = await User.findById(userIdToBlock);
    if (!userToBlock) {
      return res
        .status(404)
        .json({ success: false, message: "User to block not found" });
    }

    // Check if the user is already blocked
    if (currentUser.blocked.includes(userIdToBlock)) {
      return res
        .status(400)
        .json({ success: false, message: "User is already blocked" });
    }

    // Add the user to the blocked list
    currentUser.blocked.push(userIdToBlock);
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: ` User ${userToBlock.name} blocked successfully`,
      blocked: currentUser.blocked,
    });
  } catch (error) {
    console.log("Error in blockUser: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const unblockUser = async (req, res) => {
  const token = req.cookies.token;
  const { userIdToUnblock } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "Current user not found" });
    }

    // Check if the user is in the blocked list
    if (!currentUser.blocked.includes(userIdToUnblock)) {
      return res
        .status(400)
        .json({ success: false, message: "User is not blocked" });
    }

    // Remove the user from the blocked list
    currentUser.blocked = currentUser.blocked.filter(
      (blockedUserId) => blockedUserId.toString() !== userIdToUnblock
    );
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: `User unblocked successfully`,
      blocked: currentUser.blocked,
    });
  } catch (error) {
    console.log("Error in unblockUser: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { blockUser, unblockUser };

module.exports = {
  blockUser,
  unblockUser,
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  checkAuth,
};
