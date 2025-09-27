const errorMap = {
  ValidationError: {
    status: 400,
    error: "Bad Request",
    message: (err) => err.message || "Validation failed",
  },
  CastError: {
    status: 400,
    error: "Bad Request",
    message: () => "Invalid ID format",
  },
  DocumentNotFoundError: {
    status: 404,
    error: "Not Found",
    message: () => "Requested resource not found",
  },
  MongoServerError: (err) => {
    if (err.code === 11000) {
      return {
        status: 409,
        error: "Conflict",
        message: "Duplicate key error: Resource already exists",
      };
    }
    return null;
  },
};

const handleError = (err, res, context = "Something went wrong") => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  let errorResponse;

  if (errorMap[err.name]) {
    if (typeof errorMap[err.name] === "function") {
      errorResponse = errorMap[err.name](err);
    } else {
      errorResponse = {
        status: errorMap[err.name].status,
        error: errorMap[err.name].error,
        message: errorMap[err.name].message(err),
      };
    }
  }

  if (!errorResponse) {
    errorResponse = {
      status: 500,
      error: "Internal Server Error",
      message: context,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    };
  }

  return res.status(errorResponse.status).json(errorResponse);
};

const sendSuccess = (res, statusCode = 200, data = {}) => {
  const statusMap = {
    200: "OK",
    201: "Created",
    204: "No Content",
  };

  if (statusCode === 204) {
    return res.status(204).send();
  }

  return res.status(statusCode).json({
    status: statusCode,
    message: statusMap[statusCode] || "Success",
    data,
  });
};

module.exports = { handleError, sendSuccess };
