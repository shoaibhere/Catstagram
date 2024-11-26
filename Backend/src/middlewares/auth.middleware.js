const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const protect = (req, res, next) => {
  const token = req.cookies.token; // Access token from the cookies

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token found" });
  }
  // console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized invalid found" });
    }
    req.user = { _id: decoded.userId }; // Attach user information to the request
    console.log("Authenticated user:", req.user); // Log to check if the user is set
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = { protect };
