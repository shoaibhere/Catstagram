const jwt = require("jsonwebtoken");

const generateTokenSetCookie = (res, userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in the .env file");
    return;
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d", // Default to 1 day if not defined
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // Set maxAge
  });

  return token;
};

module.exports = generateTokenSetCookie;
