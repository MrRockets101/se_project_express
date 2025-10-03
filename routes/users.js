const router = require("express").Router();
const {
  createUser,
  logIn,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/user");
const auth = require("../middlewares/auth");

router.post("/signup", createUser);
router.post("/signin", logIn);

router.use(auth);
router.get("/users", getCurrentUser);
router.patch("/user", updateCurrentUser);

module.exports = router;
