const mongoose = require("mongoose");
const validator = require("validator");
const useSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "the avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
});

moodules.exports = mongoose.model("user", userSchema);
