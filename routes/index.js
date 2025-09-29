const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createUser, logIn } = require("../controllers/user");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

router.post("/signup", createUser);
router.post("/signin", logIn);

router.get("/items", clothingItemsRouter);

router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res) => {
  res.status(404).send({ message: "route not found" });
});

module.exports = router;
