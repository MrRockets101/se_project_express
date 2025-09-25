const User = require("../models/user");
const { handleError, sendSuccess } = require("../utils/error");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => sendSuccess(res, 200, users, "Users retrieved"))
    .catch((err) => handleError(err, res, "Failed to fetch users"));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => sendSuccess(res, 201, user, "User created"))
    .catch((err) => handleError(err, res, "Failed to create user"));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => sendSuccess(res, 200, user, "User found"))
    .catch((err) => handleError(err, res, "Failed to find user"));
};

module.exports = { getUsers, createUser, getUser };
