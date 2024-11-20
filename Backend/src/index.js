const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/index.js");

const userRouter = require("./routes/users.routes.js");

dotenv.config({ path: "./.env.local" });

const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
console.log("jwt=" + jwt);
const PORT = process.env.PORT || 8000;
app.use("/user", userRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
