const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const {
  validateParam,
  validateBody,
  validators,
} = require("../utils/validation");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  patchUser,
  deleteUser,
} = require("../controllers/user");

router.get("/", asyncHandler(getUsers));

// POST
router.post(
  "/",
  validateBody({
    required: ["name", "avatar"],
    custom: { avatar: validators.url },
  }),
  asyncHandler(createUser)
);

// GET by ID
router.get("/:userId", validateParam("userId"), asyncHandler(getUser));

// PUT
router.put(
  "/:userId",
  validateParam("userId"),
  validateBody({
    required: ["name", "avatar"],
    custom: { avatar: validators.url },
  }),
  asyncHandler(updateUser)
);

// PATCH
router.patch(
  "/:userId",
  validateParam("userId"),
  validateBody({
    optional: ["name", "avatar"],
    custom: { avatar: validators.url },
  }),
  asyncHandler(patchUser)
);

// DELETE
router.delete("/:userId", validateParam("userId"), asyncHandler(deleteUser));

module.exports = router;
