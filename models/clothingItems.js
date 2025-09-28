const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  weather: {
    type: String,
    required: true,
    validate: {
      validator: async function (v) {
        const WeatherCategory = require("./weatherCategory"); // Avoid circular import
        const category = await WeatherCategory.findOne({
          name: v.toLowerCase(),
        });
        return !!category;
      },
      message: "{VALUE} is not a valid weather category",
    },
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v, { require_protocol: true }),
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", default: [] }],
});

module.exports = mongoose.model("item", clothingItemSchema);
