const User = require("../models/user");
const { handleError, sendSuccess } = require("../utils/error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");

const logIn = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        console.log(`No user found for email: ${email}`); // Debug
        return res.status(401).json({ message: "Invalid email or password" });
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          console.log(`Password mismatch for email: ${email}`); // Debug
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        console.log(`Token generated for ${email}: ${token}`); // Debug
        return res.json({ token });
      });
    })
    .catch((err) => handleError(err, res, "Failed to sign in"));
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !name || !avatar || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    console.log("Input data:", { name, avatar, email, password });
    console.log("Checking for existing user with email:", email);
    const existingUser = await User.findOne({ email }).select("+password");
    if (existingUser) {
      console.log("Existing user found:", existingUser);
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({ name, avatar, email, password });
    console.log("User saved to database:", user);

    const safeUser = user.toObject();
    delete safeUser.password;

    return sendSuccess(res, 201, safeUser, "User registered");
  } catch (err) {
    console.error("Create user error details:", err.message, err.stack);
    return handleError(err, res, "Failed to sign up");
  }
};

const getCurrentUser = (req, res) => {
  console.log("getCurrentUser called with req.user:", req.user); // Debug
  try {
    const user = req.user;
    if (!user || !user._id) {
      console.log("No valid user payload in token");
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("Searching for user with _id:", user._id); // Debug
    User.findById(user._id)
      .select("+password")
      .orFail()
      .then((userData) => {
        console.log("User found:", userData); // Debug
        const safeUser = userData.toObject();
        delete safeUser.password;
        res.send(safeUser);
      })
      .catch((err) => {
        console.error("User find error:", err.message); // Debug
        handleError(err, res, "User not found");
      });
  } catch (err) {
    console.error("getCurrentUser error:", err.message); // Debug
    handleError(err, res, "Failed to get current user");
  }
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
      delete safeUser.password;
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
