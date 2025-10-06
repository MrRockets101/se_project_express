const handleError = (err, res, context = "Something went wrong") => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ message: messages.join(", "), statusText: "Bad Request" });
  }

  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ message: "Invalid ID format", statusText: "Bad Request" });
  }

  if (err.name === "MongoServerError" && err.code === 11000) {
    return res
      .status(409)
      .json({ message: "Email already exists", statusText: "Conflict" });
  }

  if (err.name === "DocumentNotFoundError") {
    return res.status(404).json({
      message: "Requested resource not found",
      statusText: "Not Found",
    });
  }

  return res
    .status(500)
    .json({ message: context, statusText: "Internal Server Error" });
};

const sendSuccess = (res, statusCode = 200, data = {}, message = "Success") => {
  console.log(statusCode);
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
      statusCode = 200;
  }
  console.log(statusCode, data);
  if (statusCode === 204) return res.status(204).json({});

  // If data is an array, send it directly
  if (Array.isArray(data)) {
    return res.status(statusCode).json(data);
  }
  console.log(data);
  // For objects, spread data and include message & statusText
  return res.status(statusCode).json({
    ...data,
    message,
    statusText,
  });
};

module.exports = { handleError, sendSuccess };
