const ClothingItem = require("../models/clothingItems");
const AppError = require("../utils/AppError");

const createItem = async (req, res) => {
  const { name, weather, imageURL } = req.body;
  const owner = req.user._id;
  const item = await ClothingItem.create({ name, weather, imageURL, owner });
  res.status(201).json(item);
};

const getItems = async (req, res) => {
  const items = await ClothingItem.find({});
  res.status(200).json(items);
};

const updateItem = async (req, res) => {
  const { imageURL } = req.body;
  const item = await ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $set: { imageURL } },
    { new: true, runValidators: true }
  );
  if (!item) throw new AppError(404, "Item not found");
  res.status(200).json(item);
};

const deleteItem = async (req, res) => {
  const item = await ClothingItem.findByIdAndDelete(req.params.itemId);
  if (!item) throw new AppError(404, "Item not found");
  res.status(204).send();
};

const likeItem = async (req, res) => {
  const item = await ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
  if (!item) throw new AppError(404, "Item not found");
  res.status(200).json(item);
};

const unlikeItem = async (req, res) => {
  const item = await ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
  if (!item) throw new AppError(404, "Item not found");
  res.status(200).json(item);
};

const patchItem = async (req, res) => {
  const updates = req.body;
  const item = await ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!item) throw new AppError(404, "Item not found");
  res.status(200).json(item);
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
  patchItem,
};
