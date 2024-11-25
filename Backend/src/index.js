const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/index.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users.routes.js");
const postRouter = require("./routes/posts.routes.js");
const friendRoutes = require("./routes/friends.routes.js");
const chatRoutes = require("./routes/chat.routes.js"); // Import your chat routes

const cors = require("cors");
const axios = require("axios");
const http = require("http");
const socketIo = require("socket.io");

dotenv.config({ path: ".env.local" });

const app = express();
const server = http.createServer(app); // Create an HTTP server to support socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL, // Make sure your client can connect to the server
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json()); // parse incoming JSON requests
app.use(cookieParser()); // parse incoming cookies

// Cat Facts API Route
app.get("/api/catfacts", async (req, res) => {
  try {
    const response = await axios.get("https://catfact.ninja/facts?limit=100");
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Error fetching cat facts" });
  }
});

// Add your existing API routes
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/friends", friendRoutes);
app.use("/api/chat", chatRoutes); // Add the chat routes to handle message sending and history

// Socket.io for real-time chat functionality
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle receiving chat messages
  socket.on("chatMessage", async (messageContent) => {
    const { sender, receiver, content } = messageContent;
    try {
      const newMessage = new Message({
        sender,
        receiver,
        content,
      });

      await newMessage.save(); // Save the message to the database

      // Emit the new message to the client
      io.emit("message", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server and connect to the database
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
