const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
  patchItem,
} = require("../controllers/clothingItems");

router.get("/", asyncHandler(getItems));
router.post("/", asyncHandler(createItem));
router.put("/:itemId", asyncHandler(updateItem));
router.patch("/:itemId", asyncHandler(patchItem));
router.delete("/:itemId", asyncHandler(deleteItem));
router.put("/:itemId/likes", asyncHandler(likeItem));
router.delete("/:itemId/likes", asyncHandler(unlikeItem));

module.exports = router;
