const jwt = require("jsonwebtoken");
const { JWT_SECRET = "dev-secret" } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    console.log("Decoding token:", token); // Debug log
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    console.log("Decoded payload:", payload); // Debug log
    return next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
