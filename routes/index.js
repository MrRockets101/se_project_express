const router = require("express").Router();

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res) => {
  res.status(404).send({ message: "route not found" });
});
module.exports = router;
