const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateCreateItem,
  validateItemId,
} = require("../middlewares/validation");
// Public route
router.get("/", getItems);

// Protected routes
router.use(auth);
router.post("/", validateCreateItem, createItem);
router.put("/:itemId", validateItemId, updateItem);
router.delete("/:itemId", validateItemId, deleteItem);
router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, unlikeItem);

module.exports = router;
