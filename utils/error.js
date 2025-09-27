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
