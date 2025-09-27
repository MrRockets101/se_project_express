const router = require("express").Router();
const AppError = require("../utils/AppError");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
});

module.exports = router;
