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

  if (errorMap[err.name]) {
    mappedError = errorMap[err.name](err);
  }

  if (!mappedError && (err instanceof AppError || err.name === "AppError")) {
    mappedError = {
      status: err.status || 500,
      error: err.error || httpStatus[err.status] || "Error",
      message: err.message,
    };
  }

  if (!mappedError) {
    mappedError = {
      status: 500,
      error: httpStatus[500],
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
