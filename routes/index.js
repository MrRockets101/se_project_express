const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createUser, logIn } = require("../controllers/user");

const {
  validateCreateUser,
  validateLogin,
} = require("../middlewares/validation");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

router.post("/signup", validateCreateUser, createUser);
router.post("/signin", validateLogin, logIn);

router.use("/items", clothingItemsRouter);

router.use(auth);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});

module.exports = router;
