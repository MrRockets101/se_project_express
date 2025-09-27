const User = require("../models/user");
const { handleError, sendSuccess } = require("../utils/error");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => sendSuccess(res, 200, users))
    .catch((err) => handleError(err, res, "Failed to fetch users"));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => sendSuccess(res, 201, user))
    .catch((err) => handleError(err, res, "Failed to create user"));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          error: "Not Found",
          message: "User not found",
        });
      }
      sendSuccess(res, 200, user);
    })
    .catch((err) => handleError(err, res, "Failed to find user"));
};

const updateUser = (req, res) => {
  const { userId } = req.params;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          error: "Not Found",
          message: "User not found",
        });
      }
      sendSuccess(res, 200, user);
    })
    .catch((err) => handleError(err, res, "Failed to update user"));
};

const patchUser = (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          error: "Not Found",
          message: "User not found",
        });
      }
      sendSuccess(res, 200, user);
    })
    .catch((err) => handleError(err, res, "Failed to partially update user"));
};

const deleteUser = (req, res) => {
  const { userId } = req.params;
  User.findByIdAndDelete(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          error: "Not Found",
          message: "User not found",
        });
      }
      sendSuccess(res, 204);
    })
    .catch((err) => handleError(err, res, "Failed to delete user"));
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  patchUser,
  deleteUser,
};
