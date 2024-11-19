const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/index.js");

console.log("Before dotenv config: ", process.env.MONGODB_URI);
dotenv.config({ path: ".env.local" });
console.log("After dotenv config: ", process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => res.send("hello world"));

console.log("MongoDB URI: ", process.env.MONGODB_URI);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
