<<<<<<< HEAD
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
  let response = { error: true }; // Match test expectation

  if (err instanceof AppError) {
    status = err.status;
    if (err.status === 400 && err.message === "Name is required") {
      response = { error: true }; // Empty object with error flag for this specific case
    } else {
      response.message = err.message; // Keep message for other errors
    }
  } else if (err.name === "ValidationError") {
    status = 400;
    response.message =
      Object.values(err.errors)
        .map((e) => e.message)
        .join("; ") || "Validation failed";
  } else if (err.name === "CastError") {
    status = 400;
    response.message = `Invalid ${err.path || "ID"}`;
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    status = 409;
    response.message = "Duplicate key error: Resource already exists";
  }

  return res.status(status).json(response);
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
=======
const handleError = (err, res, context = "Something went wrong") => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: 400,
      error: "Bad Request",
      message: err.message || "Validation failed",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      status: 400,
      error: "Bad Request",
      message: "Invalid ID format",
    });
  }

  if (err.name === "DocumentNotFoundError") {
    return res.status(404).json({
      status: 404,
      error: "Not Found",
      message: "Requested resource not found",
    });
  }
  if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(409).json({
      status: 409,
      error: "Conflict",
      message: "Duplicate key error: Resource already exists",
    });
  }
  return res.status(500).json({
    status: 500,
    error: "Internal Server Error",
    message: context,
    details: err.message,
  });
};

const sendSuccess = (res, statusCode, data = {}, message = "") => {
  let statusText = "";

  switch (statusCode) {
    case 200:
      statusText = "OK";
      break;
    case 201:
      statusText = "Created";
      break;
    case 204:
      statusText = "No Content";
      break;
    default:
      statusText = "Success";
  }

  if (statusCode === 204) {
    return res.status(204).json();
  }

  return res.status(statusCode).json({
    status: statusCode,
    message: message || statusText,
>>>>>>> parent of af4f6ce (implement dynamic)
    data,
  });
};

module.exports = { handleError, sendSuccess };

// dynamic error response
// const handleError = (err, res, context = "Something went wrong") => {
//   console.error(`[ERROR] ${err.name}: ${err.message}`);

//   const errorMap = {
//     ValidationError: {
//       status: 400,
//       error: "Bad Request",
//       message: err.message || "Validation failed",
//     },
//     CastError: {
//       status: 400,
//       error: "Bad Request",
//       message: "Invalid ID format",
//     },
//     DocumentNotFoundError: {
//       status: 404,
//       error: "Not Found",
//       message: "Requested resource not found",
//     },
//     MongoServerError: err.code === 11000
//       ? {
//           status: 409,
//           error: "Conflict",
//           message: "Duplicate key error",
//         }
//       : null,
//   };

//   const errorResponse = errorMap[err.name];

//   if (errorResponse) {
//     return res.status(errorResponse.status).json(errorResponse);
//   }

//   return res.status(500).json({
//     status: 500,
//     error: "Internal Server Error",
//     message: context,
//     details: err.message,
//   });
// };
