const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/error");

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createItem = async (req, res) => {
  const { name, weather, imageURL } = req.body;
  const owner = req.user._id;

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
