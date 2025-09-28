const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");
const { handleError, sendSuccess } = require("../utils/error");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
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
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageUrl } },
    { new: true, runValidators: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({
          status: 404,
          error: "Not Found",
          message: "Item not found",
        });
      }
      sendSuccess(res, 200, item, "Item updated");
    })
    .catch((err) => handleError(err, res, "Failed to update item"));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({
          status: 404,
          error: "Not Found",
          message: "Item not found",
        });
      }
      sendSuccess(res, 204);
    })
    .catch((err) => handleError(err, res, "Failed to delete item"));
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({
          status: 404,
          error: "Not Found",
          message: "Item not found",
        });
      }
      sendSuccess(res, 200, item, "Item liked");
    })
    .catch((err) => handleError(err, res, "Failed to like item"));
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({
          status: 404,
          error: "Not Found",
          message: "Item not found",
        });
      }
      sendSuccess(res, 200, item, "Item unliked");
    })
    .catch((err) => handleError(err, res, "Failed to unlike item"));
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
