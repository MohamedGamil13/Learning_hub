const { body, param } = require("express-validator");

// Parameter Validations
const validateLessonId = [
  param("lessonId").isMongoId().withMessage("Invalid Lesson ID"),
];

// Create Lesson Validation
const createLessonValidation = [
  body("title").notEmpty().withMessage("Title is required").isString().trim(),

  body("description").optional().isString().trim(),

  body("videoUrl")
    .notEmpty()
    .withMessage("Video URL is required")
    .isString()
    .trim(),

  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration must be a number"),

  body("order")
    .notEmpty()
    .withMessage("Order is required")
    .isInt({ min: 1 })
    .withMessage("Order must be a number greater than or equal to 1"),

  body("isPreview")
    .optional()
    .isBoolean()
    .withMessage("IsPreview must be a boolean"),
];

// Update Lesson Validation
const updateLessonValidation = [
  body("title").optional().isString().trim(),

  body("description").optional().isString().trim(),

  body("videoUrl").optional().isString().trim(),

  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration must be a number"),

  body("order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Order must be a number greater than or equal to 1"),

  body("isPreview")
    .optional()
    .isBoolean()
    .withMessage("IsPreview must be a boolean"),
];

module.exports = {
  validateLessonId,
  createLessonValidation,
  updateLessonValidation,
};
