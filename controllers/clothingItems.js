<<<<<<< HEAD
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
=======
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

<<<<<<< HEAD
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
=======
  ClothingItem.create({ name, weather, imageURL, owner })
    .then((item) => sendSuccess(res, 201, item, "Item created"))
    .catch((err) => handleError(err, res, "Failed to create item"));
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => sendSuccess(res, 200, items, "Items retrieved"))
    .catch((err) => handleError(err, res, "Failed to fetch items"));
>>>>>>> parent of af4f6ce (implement dynamic)
};

const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const imageURL = req.body.imageURL || req.body.imageUrl;

  validateObjectId(itemId, "item ID");
  const validImageURL = validateImageURL(imageURL);

  const item = await ClothingItem.findByIdAndUpdate(
    itemId,
<<<<<<< HEAD
    { $set: { imageURL: validImageURL } },
    { new: true, runValidators: true, context: "query" }
  );

  if (!item) throw new AppError(404, "Item not found");
  return sendSuccess(res, 200, mapItemResponse(item), null, true);
=======
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
      sendSuccess(res, 200, item, "Item updated");
    })
    .catch((err) => handleError(err, res, "Failed to update item"));
>>>>>>> parent of af4f6ce (implement dynamic)
};

const patchItem = async (req, res) => {
  const { itemId } = req.params;
  const updates = { ...req.body };

  validateObjectId(itemId, "item ID");
  if (!updates || Object.keys(updates).length === 0)
    throw new AppError(400, "No updates provided");

<<<<<<< HEAD
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
>>>>>>> parent of aa6a1c0 (postman)
=======
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
>>>>>>> parent of af4f6ce (implement dynamic)
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
