const router = require("express").Router();
const {
  createUser,
  logIn,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/user");
const auth = require("../middlewares/auth");
// no token require
router.post("/signup", createUser);
router.post("/signin", logIn);

router.use(auth);
// token required
router.get("/users", getCurrentUser);
router.patch("/users", updateCurrentUser);

module.exports = router;
