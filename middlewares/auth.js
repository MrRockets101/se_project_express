const jwt = require("jsonwebtoken");
const { JWT_SECRET = "dev-secret" } = require("../utils/config");
const { logger } = require("../middlewares/logger");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    logger.warn(
      `Authorization header missing or invalid: ${req.method} ${req.url}`
    );
    return res.status(401).json({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    logger.debug(`Decoding token: ${token}`);
    const payload = jwt.verify(token, JWT_SECRET);
    logger.debug(`Decoded payload: ${JSON.stringify(payload)}`);
    req.user = payload;
    return next();
  } catch (err) {
    logger.error(`Token verification failed: ${err.message}`);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
