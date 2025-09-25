const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  validator: {
    validator: (v) => validator.isURL(v),
    message: "link is not Valid",
  },
});

module.exports = mongoose.model("clothingItems", clothingItemSchema);
