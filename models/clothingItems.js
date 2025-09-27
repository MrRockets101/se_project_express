const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  weather: { type: String, required: true, enum: ["hot", "warm", "cold"] },
  imageURL: { type: String, required: true, validate: validator.isURL },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", default: [] }],
});
module.exports = mongoose.model("item", clothingItemSchema);
