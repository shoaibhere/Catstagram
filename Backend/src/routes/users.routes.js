const express = require("express");
const upload = require("../middlewares/multer.middleware");
const { User } = require("../models/users.model");
const { verifyToken } = require("../middlewares/verifyToken.js");
const {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  checkAuth,
  blockUser,
  unblockUser,
} = require("../controllers/users.controllers");
const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", upload.single("profileImage"), signup);

router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", changePassword);
router.post("/block-user", blockUser);
router.post("/unblock-user", unblockUser);

module.exports = router;
