const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/error");
const validator = require("validator");

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createItem = async (req, res) => {
  const { name, weather, imageURL } = req.body;
  const owner = req.user._id;

  if (!name) throw new AppError(400, "name is required");
  if (!weather) throw new AppError(400, "weather is required");
  if (!imageURL) throw new AppError(400, "imageURL is required");

  const validWeathers = ClothingItem.weatherCategories.map((w) =>
    w.toLowerCase()
  );
  const weatherNormalized = weather.toLowerCase();
  if (!validWeathers.includes(weatherNormalized)) {
    throw new AppError(
      400,
      `weather must be one of: ${ClothingItem.weatherCategories.join(", ")}`
    );
  }

  if (!validator.isURL(imageURL, { require_protocol: true })) {
    throw new AppError(400, "imageURL must be a valid URL with protocol");
  }

  const item = await ClothingItem.create({
    name,
    weather: weatherNormalized,
    imageURL,
    owner,
  });

  return sendSuccess(res, 201, item, null, true);
};

const getItems = async (req, res) => {
  const items = await ClothingItem.find({});
  return sendSuccess(res, 200, items, null, true);
};

const updateItem = async (req, res) => {
  const { itemId } = req.params;
  if (!validateObjectId(itemId)) throw new AppError(404, "Item not found");

  const { imageURL } = req.body;
  if (!imageURL) throw new AppError(400, "imageURL is required");

  if (!validator.isURL(imageURL, { require_protocol: true }))
    throw new AppError(400, "imageURL must be a valid URL with protocol");

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageURL } },
    { new: true, runValidators: true, context: "query" }
  );

  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 200, item, null, true);
};

const patchItem = async (req, res) => {
  const { itemId } = req.params;
  if (!validateObjectId(itemId)) throw new AppError(404, "Item not found");

  const updates = req.body;
  if (!updates || Object.keys(updates).length === 0)
    throw new AppError(400, "No updates provided");

  // Optional validation for weather field
  if (updates.weather) {
    const validWeathers = ClothingItem.weatherCategories;
    if (!validWeathers.includes(updates.weather))
      throw new AppError(
        400,
        `weather must be one of: ${validWeathers.join(", ")}`
      );
  }

  // Optional validation for imageURL
  if (updates.imageURL) {
    if (!validator.isURL(updates.imageURL, { require_protocol: true }))
      throw new AppError(400, "imageURL must be a valid URL with protocol");
  }

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: updates },
    { new: true, runValidators: true, context: "query" }
  );

  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 200, item, null, true);
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;
  if (!validateObjectId(itemId)) throw new AppError(404, "Item not found");

  const item = await ClothingItem.findByIdAndDelete(itemId);
  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 204);
};

const likeItem = async (req, res) => {
  const { itemId } = req.params;
  if (!validateObjectId(itemId)) throw new AppError(404, "Item not found");

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );

  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 200, item, null, true);
};

const unlikeItem = async (req, res) => {
  const { itemId } = req.params;
  if (!validateObjectId(itemId)) throw new AppError(404, "Item not found");

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
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
