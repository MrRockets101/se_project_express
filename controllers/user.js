const User = require("../models/user");
const { handleError, sendSuccess } = require("../utils/error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");

const logIn = (req, res) => {
  const { email, password } = req.body;

  // ✅ Pre-validation for required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.json({ token });
      });
    })
    .catch((err) => handleError(err, res, "Failed to sign in"));
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  // 1. Required field check
  if (!email || !name || !avatar || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 2. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // 3. Create new user
    const user = await User.create({ name, avatar, email, password });

    // 4. Remove password before sending
    const safeUser =
      typeof user.toObject === "function" ? user.toObject() : user;
    delete safeUser.password;

    return sendSuccess(res, 201, safeUser, "User registered");
  } catch (err) {
    return handleError(err, res, "Failed to sign up");
  }
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const safeUser = user.toObject();
      delete safeUser.password; // remove password hash
      sendSuccess(res, 200, safeUser, "User profile");
    })
    .catch((err) => handleError(err, res, "Failed to get user"));
};

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true, context: "query" }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          error: "Not Found",
          message: "User not found",
        });
      }
      const safeUser = user.toObject();
      delete safeUser.password; // remove password hash
      sendSuccess(res, 200, safeUser, "User updated");
    })
    .catch((err) => handleError(err, res, "Failed to update user"));
};

module.exports = {
  createUser,
  logIn,
  getCurrentUser,
  updateCurrentUser,
};
