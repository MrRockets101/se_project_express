const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/error");
const validator = require("validator");

const validateObjectId = (id, name = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, `Invalid ${name}`);
  }
};

const mapItemResponse = (item) => ({
  _id: item._id,
  name: item.name,
  weather: item.weather,
  imageUrl: item.imageURL,
  owner: item.owner,
  likes: item.likes,
});

const validateWeatherAndImage = (weather, imageURL) => {
  if (!weather) throw new AppError(400, "weather is required");
  if (!imageURL) throw new AppError(400, "imageURL is required");

  const matchedWeather = ClothingItem.weatherCategories.find(
    (w) => w.toLowerCase() === weather.toLowerCase()
  );
  if (!matchedWeather) {
    throw new AppError(
      400,
      `weather must be one of: ${ClothingItem.weatherCategories.join(", ")}`
    );
  }

  if (!validator.isURL(imageURL, { require_protocol: true })) {
    throw new AppError(400, "imageURL must be a valid URL with protocol");
  }

  return matchedWeather;
};

const createItem = async (req, res) => {
  const { name, weather } = req.body;
  const imageURL = req.body.imageURL || req.body.imageUrl;
  const owner = req.user._id;

  if (!name) throw new AppError(400, "name is required");

  const matchedWeather = validateWeatherAndImage(weather, imageURL);

  const item = await ClothingItem.create({
    name,
    weather: matchedWeather,
    imageURL,
    owner,
  });

  return sendSuccess(res, 201, mapItemResponse(item));
};

const getItems = async (req, res) => {
  const items = await ClothingItem.find({});
  return sendSuccess(res, 200, items.map(mapItemResponse));
};

const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const imageURL = req.body.imageURL || req.body.imageUrl;

  validateObjectId(itemId, "item ID");
  if (!imageURL) throw new AppError(400, "imageURL is required");
  if (!validator.isURL(imageURL, { require_protocol: true }))
    throw new AppError(400, "imageURL must be a valid URL with protocol");

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageURL } },
    { new: true, runValidators: true, context: "query" }
  );
  if (!item) throw new AppError(404, "Item not found");

  return sendSuccess(res, 200, mapItemResponse(item));
};

const patchItem = async (req, res) => {
  const { itemId } = req.params;
  const updates = { ...req.body };

  validateObjectId(itemId, "item ID");
  if (!updates || Object.keys(updates).length === 0)
    throw new AppError(400, "No updates provided");

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

  return sendSuccess(res, 200, mapItemResponse(item));
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;
  validateObjectId(itemId, "item ID");

  const item = await ClothingItem.findByIdAndDelete(itemId);
  if (!item) throw new AppError(404, "Item not found");

  return sendSuccess(res, 200, { _id: itemId, message: "Item deleted" });
};

const likeItem = async (req, res) => {
  const { itemId } = req.params;
  validateObjectId(itemId, "item ID");

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
  if (!item) throw new AppError(404, "Item not found");

  return sendSuccess(res, 200, mapItemResponse(item));
};

const unlikeItem = async (req, res) => {
  const { itemId } = req.params;
  validateObjectId(itemId, "item ID");

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
  if (!item) throw new AppError(404, "Item not found");

  return sendSuccess(res, 200, mapItemResponse(item));
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
