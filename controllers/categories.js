const WeatherCategory = require("../models/weatherCategory");
const { AppError, sendSuccess } = require("../utils/error");
const { validateObjectId } = require("../utils/validation");

const createCategory = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new AppError(400, "Request body is required");
    }
    const category = await WeatherCategory.create(req.body);
    return sendSuccess(res, 201, category, null, false);
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await WeatherCategory.find({});
    return sendSuccess(res, 200, categories, null, false);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    validateObjectId(req.params.categoryId, "categoryId");
    const category = await WeatherCategory.findByIdAndDelete(
      req.params.categoryId
    );
    if (!category) throw new AppError(404, "Category not found");
    return sendSuccess(res, 204);
  } catch (err) {
    next(err);
  }
};

module.exports = { createCategory, getCategories, deleteCategory };
