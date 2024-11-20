const express = require("express");
const upload = require("../middlewares/multer.middleware");
const { User } = require("../models/users.model");
const { signup, verifyEmail } = require("../controllers/users.controllers");
const router = express.Router();

router.post("/signup", upload.single("profileImage"), signup);

router.post("/verify-email", verifyEmail);
module.exports = router;
