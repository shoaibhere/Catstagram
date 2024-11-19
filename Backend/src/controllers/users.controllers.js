const user = require("../models/users.model");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const generateTokenSetCookie = require("../utils/cookie.js");

const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const file = req.file; // Access uploaded file

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await user.findOne({ email });
    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(Math.random() * 1000000);

    // Upload profile picture to Cloudinary (optional)
    let profileImageUrl = "";
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "profile_pictures",
        width: 150,
        height: 150,
        crop: "fill",
      });
      profileImageUrl = result.secure_url;
    }

    const newUser = new user({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000,
      profileImage: profileImageUrl, // Save profile picture URL
    });

    await newUser.save();
    generateTokenSetCookie(res, newUser._id);

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

module.exports = signup;
