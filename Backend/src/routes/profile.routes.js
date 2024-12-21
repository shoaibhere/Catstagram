const router = require("express").Router();
const { verifyToken } = require("../middlewares/verifyToken");
const upload = require("../middlewares/multer.middleware");
const {
  deleteAccount,
  updateProfile,
  getUserStats,
  getProfileById,
  checkIfBlocked,
} = require("../controllers/profile.controller");

router.get("/getProfile/:id", verifyToken, getProfileById);
router.delete("/delete-account/:id", verifyToken, deleteAccount);
router.put(
  "/update-profile/:id",
  verifyToken,
  upload.single("profileImage"),
  updateProfile
);
router.get("/stats/:id", verifyToken, getUserStats);
router.get("/check-blocked/:userId/:profileId", verifyToken, checkIfBlocked);


module.exports = router;
