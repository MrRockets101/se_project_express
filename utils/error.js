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

const handleError = (err, res, context = "Unknown operation") => {
  console.error(`[ERROR] ${context}: ${err.name} - ${err.message}`);

  let mappedError;

  // Map known error types
  if (errorMap[err.name]) {
    mappedError = errorMap[err.name](err);
  }

  // Mongoose ValidationError fix: combine all field messages
  if (!mappedError && err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
    mappedError = {
      status: 400,
      error: "Bad Request",
      message: messages || "Validation failed",
    };
  }

  // AppError fallback
  if (!mappedError && (err instanceof AppError || err.name === "AppError")) {
    mappedError = {
      status: err.status || 500,
      error: err.error || "Error",
      message: err.message,
    };
  }

  // Last-resort fallback
  if (!mappedError) {
    mappedError = {
      status: 500,
      error: "Internal Server Error",
      message: err.message || "Unexpected error occurred",
    };
  }

  return res.status(mappedError.status).json(mappedError);
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
