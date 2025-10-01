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

router.use(auth);

router.get("/", getItems); // public

router.post("/", auth, createItem);
router.put("/:itemId", auth, updateItem);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);
module.exports = router;
