const express = require("express");
const signup = require("../controllers/users.controllers");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();

router.post("/signup", upload.single("profileImage"), signup);

module.exports = router;
