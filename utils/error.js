const handleError = (err, res, context = "Something went wrong") => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err.name === "ValidationError") {
    return res.status(400).send({
      status: 400,
      error: "Bad Request",
      message: err.message || "Validation failed",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).send({
      status: 400,
      error: "Bad Request",
      message: "Invalid ID format",
    });
  }

  if (err.name === "DocumentNotFoundError") {
    return res.status(404).send({
      status: 404,
      error: "Not Found",
      message: "Requested resource not found",
    });
  }

  return res.status(500).send({
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
    return res.status(204).send();
  }

  return res.status(statusCode).send({
    status: statusCode,
    message: message || statusText,
    data,
  });
};

module.exports = { handleError, sendSuccess };
