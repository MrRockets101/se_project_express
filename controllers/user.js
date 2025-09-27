const User = require("../models/user");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/error");

const createUser = async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.create({ name, avatar });
  return sendSuccess(res, 201, user, null, true);
};

const getUsers = async (req, res) => {
  const users = await User.find({});
  return sendSuccess(res, 200, users, null, true);
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) throw new AppError(404, "User not found");
  return sendSuccess(res, 200, user, null, true);
};

const updateUser = async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { name, avatar },
    { new: true, runValidators: true, context: "query" }
  );
  if (!user) throw new AppError(404, "User not found");
  return sendSuccess(res, 200, user, null, true);
};

const patchUser = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { $set: updates },
    { new: true, runValidators: true, context: "query" }
  );
  if (!user) throw new AppError(404, "User not found");
  return sendSuccess(res, 200, user, null, true);
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.userId);
  if (!user) throw new AppError(404, "User not found");
  return sendSuccess(res, 204);
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  patchUser,
  deleteUser,
};
