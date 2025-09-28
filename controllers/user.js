const User = require("../models/user");
const { AppError, sendSuccess } = require("../utils/error"); // Verify this line
const { validateObjectId } = require("../utils/validation");

<<<<<<< HEAD
const createUser = async (req, res, next) => {
  try {
    console.log("POST /users - Request body:", req.body); // Debug log
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new AppError(400, "Request body is required");
    }

    // Explicitly check for missing name
    if (!req.body.name) {
      throw new AppError(400, "Name is required");
    }

    const user = await User.create(req.body);
    console.log("POST /users - Response:", user); // Debug log
    return sendSuccess(res, 201, user, null, true);
  } catch (err) {
    console.log("POST /users - Error:", err); // Debug log
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
    validateObjectId(req.params.userId, "userId");

    const user = await User.findById(req.params.userId);
    if (!user) throw new AppError(404, "User not found");

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
    if (!user) throw new AppError(404, "User not found");

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
      { new: true, runValidators: true, context: "query" }
    );
    if (!user) throw new AppError(404, "User not found");

    return sendSuccess(res, 200, user, null, true);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) throw new AppError(404, "User not found");

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
=======
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
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          status: 404,
          error: "Not Found",
          message: "User not found",
        });
      }
      sendSuccess(res, 200, user, "User found");
    })
    .catch((err) => handleError(err, res, "Failed to find user"));
};

module.exports = { getUsers, createUser, getUser };
>>>>>>> parent of af4f6ce (implement dynamic)
