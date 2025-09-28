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

const handleError = (err, res) => {
  console.error(`[ERROR] ${err.name} - ${err.message}`);

  let mappedError;

  if (err.name === "ValidationError") {
    // Robustly handle Mongoose validation errors
    const messages =
      err.errors && Object.values(err.errors).length
        ? Object.values(err.errors)
            .map((e) => e.message)
            .join("; ")
        : err.message || "Validation failed";
    mappedError = {
      status: 400,
      error: "Bad Request",
      message: messages,
    };
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    mappedError = {
      status: 409,
      error: "Conflict",
      message: "Duplicate key error: Resource already exists",
    };
  } else if (err instanceof AppError) {
    mappedError = {
      status: err.status,
      error: err.error,
      message: err.message,
    };
  } else {
    mappedError = {
      status: 500,
      error: "Internal Server Error",
      message: err.message || "Unexpected error",
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
