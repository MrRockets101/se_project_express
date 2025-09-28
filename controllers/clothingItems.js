const { AppError, sendSuccess } = require("../utils/error");
const { validateObjectId } = require("../utils/validation");
const { mapItemResponse } = require("../utils/itemHelpers");

const createItem = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0)
      throw new AppError(400, "Request body is required");
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
    validateObjectId(req.params.itemId, "itemId");
    const item = await ClothingItem.findById(req.params.itemId);
    if (!item) throw new AppError(404, "Item not found");
    return sendSuccess(res, 200, mapItemResponse(item), null, true);
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    validateObjectId(req.params.itemId, "itemId");
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $set: req.body },
      { new: true, runValidators: true, context: "query" }
    );
    if (!item) throw new AppError(404, "Item not found");
    return sendSuccess(res, 200, mapItemResponse(item), null, true);
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    validateObjectId(req.params.itemId, "itemId");
    const item = await ClothingItem.findByIdAndDelete(req.params.itemId);
    if (!item) throw new AppError(404, "Item not found");
    return sendSuccess(res, 204);
  } catch (err) {
    next(err);
  }
};

const likeItem = async (req, res, next) => {
  try {
    validateObjectId(req.params.itemId, "itemId");
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!item) throw new AppError(404, "Item not found");
    return sendSuccess(res, 200, mapItemResponse(item), null, true);
  } catch (err) {
    next(err);
  }
};

const unlikeItem = async (req, res, next) => {
  try {
    validateObjectId(req.params.itemId, "itemId");
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!item) throw new AppError(404, "Item not found");
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
  deleteItem,
  likeItem,
  unlikeItem,
};
