const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/index.js");
const userRouter = require("./routes/users.routes.js");

dotenv.config();

const app = express();




const PORT = process.env.PORT || 8000;
app.use("/user", userRouter);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});