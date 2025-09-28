const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const { validateBody, validateParam } = require("../utils/validation");
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require("../controllers/categories");

router.get("/", asyncHandler(getCategories));

router.post(
  "/",
  validateBody({
    required: ["name"],
  }),
  asyncHandler(createCategory)
);

router.delete(
  "/:categoryId",
  validateParam("categoryId"),
  asyncHandler(deleteCategory)
);

module.exports = router;
