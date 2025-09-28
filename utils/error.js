const { AppError, httpStatus } = require("./AppError");

const errorMap = {
  ValidationError: (err) => ({
    status: 400,
    error: httpStatus[400],
    message: err.message || "Validation failed",
  }),

  CastError: () => ({
    status: 400,
    error: httpStatus[400],
    message: "Invalid ID format",
  }),

  DocumentNotFoundError: () => ({
    status: 404,
    error: httpStatus[404],
    message: "Requested resource not found",
  }),

  MongoServerError: (err) => {
    if (err.code === 11000) {
      return {
        status: 409,
        error: httpStatus[409],
        message: "Duplicate key error: Resource already exists",
      };
    }
    return null;
  },
};

const handleError = (err, req, res, next) => {
  console.error(`[ERROR] ${err.name} - ${err.message}`);

  let status = 500;
  let error = "Internal Server Error";
  let message = err.message || "Unexpected error";

  // Mongoose ValidationError or CastError
  if (err.name === "ValidationError" || err.name === "CastError") {
    status = 400;
    error = "Bad Request";

    if (err.errors && Object.keys(err.errors).length > 0) {
      message = Object.values(err.errors)
        .map((e) => e.message)
        .join("; ");
    } else if (err.name === "CastError") {
      message = `Invalid ${err.path}`;
    } else {
      message = err.message || "Validation failed";
    }
  }
  // Duplicate key error
  else if (err.name === "MongoServerError" && err.code === 11000) {
    status = 409;
    error = "Conflict";
    message = "Duplicate key error: Resource already exists";
  }
  // Custom AppError
  else if (err instanceof AppError) {
    status = err.status;
    error = err.error;
    message = err.message;
  }

  return res.status(status).json({ status, error, message });
};

const sendSuccess = (
  res,
  statusCode = 200,
  data = {},
  message,
  raw = false
) => {
  if (statusCode === 204) return res.status(204).send();
  if (raw) return res.status(statusCode).json(data);

  return res.status(statusCode).json({
    status: statusCode,
    message: message || httpStatus[statusCode] || "Success",
    data: data || {},
  });
};

module.exports = { handleError, sendSuccess };
