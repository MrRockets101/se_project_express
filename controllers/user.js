const User = require("../models/user");
const { AppError, sendSuccess } = require("../utils/error");

const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    return sendSuccess(res, 201, user, null, true);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return sendSuccess(res, 200, users, null, true);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(new AppError(404, "User not found"));
    return sendSuccess(res, 200, user, null, true);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true,
      context: "query",
    });
    if (!user) return next(new AppError(404, "User not found"));
    return sendSuccess(res, 200, user, null, true);
  } catch (err) {
    next(err);
  }
};

const patchUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );
    if (!user) return next(new AppError(404, "User not found"));
    return sendSuccess(res, 200, user, null, true);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return next(new AppError(404, "User not found"));
    return sendSuccess(res, 204);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  patchUser,
  deleteUser,
};
