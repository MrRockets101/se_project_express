const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const userController = require("../controllers/user");

router.get("/", asyncHandler(userController.getUsers));
router.get("/:userId", asyncHandler(userController.getUser));
router.post("/", asyncHandler(userController.createUser));
router.put("/:userId", asyncHandler(userController.updateUser));
router.patch("/:userId", asyncHandler(userController.patchUser));
router.delete("/:userId", asyncHandler(userController.deleteUser));

module.exports = router;
