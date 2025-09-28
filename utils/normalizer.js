const normalizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const normalized = {};
  for (const key of Object.keys(obj)) {
    let normalizedKey = key;

    switch (key.toLowerCase()) {
      case "imageurl":
        normalizedKey = "imageURL";
        break;
      case "itemid":
        normalizedKey = "itemId";
        break;
      case "name":
        normalizedKey = "name";
        break;
      case "weather":
        normalizedKey = "weather";
        break;
    }

    normalized[normalizedKey] = obj[key];
  }
  return normalized;
};

module.exports = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = normalizeObject(req.body);
  }

  if (req.query && Object.keys(req.query).length > 0) {
    req.query = normalizeObject(req.query);
  }

  if (req.params && Object.keys(req.params).length > 0) {
    req.params = normalizeObject(req.params);

    // handle "null" string as null dynamically
    for (const key of Object.keys(req.params)) {
      if (
        typeof req.params[key] === "string" &&
        req.params[key].toLowerCase() === "null"
      ) {
        req.params[key] = null;
      }
    }
  }

  next();
};
