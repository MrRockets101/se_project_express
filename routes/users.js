const router = require("express").Router();
const {
  createUser,
  logIn,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/user");
const auth = require("../middlewares/auth");
// no token require

router.use(auth);
// token required
router.get("/me", getCurrentUser);
router.patch("/me", updateCurrentUser);

module.exports = router;
