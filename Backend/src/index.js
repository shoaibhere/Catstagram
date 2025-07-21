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
const chatRouter = require("./routes/chat.routes.js");
const messageRouter = require("./routes/message.routes.js");
const path = require("path");
const commentRouter = require("./routes/comments.routes.js");
const mongoose = require("mongoose");
  
const cors = require("cors");
const axios = require("axios");

// dotenv.config({ path: "./.env.local" });
dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors({
  origin: "https://catstagram-nu.vercel.app", 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // The frontend URL
  credentials: true,               // Allow credentials (cookies) to be sent
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
app.use("/api/posts", postRouter);
app.use("/api/friends", friendRoutes);
app.use("/api/profile", profileRouter);
app.use("/api/comment", commentRouter);
app.use("/api/saved-posts", savedPostsRouter);
app.use("/api/liked-posts", likedPostsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use("/",(req,res)=>{
  res.send("Welcome to Catstagram Backend");
});

mongoose.connection.on('error', (err) => {
  if (err.code === 11000) {
    console.error('There was a duplicate key error');
  } else {
    console.error('Database error: ', err);
  }
});

const server = app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

// ... (keep all your existing imports and setup code)

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.set("io", io);

const __dirname1 = path.resolve();

// Track active users with more detailed information
const activeUsers = new Map(); // userId -> { socketId, lastActive }

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // Enhanced setup with presence tracking
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userData = userData;
    
    // Update active users with timestamp
    activeUsers.set(userData._id, {
      socketId: socket.id,
      lastActive: new Date(),
      status: 'online'
    });
    
    // Notify others this user came online
    socket.broadcast.emit("user-online", userData._id);
    
    // Send current online status to the new connection
    const onlineUsers = Array.from(activeUsers.keys());
    socket.emit("presence-update", onlineUsers);
    
    socket.emit("connected");
    console.log("User setup:", userData.name, userData._id);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  // Enhanced typing with user information
  socket.on("typing", (data) => {
    const { chatId, user } = data;
    console.log(`${user.name} is typing in chat:`, chatId);
    socket.to(chatId).emit("typing", {
      chatId,
      user,
      isTyping: true,
    });
  });

  socket.on("stop typing", (data) => {
    const { chatId, user } = data;
    console.log(`${user.name} stopped typing in chat:`, chatId);
    socket.to(chatId).emit("stop typing", {
      chatId,
      user,
      isTyping: false,
    });
  });

  socket.on("new message", (newMessageRecieved) => {
    console.log("New message received:", newMessageRecieved);
    const chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      console.log("Emitting message to user:", user._id);
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  // Heartbeat for connection health
  socket.on("heartbeat", (userId) => {
    if (activeUsers.has(userId)) {
      const user = activeUsers.get(userId);
      user.lastActive = new Date();
      user.status = 'online';
      activeUsers.set(userId, user);
    }
  });

  socket.on("disconnect", () => {
    if (socket.userData) {
      const userId = socket.userData._id;
      // Mark as offline but keep last active time
      if (activeUsers.has(userId)) {
        const user = activeUsers.get(userId);
        user.status = 'offline';
        activeUsers.set(userId, user);
      }
      socket.broadcast.emit("user-offline", userId);
      console.log(`User disconnected: ${socket.userData.name}`);
    }
  });
  

  // Graceful disconnect handling
  socket.on("logout", (userId) => {
    if (activeUsers.has(userId)) {
      activeUsers.delete(userId);
      socket.broadcast.emit("user-offline", userId);
      console.log(`User logged out: ${userId}`);
    }
    socket.disconnect();
  });
});

// Helper function to get user status
function getUserStatus(userId) {
  if (!activeUsers.has(userId)) return { status: 'offline', lastActive: null };
  
  const user = activeUsers.get(userId);
  if (user.status === 'online') {
    return { status: 'online', lastActive: user.lastActive };
  }
  
  // Consider user offline if last active > 2 minutes ago
  const twoMinutesAgo = new Date(Date.now() - 120000);
  return {
    status: user.lastActive > twoMinutesAgo ? 'recently' : 'offline',
    lastActive: user.lastActive
  };
}
