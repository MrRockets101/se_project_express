const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  patchUser,
} = require("../controllers/user");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
router.put("/:userId", updateUser);
router.patch("/:userId", patchUser);
router.delete("/:userId", deleteUser);

module.exports = router;
