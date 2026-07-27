const { body, param } = require("express-validator");

// Parameter Validations
const validateStudentId = [
  param("studentId").isMongoId().withMessage("Invalid Student ID"),
];

const validateCourseId = [
  param("courseId").isMongoId().withMessage("Invalid Course ID"),
];

const validateEnrollmentId = [
  param("enrollmentId").isMongoId().withMessage("Invalid Enrollment ID"),
];

// Body Validations
const updateProgressValidation = [
  body("enrollmentId")
    .notEmpty()
    .withMessage("Enrollment ID is required")
    .isMongoId()
    .withMessage("Invalid Enrollment ID"),

  body("progress")
    .notEmpty()
    .withMessage("Progress is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Progress must be a number between 0 and 100"),
];

module.exports = {
  validateStudentId,
  validateCourseId,
  validateEnrollmentId,
  updateProgressValidation,
};
