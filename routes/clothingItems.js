const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const {
  validateParam,
  validateBody,
  validators,
} = require("../utils/validation");
const {
  createItem,
  getItems,
  getItem,
  updateItem,
  patchItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const { weatherCategories } = require("../models/clothingItems");

router.get("/", asyncHandler(getItems));

router.get(
  "/:itemId",
  validateParam("itemId", { allowNull: true }),
  asyncHandler(getItem)
);

router.post(
  "/",
  validateBody({
    required: ["name", "weather", "imageURL"],
    custom: {
      weather: validators.enum(weatherCategories),
      imageURL: validators.url,
    },
  }),
  asyncHandler(createItem)
);

router.put(
  "/:itemId",
  validateParam("itemId"),
  validateBody({
    required: ["imageURL"],
    custom: { imageURL: validators.url },
  }),
  asyncHandler(updateItem)
);

router.patch(
  "/:itemId",
  validateParam("itemId"),
  validateBody({
    optional: ["weather", "imageURL"],
    custom: {
      weather: validators.enum(weatherCategories),
      imageURL: validators.url,
    },
  }),
  asyncHandler(patchItem)
);

router.delete("/:itemId", validateParam("itemId"), asyncHandler(deleteItem));

router.put("/:itemId/likes", validateParam("itemId"), asyncHandler(likeItem));
router.delete(
  "/:itemId/likes",
  validateParam("itemId"),
  asyncHandler(unlikeItem)
);

module.exports = router;
