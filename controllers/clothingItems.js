const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/error");

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createItem = async (req, res) => {
  const { name, weather, imageURL } = req.body;
  const owner = req.user._id;

  if (!name) throw new AppError(400, "name is required");
  if (!weather) throw new AppError(400, "weather is required");
  if (!imageURL) throw new AppError(400, "imageURL is required");

  const validator = require("validator");
  if (!validator.isURL(imageURL))
    throw new AppError(400, "imageURL must be a valid URL");

  const item = await ClothingItem.create({ name, weather, imageURL, owner });

  return sendSuccess(res, 201, item, null, true);
};

const getItems = async (req, res) => {
  const items = await ClothingItem.find({});
  return sendSuccess(res, 200, items, null, true);
};

const updateItem = async (req, res) => {
  if (!validateObjectId(req.params.itemId)) {
    throw new AppError(404, "Item not found");
  }

  const { imageURL } = req.body;
  if (!imageURL) {
    throw new AppError(400, "imageURL is required");
  }

  const item = await ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $set: { imageURL } },
    { new: true, runValidators: true, context: "query" }
  );

  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 200, item, null, true);
};

const patchItem = async (req, res) => {
  if (!validateObjectId(req.params.itemId)) {
    throw new AppError(404, "Item not found");
  }

  const updates = req.body;
  if (!updates || Object.keys(updates).length === 0) {
    throw new AppError(400, "No updates provided");
  }

  const item = await ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $set: updates },
    { new: true, runValidators: true, context: "query" }
  );

  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 200, item, null, true);
};

const deleteItem = async (req, res) => {
  if (!validateObjectId(req.params.itemId)) {
    throw new AppError(404, "Item not found");
  }

  const item = await ClothingItem.findByIdAndDelete(req.params.itemId);
  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 204);
};

const likeItem = async (req, res) => {
  if (!validateObjectId(req.params.itemId)) {
    throw new AppError(404, "Item not found");
  }

  const item = await ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );

  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 200, item, null, true);
};

const unlikeItem = async (req, res) => {
  if (!validateObjectId(req.params.itemId)) {
    throw new AppError(404, "Item not found");
  }

  const item = await ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  );

  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 200, item, null, true);
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  patchItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
