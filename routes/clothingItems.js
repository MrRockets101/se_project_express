const router = require("express").Router();
const { createItem, getItems } = require("..//controllers/clothingItems");

//CRUD

//CREATE
router.post("/", createItem);

//READ
router.get("/", getItems);

//UPDATE
router.put("/:itemId", updateItem);

//DELETE
router.delete("/:itemId", deleteItem);

module.exports = router;
