const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const {
  validateBody,
  validateParam,
  validators,
} = require("../utils/validation");
const {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.get("/", asyncHandler(getItems));
router.post(
  "/",
  validateBody({
    required: ["name", "weather", "imageURL"],
    custom: { imageURL: validators.url, weather: validators.weather },
  }),
  asyncHandler(createItem)
);
router.get("/:itemId", validateParam("itemId"), asyncHandler(getItem));
router.put(
  "/:itemId",
  validateParam("itemId"),
  validateBody({
    required: ["name", "weather", "imageURL"],
    custom: { imageURL: validators.url, weather: validators.weather },
  }),
  asyncHandler(updateItem)
);
router.patch(
  "/:itemId",
  validateParam("itemId"),
  validateBody({
    optional: ["name", "weather", "imageURL"],
    custom: { imageURL: validators.url, weather: validators.weather },
  }),
  asyncHandler(updateItem) // Using updateItem for PATCH as per your code
);
router.delete("/:itemId", validateParam("itemId"), asyncHandler(deleteItem));
router.put("/:itemId/likes", validateParam("itemId"), asyncHandler(likeItem));
router.delete(
  "/:itemId/likes",
  validateParam("itemId"),
  asyncHandler(unlikeItem)
);

module.exports = router;
