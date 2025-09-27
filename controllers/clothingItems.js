const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/error");
const validator = require("validator");

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// CREATE ITEM
const createItem = async (req, res) => {
  const { name, weather } = req.body;
  const imageURL = req.body.imageURL || req.body.imageUrl;
  const owner = req.user._id;

  if (!name) throw new AppError(400, "name is required");
  if (!weather) throw new AppError(400, "weather is required");
  if (!imageURL) throw new AppError(400, "imageURL is required");

  const matchedWeather = ClothingItem.weatherCategories.find(
    (w) => w.toLowerCase() === weather.toLowerCase()
  );
  if (!matchedWeather)
    throw new AppError(
      400,
      `weather must be one of: ${ClothingItem.weatherCategories.join(", ")}`
    );

  if (!validator.isURL(imageURL, { require_protocol: true }))
    throw new AppError(400, "imageURL must be a valid URL with protocol");

  const item = await ClothingItem.create({
    name,
    weather: matchedWeather,
    imageURL,
    owner,
  });

  return sendSuccess(res, 201, item.toObject());
};

// GET ITEMS
const getItems = async (req, res) => {
  const items = await ClothingItem.find({});
  const plainItems = items.map((item) => item.toObject());
  return sendSuccess(res, 200, plainItems);
};

// UPDATE ITEM (PUT)
const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  if (!validateObjectId(itemId)) throw new AppError(400, "Invalid item ID");
  if (!imageURL) throw new AppError(400, "imageURL is required");
  if (!validator.isURL(imageURL, { require_protocol: true }))
    throw new AppError(400, "imageURL must be a valid URL with protocol");

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageURL } },
    { new: true, runValidators: true, context: "query" }
  );

  if (!item) throw new AppError(404, "Item not found");

  return sendSuccess(res, 200, item.toObject());
};

// PATCH ITEM
const patchItem = async (req, res) => {
  const { itemId } = req.params;
  const updates = req.body;

  if (!validateObjectId(itemId)) throw new AppError(400, "Invalid item ID");
  if (!updates || Object.keys(updates).length === 0)
    throw new AppError(400, "No updates provided");

  // Optional: weather field case-insensitive handling
  if (updates.weather) {
    const matchedWeather = ClothingItem.weatherCategories.find(
      (w) => w.toLowerCase() === updates.weather.toLowerCase()
    );
    if (!matchedWeather)
      throw new AppError(
        400,
        `weather must be one of: ${ClothingItem.weatherCategories.join(", ")}`
      );
    updates.weather = matchedWeather;
  }

  // Optional: imageURL field
  if (updates.imageURL || updates.imageUrl) {
    updates.imageURL = updates.imageURL || updates.imageUrl;
    if (!validator.isURL(updates.imageURL, { require_protocol: true }))
      throw new AppError(400, "imageURL must be a valid URL with protocol");
  }

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: updates },
    { new: true, runValidators: true, context: "query" }
  );

  if (!item) throw new AppError(404, "Item not found");

  return sendSuccess(res, 200, item.toObject());
};

// DELETE ITEM
const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  if (!validateObjectId(itemId)) throw new AppError(400, "Invalid item ID");

  const item = await ClothingItem.findByIdAndDelete(itemId);
  if (!item) throw new AppError(404, "Item not found");

  return sendSuccess(res, 204);
};

// LIKE ITEM
const likeItem = async (req, res) => {
  const { itemId } = req.params;

  if (!validateObjectId(itemId)) throw new AppError(400, "Invalid item ID");

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );

  if (!item) throw new AppError(404, "Item not found");

  return sendSuccess(res, 200, item.toObject());
};

// UNLIKE ITEM
const unlikeItem = async (req, res) => {
  const { itemId } = req.params;

  if (!validateObjectId(itemId)) throw new AppError(400, "Invalid item ID");

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  );

  if (!item) throw new AppError(404, "Item not found");

  return sendSuccess(res, 200, item.toObject());
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
