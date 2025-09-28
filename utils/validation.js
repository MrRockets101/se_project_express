const mongoose = require("mongoose");
const validator = require("validator");
const { AppError } = require("./error");

const validateObjectId = (id, field = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, `Invalid ${field}`);
  }
};

const validateBody = ({ required = [], optional = [], custom = {} } = {}) => {
  return async (req, res, next) => {
    const body = req.body;
    if (!body || typeof body !== "object") {
      return next(new AppError(400, "Request body must be a valid object"));
    }

    // Check required fields
    for (const field of required) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        return next(new AppError(400, `${field} is required`));
      }
    }

    const allFields = [...required, ...optional];
    try {
      for (const field of allFields) {
        if (
          body[field] !== undefined &&
          body[field] !== null &&
          custom[field]
        ) {
          body[field] = await custom[field](body[field]); // Supports async
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

const validateParam = (paramName = "id", options = { allowNull: false }) => {
  return (req, res, next) => {
    try {
      let value = req.params[paramName];

      // Treat "null" string as null
      if (typeof value === "string" && value.toLowerCase() === "null") {
        value = null;
        req.params[paramName] = null;
      }

      if (options.allowNull && (!value || value === null)) return next();

      if (!mongoose.Types.ObjectId.isValid(value)) {
        return next(new AppError(400, `Invalid ${paramName}`));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

const validators = {
  url: (value) => {
    if (!validator.isURL(value, { require_protocol: true })) {
      throw new AppError(400, `${value} is not a valid URL`);
    }
    return value;
  },
  weather: async (value) => {
    const WeatherCategory = require("../models/weatherCategory");
    const match = await WeatherCategory.findOne({ name: value.toLowerCase() });
    if (!match) {
      throw new AppError(400, `Value must be a valid category: ${value}`);
    }
    return match.name; // Normalize to stored case
  },
};

module.exports = { validateObjectId, validateBody, validateParam, validators };
