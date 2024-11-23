const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/index.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users.routes.js");
const cors = require("cors");
const axios = require("axios");

// dotenv.config({ path: "./.env.local" });
dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json()); //parse incoming json request
app.use(cookieParser()); //parse incoming cookie

app.get("/api/catfacts", async (req, res) => {
  try {
    const response = await axios.get("https://catfact.ninja/facts?limit=100");
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Error fetching cat facts" });
  }
});
// const jwt = require("jsonwebtoken");
// console.log("jwt=" + jwt);
const PORT = process.env.PORT || 8000;
app.use("/api/user", userRouter);
app.post("/api/posts", async (req, res) => {
  try {
    const { caption, imageUrl } = req.body;
    const newPost = await Post.create({ caption, imageUrl, user: req.user._id }); // Assuming you use mongoose and have user info
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: "Error creating post" });
  }
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
