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

  // Handle Mongoose validation errors robustly
  if (
    err.name === "ValidationError" ||
    (err.errors && typeof err.errors === "object")
  ) {
    status = 400;
    error = "Bad Request";
    message =
      Object.values(err.errors || {})
        .map((e) => e.message)
        .join("; ") ||
      err.message ||
      "Validation failed";
  }
  // Handle duplicate key errors
  else if (err.name === "MongoServerError" && err.code === 11000) {
    status = 409;
    error = "Conflict";
    message = "Duplicate key error: Resource already exists";
  }
  // Handle custom AppError
  else if (err instanceof AppError) {
    status = err.status;
    error = err.error;
    message = err.message;
  }
  // Anything else
  else if (err.name === "CastError") {
    status = 400;
    error = "Bad Request";
    message = `Invalid ${err.path || "ID"}`;
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
