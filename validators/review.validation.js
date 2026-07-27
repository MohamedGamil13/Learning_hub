const { body, param } = require("express-validator");

// 1. Validate Mongo ObjectIds in Route Parameters
const validateCourseId = [
  param("courseId").isMongoId().withMessage("Invalid Course ID"),
];

const validateReviewId = [
  param("reviewId").isMongoId().withMessage("Invalid Review ID"),
];

// 2. Create Review Validation (POST)
const createReviewValidation = [
  body("courseId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Course ID in body"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  body("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a string")
    .trim(),
];

// 3. Update Review Validation (PATCH / PUT)
const updateReviewValidation = [
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  body("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a string")
    .trim(),
];

module.exports = {
  validateCourseId,
  validateReviewId,
  createReviewValidation,
  updateReviewValidation,
};
