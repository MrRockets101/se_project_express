const mongoose = require("mongoose");

const weatherCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Normalize to lowercase
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model("weatherCategory", weatherCategorySchema);
