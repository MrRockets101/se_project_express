const httpStatus = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Entity",
  500: "Internal Server Error",
};

class AppError extends Error {
  constructor(status = 500, message = "Internal Server Error") {
    super(message);
    this.status = status;
    this.error = httpStatus[status] || "Error";
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError, httpStatus };
