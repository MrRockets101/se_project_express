const ClothingItem = require("../models/clothingItems");
const mongoose = require("mongoose");
const { logger } = require("../middlewares/logger");

const createItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  const item = await ClothingItem.create({ name, weather, imageUrl, owner });
  logger.info(`Item created: ${item._id} by user ${owner}`);
  res.status(201).json({
    data: item.toObject(),
    message: "Item created",
    statusText: "Created",
  });
};

const getItems = async (req, res) => {
  const items = await ClothingItem.find({});
  res.status(200).json({
    data: items.map((item) => item.toObject()),
    message: "Items retrieved",
    statusText: "OK",
  });
};

const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageUrl } },
    { new: true, runValidators: true }
  );
  if (!item) {
    throw new Error("Item not found");
  }
  logger.info(`Item updated: ${itemId} by user ${req.user._id}`);
  res.status(200).json({
    data: item.toObject(),
    message: "Item updated",
    statusText: "OK",
  });
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new Error("Invalid item ID format");
  }

  const item = await ClothingItem.findById(itemId);
  if (!item) {
    throw new Error("Item not found");
  }

  if (item.owner.toString() !== req.user._id) {
    throw new Error("You can only delete your own items");
  }

  await item.deleteOne();
  logger.info(`Item deleted: ${itemId} by user ${req.user._id}`);
  res.status(200).json({
    message: "Item deleted",
    statusText: "OK",
  });
};

const likeItem = async (req, res) => {
  const item = await ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
  if (!item) {
    throw new Error("Item not found");
  }
  logger.info(`Item liked: ${req.params.itemId} by user ${req.user._id}`);
  res.status(200).json({
    data: item.toObject(),
    message: "Item liked",
    statusText: "OK",
  });
};

const unlikeItem = async (req, res) => {
  const item = await ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
  if (!item) {
    throw new Error("Item not found");
  }
  logger.info(`Item unliked: ${req.params.itemId} by user ${req.user._id}`);
  res.status(200).json({
    data: item.toObject(),
    message: "Item unliked",
    statusText: "OK",
  });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};

// const ClothingItem = require("../models/clothingItems");
// const { handleError, sendSuccess } = require("../utils/error");
// const mongoose = require("mongoose");

// const createItem = (req, res) => {
//   const { name, weather, imageUrl } = req.body;
//   const owner = req.user._id;

//   ClothingItem.create({ name, weather, imageUrl, owner })
//     .then((item) => {
//       const safeItem =
//         typeof item.toObject === "function" ? item.toObject() : item;
//       return sendSuccess(res, 201, safeItem, "Item created");
//     })
//     .catch((err) => handleError(err, res, "Failed to create item"));
// };

// const getItems = (req, res) => {
//   ClothingItem.find({})
//     .then((items) => {
//       return sendSuccess(res, 200, items, "Items retrieved");
//     })
//     .catch((err) => handleError(err, res, "Failed to fetch items"));
// };

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItem.findByIdAndUpdate(
//     itemId,
//     { $set: { imageUrl } },
//     { new: true, runValidators: true }
//   )
//     .then((item) => {
//       if (!item) {
//         return res.status(404).send({
//           status: 404,
//           error: "Not Found",
//           message: "Item not found",
//         });
//       }
//       return sendSuccess(res, 200, item, "Item updated");
//     })
//     .catch((err) => handleError(err, res, "Failed to update item"));
// };

// const deleteItem = async (req, res) => {
//   const { itemId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(itemId)) {
//     return res.status(400).json({
//       status: 400,
//       error: "Bad Request",
//       message: "Invalid item ID format",
//     });
//   }

//   try {
//     const item = await ClothingItem.findById(itemId);

//     if (!item) {
//       return res.status(404).json({
//         status: 404,
//         error: "Not Found",
//         message: "Item not found",
//       });
//     }

//     console.log(req.user._id);
//     console.log(item.owner.toString());
//     if (item.owner.toString() !== req.user._id) {
//       console.log(data);
//       return res.status(403).json({
//         status: 403,
//         error: "Forbidden",
//         message: "You can only delete your own items",
//       });
//     }

//     await item.deleteOne();

//     return res.status(200).json({
//       status: 200,
//       message: "Item deleted",
//     });
//   } catch (err) {
//     return handleError(err, res, "Failed to delete item");
//   }
// };

// const likeItem = (req, res) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.itemId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true }
//   )
//     .then((item) => {
//       if (!item) {
//         return res.status(404).send({
//           status: 404,
//           error: "Not Found",
//           message: "Item not found",
//         });
//       }
//       return sendSuccess(res, 200, item, "Item liked");
//     })
//     .catch((err) => handleError(err, res, "Failed to like item"));
// };

// const unlikeItem = (req, res) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.itemId,
//     { $pull: { likes: req.user._id } },
//     { new: true }
//   )
//     .then((item) => {
//       if (!item) {
//         return res.status(404).send({
//           status: 404,
//           error: "Not Found",
//           message: "Item not found",
//         });
//       }
//       return sendSuccess(res, 200, item, "Item unliked");
//     })
//     .catch((err) => handleError(err, res, "Failed to unlike item"));
// };

// module.exports = {
//   createItem,
//   getItems,
//   updateItem,
//   deleteItem,
//   likeItem,
//   unlikeItem,
// };
