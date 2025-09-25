const ClothingItem = require("../models/clothingItems");
const { handleError, sendSuccess } = require("../utils/error");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => sendSuccess(res, 201, item, "Item created"))
    .catch((err) => handleError(err, res, "Failed to create item"));
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => sendSuccess(res, 200, items, "Items retrieved"))
    .catch((err) => handleError(err, res, "Failed to fetch items"));
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageURL } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => sendSuccess(res, 200, item, "Item updated"))
    .catch((err) => handleError(err, res, "Failed to update item"));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => sendSuccess(res, 204))
    .catch((err) => handleError(err, res, "Failed to delete item"));
};

module.exports = { createItem, getItems, updateItem, deleteItem };
