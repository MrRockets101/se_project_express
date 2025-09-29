const User = require("../models/user");
const { handleError, sendSuccess } = require("../utils/error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");

const logIn = (req, res) => {
  const { email, password } = req.body;

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

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.create({ name, avatar, email, password })
    .then((user) => {
      const safeUser = user.toObject();
      delete safeUser.password;
      sendSuccess(res, 201, safeUser, "User registered");
    })
    .catch((err) => handleError(err, res, "Failed to sign up"));
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

const getUsers = (req, res) => {
  User.find({})
    .then((users) => sendSuccess(res, 200, users, "Users retrieved"))
    .catch((err) => handleError(err, res, "Failed to fetch users"));
};

module.exports = {
  getUsers,
  createUser,
  logIn,
  getCurrentUser,
  updateCurrentUser,
};
