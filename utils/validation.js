const mongoose = require("mongoose");
const validator = require("validator");
const { AppError } = require("./error");

const validateObjectId = (id, field = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, `Invalid ${field}`);
  }
};

const validateBody = ({ required = [], optional = [], custom = {} } = {}) => {
  return (req, res, next) => {
    const body = req.body;
    if (!body || typeof body !== "object") {
      return next(new AppError(400, "Request body must be a valid object"));
    }

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
          body[field] = custom[field](body[field]);
        }
      }
    } catch (err) {
      return next(err);
    }

    next();
  };
};

const validateParam = (paramName = "id", options = { allowNull: false }) => {
  return (req, res, next) => {
    try {
      const value = req.params[paramName];
      if (options.allowNull && (!value || value === "null")) return next();
      validateObjectId(value, paramName);
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
  enum: (enumList) => (value) => {
    const match = enumList.find((v) => v.toLowerCase() === value.toLowerCase());
    if (!match) {
      throw new AppError(400, `Value must be one of: ${enumList.join(", ")}`);
    }
    return match;
  },
};

module.exports = { validateObjectId, validateBody, validateParam, validators };
