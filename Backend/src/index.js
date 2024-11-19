const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/index.js");

const userRouter = require("./routes/users.routes.js");

dotenv.config();

const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
console.log("jwt=" + jwt);
const PORT = process.env.PORT || 8000;
app.use("/user", userRouter);
console.log(
  "MongoDB URI: ",
  "mongodb+srv://shoaibakhtar1827:imshoaib@catstagram.6dtsx.mongodb.net/?retryWrites=true&w=majority&appName=catstagram"
);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
