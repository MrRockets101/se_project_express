const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const {
  validateBody,
  validateParam,
  validators,
} = require("../utils/validation");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  patchUser,
  deleteUser,
} = require("../controllers/user");

router.get("/", asyncHandler(getUsers));

router.post(
  "/",
  validateBody({
    required: ["name", "avatar"],
    custom: { avatar: validators.url },
  }),
  asyncHandler(createUser)
);

router.get("/:userId", validateParam("userId"), asyncHandler(getUser));

router.put(
  "/:userId",
  validateParam("userId"),
  validateBody({
    required: ["name", "avatar"],
    custom: { avatar: validators.url },
  }),
  asyncHandler(updateUser)
);

router.patch(
  "/:userId",
  validateParam("userId"),
  validateBody({
    optional: ["name", "avatar"],
    custom: { avatar: validators.url },
  }),
  asyncHandler(patchUser)
);

router.delete("/:userId", validateParam("userId"), asyncHandler(deleteUser));

module.exports = router;
