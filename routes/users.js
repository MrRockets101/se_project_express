const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/user");
const auth = require("../middlewares/auth");
const { validateUpdateUser } = require("../middlewares/validation");

router.use(auth);
// token required
router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUser, updateCurrentUser);

module.exports = router;
