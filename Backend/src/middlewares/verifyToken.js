const { verify } = require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized no-token found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized invalid found" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Verify Token Function Error: " + error.message);
    return res
      .status(401)
      .json({ message: "Catch verify Token " + error.message });
  }
};

module.exports = { verifyToken };
