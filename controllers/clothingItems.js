const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");
const { handleError, sendSuccess } = require("../utils/error");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageURL, owner })
    .then((item) => sendSuccess(res, 201, item))
    .catch((err) => handleError(err, res, "Failed to create item"));
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => sendSuccess(res, 200, items))
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
    .then((item) => {
      if (!item) {
        return res.status(404).send({
          status: 404,
          error: "Not Found",
          message: "Item not found",
        });
      }
      sendSuccess(res, 200, item);
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
      sendSuccess(res, 200, item);
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
      sendSuccess(res, 200, item);
    })
    .catch((err) => handleError(err, res, "Failed to unlike item"));
};

const patchItem = (req, res) => {
  const { itemId } = req.params;
  const updates = req.body;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: updates },
    { new: true, runValidators: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).json({
          status: 404,
          error: "Not Found",
          message: "Item not found",
        });
      }
      sendSuccess(res, 200, item);
    })
    .catch((err) => handleError(err, res, "Failed to partially update item"));
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
