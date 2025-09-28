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
      weather: validators.weather, // Use async weather validator
      imageURL: validators.url,
    },
  }),
  asyncHandler(createItem)
);

router.put(
  "/:itemId",
  validateParam("itemId"),
  validateBody({
    required: ["name", "weather", "imageURL"], // Full update for PUT
    custom: {
      weather: validators.weather, // Use async weather validator
      imageURL: validators.url,
    },
  }),
  asyncHandler(updateItem)
);

router.patch(
  "/:itemId",
  validateParam("itemId"),
  validateBody({
    optional: ["name", "weather", "imageURL"], // Partial update
    custom: {
      weather: validators.weather, // Use async weather validator
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
