const { body, param } = require("express-validator");

// Parameter Validations
const validateCourseId = [
  param("courseId").isMongoId().withMessage("Invalid Course ID"),
];

const validateInstructorId = [
  param("instructorId").isMongoId().withMessage("Invalid Instructor ID"),
];

const validateStudentId = [
  param("studentId").isMongoId().withMessage("Invalid Student ID"),
];

// Create Course Validation
const createCourseValidation = [
  body("title").notEmpty().withMessage("Title is required").isString().trim(),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .trim(),

  body("instructor")
    .notEmpty()
    .withMessage("Instructor ID is required")
    .isMongoId()
    .withMessage("Invalid Instructor ID"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),

  body("thumbnail").optional({ values: "falsy" }).isString(),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published field must be a boolean"),
];

// Update Course Validation (Optional fields)
const updateCourseValidation = [
  body("title").optional().isString().trim(),
  body("description").optional().isString().trim(),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),
  body("thumbnail").optional({ values: "falsy" }).isString(),
  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean"),
];

module.exports = {
  validateCourseId,
  validateInstructorId,
  validateStudentId,
  createCourseValidation,
  updateCourseValidation,
};
