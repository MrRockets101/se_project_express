const User = require("../models/user");
const AppError = require("../utils/AppError");

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

const createUser = async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.create({ name, avatar });
  res.status(201).json(user);
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) throw new AppError(404, "User not found");
  res.status(200).json(user);
};

const updateUser = async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { name, avatar },
    { new: true, runValidators: true }
  );
  if (!user) throw new AppError(404, "User not found");
  res.status(200).json(user);
};

const patchUser = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!user) throw new AppError(404, "User not found");
  res.status(200).json(user);
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.userId);
  if (!user) throw new AppError(404, "User not found");
  res.status(204).send();
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  patchUser,
  deleteUser,
};
