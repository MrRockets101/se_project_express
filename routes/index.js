const router = require("express").Router();
const clothingItems = require("../models/clothingItems");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItems);

router.use((req, res) => {
  res.status(404).send({ message: "route not found" });
});
module.exports = router;
