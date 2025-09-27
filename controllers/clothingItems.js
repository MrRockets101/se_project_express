const ClothingItem = require("../models/clothingItems");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/error");
const {
  validateObjectId,
  validateWeather,
  validateImageURL,
  mapItemResponse,
} = require("../utils/itemHelpers");

const createItem = async (req, res) => {
  const { name, weather } = req.body;
  const imageURL = req.body.imageURL || req.body.imageUrl;
  const owner = req.user._id;

  if (!name) throw new AppError(400, "name is required");

  const matchedWeather = validateWeather(weather);
  const validImageURL = validateImageURL(imageURL);

  const item = await ClothingItem.create({
    name,
    weather: matchedWeather,
    imageURL: validImageURL,
    owner,
  });

  return sendSuccess(res, 201, mapItemResponse(item), null, true);
};

const getItems = async (req, res) => {
  const items = await ClothingItem.find({});
  return sendSuccess(res, 200, items.map(mapItemResponse), null, true);
};

const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const imageURL = req.body.imageURL || req.body.imageUrl;

  validateObjectId(itemId, "item ID");
  const validImageURL = validateImageURL(imageURL);

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageURL: validImageURL } },
    { new: true, runValidators: true, context: "query" }
  );

  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 200, mapItemResponse(item), null, true);
};

const patchItem = async (req, res) => {
  const { itemId } = req.params;
  const updates = { ...req.body };

  validateObjectId(itemId, "item ID");
  if (!updates || Object.keys(updates).length === 0)
    throw new AppError(400, "No updates provided");

  if (updates.weather) updates.weather = validateWeather(updates.weather);
  if (updates.imageURL || updates.imageUrl)
    updates.imageURL = validateImageURL(updates.imageURL || updates.imageUrl);

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: updates },
    { new: true, runValidators: true, context: "query" }
  );

  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 200, mapItemResponse(item), null, true);
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;
  validateObjectId(itemId, "item ID");

  const item = await ClothingItem.findByIdAndDelete(itemId);
  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 204);
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
  return sendSuccess(res, 200, mapItemResponse(item), null, true);
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
  return sendSuccess(res, 200, mapItemResponse(item), null, true);
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
