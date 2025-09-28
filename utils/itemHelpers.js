const mongoose = require("mongoose");
const validator = require("validator");
const { AppError } = require("./error");

const validateObjectId = (id, field = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, `Invalid ${field}`);
  }
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
  validateImageURL,
  mapItemResponse,
};
