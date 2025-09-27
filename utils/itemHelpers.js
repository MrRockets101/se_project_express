const mongoose = require("mongoose");
const validator = require("validator");
const ClothingItem = require("../models/clothingItems");
const AppError = require("./AppError");

const validateObjectId = (id, field = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, `Invalid ${field}`);
  }
};

const validateWeather = (weather) => {
  if (!weather) throw new AppError(400, "weather is required");

  const matchedWeather = ClothingItem.weatherCategories.find(
    (w) => w.toLowerCase() === weather.toLowerCase()
  );

  if (!matchedWeather)
    throw new AppError(
      400,
      `weather must be one of: ${ClothingItem.weatherCategories.join(", ")}`
    );

  return matchedWeather; // preserves enum casing
};

const validateImageURL = (imageURL) => {
  if (!imageURL) throw new AppError(400, "imageURL is required");
  if (!validator.isURL(imageURL, { require_protocol: true }))
    throw new AppError(400, "imageURL must be a valid URL with protocol");
  return imageURL;
};

const mapItemResponse = (item) => ({
  _id: item._id,
  name: item.name,
  weather: item.weather,
  imageUrl: item.imageURL,
  owner: item.owner,
  likes: item.likes,
});

module.exports = {
  validateObjectId,
  validateWeather,
  validateImageURL,
  mapItemResponse,
};
