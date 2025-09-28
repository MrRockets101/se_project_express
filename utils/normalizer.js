const normalizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const normalized = {};
  for (const key of Object.keys(obj)) {
    let normalizedKey = key;
    if (key.toLowerCase() === "imageurl") normalizedKey = "imageURL";
    if (key.toLowerCase() === "weather") normalizedKey = "weather";
    if (key.toLowerCase() === "name") normalizedKey = "name";
    if (key.toLowerCase() === "itemid") normalizedKey = "itemId";

    normalized[normalizedKey] = obj[key];
  }
  return normalized;
};

module.exports = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = normalizeObject(req.body);

    if (!req.body.weather) {
      req.body.weather = "any";
    }
    if (!req.body.imageURL) {
      req.body.imageURL = "https://placehold.co/200";
    }
  }

  if (req.query && Object.keys(req.query).length > 0) {
    req.query = normalizeObject(req.query);
  }

  if (req.params && Object.keys(req.params).length > 0) {
    req.params = normalizeObject(req.params);

    if (req.params.itemId && req.params.itemId.toLowerCase() === "null") {
      req.params.itemId = null;
    }
  }

  next();
};
