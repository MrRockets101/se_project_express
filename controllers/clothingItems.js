const ClothingItem = require("../models/clothingItems");
const { AppError, sendSuccess } = require("../utils/error");
const { mapItemResponse } = require("../utils/itemHelpers");

const handleUpdate = async (itemId, updates = {}) => {
  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: updates },
    { new: true, runValidators: true, context: "query" }
  );
  if (!item) throw new AppError(404, "Item not found");
  return item;
};

const createItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.create({
      ...req.body,
      owner: req.user._id,
    });
    return sendSuccess(res, 201, mapItemResponse(item), null, true);
  } catch (err) {
    next(err);
  }
};

const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({});
    return sendSuccess(res, 200, items.map(mapItemResponse), null, true);
  } catch (err) {
    next(err);
  }
};

const getItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    if (!itemId) return next(new AppError(404, "Item not found"));

    const item = await ClothingItem.findById(itemId);
    if (!item) return next(new AppError(404, "Item not found"));

    return sendSuccess(res, 200, mapItemResponse(item), null, true);
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await handleUpdate(req.params.itemId, {
      imageURL: req.body.imageURL,
    });
    return sendSuccess(res, 200, mapItemResponse(item), null, true);
  } catch (err) {
    next(err);
  }
};

const patchItem = async (req, res, next) => {
  try {
    const item = await handleUpdate(req.params.itemId, req.body);
    return sendSuccess(res, 200, mapItemResponse(item), null, true);
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    if (!itemId)
      return sendSuccess(res, 200, {
        message: "Item already deleted or missing",
      });

    const item = await ClothingItem.findByIdAndDelete(itemId);
    if (!item) return next(new AppError(404, "Item not found"));

    return sendSuccess(res, 200, { _id: item._id });
  } catch (err) {
    next(err);
  }
};

const likeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!item) return next(new AppError(404, "Item not found"));
    return sendSuccess(res, 200, mapItemResponse(item), null, true);
  } catch (err) {
    next(err);
  }
};

const unlikeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!item) return next(new AppError(404, "Item not found"));
    return sendSuccess(res, 200, mapItemResponse(item), null, true);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  patchItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
