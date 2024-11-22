const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/index.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users.routes.js");
const cors = require("cors");

// dotenv.config({ path: "./.env.local" });
dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json()); //parse incoming json request
app.use(cookieParser()); //parse incoming cookie
// const jwt = require("jsonwebtoken");
// console.log("jwt=" + jwt);
const PORT = process.env.PORT || 8000;
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
