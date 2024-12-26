const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/index.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users.routes.js");
const postRouter = require("./routes/posts.routes.js");
const friendRoutes = require("./routes/friends.routes.js");
const profileRouter = require("./routes/profile.routes.js");
const savedPostsRouter = require("./routes/savedPosts.routes");
const likedPostsRouter = require("./routes/likedPosts.routes.js");
const commentRouter = require("./routes/comments.routes.js");
const mongoose = require("mongoose");
  
const cors = require("cors");
const axios = require("axios");

// dotenv.config({ path: "./.env.local" });
dotenv.config({ path: ".env.local" });

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
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
app.use("/api/posts", postRouter);
app.use("/api/friends", friendRoutes);
app.use("/api/profile", profileRouter);
app.use("/api/comment", commentRouter);
app.use("/api/saved-posts", savedPostsRouter);
app.use("/api/liked-posts", likedPostsRouter);
// Welcome route to verify deployment
app.get("/", (req, res) => {
  res.status(200).send("Backend deployed successfully!");
});


mongoose.connection.on('error', (err) => {
  if (err.code === 11000) {
    console.error('There was a duplicate key error');
  } else {
    console.error('Database error: ', err);
  }
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
