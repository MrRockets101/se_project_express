const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(404).send({ message: "route not found" });
});
module.exports = router;
