const { body, param } = require("express-validator");

const validateLessonId = [
  param("lessonId").isMongoId().withMessage("Invalid Lesson ID"),
];

const createLessonValidation = [
  body("title").notEmpty().isString().trim(),

  body("description").optional().isString().trim(),

  body("videoUrl").notEmpty().isString().trim(),

  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration must be numeric"),

  body("order")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Order must be greater than or equal to 1"),

  body("isPreview")
    .optional()
    .isBoolean()
    .withMessage("isPreview must be boolean"),
];

const updateLessonValidation = [
  body("title").optional().isString().trim(),

  body("description").optional().isString().trim(),

  body("videoUrl").optional().isString().trim(),

  body("duration").optional().isNumeric(),

  body("order").optional().isInt({ min: 1 }),

  body("isPreview").optional().isBoolean(),
];

const changeLessonOrderValidation = [
  body("newOrder")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("newOrder must be greater than 0"),
];

module.exports = {
  validateLessonId,
  createLessonValidation,
  updateLessonValidation,
  changeLessonOrderValidation,
};
