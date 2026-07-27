const express = require("express");
const enrollmentRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorization");
const UserTypes = require("../constants/user.types");
const validationMiddleware = require("../middlewares/validation.middleware");

// Validation imports
const {
  validateStudentId,
  validateCourseId,
  validateEnrollmentId,
  updateProgressValidation,
} = require("../validations/enrollment.validation"); // Adjust path as needed

// Controller imports
const {
  getMyEnrollments,
  getCourseStudents,
  getEnrollmentById,
  enrollCourse,
  cancelEnrollment,
  updateProgress,
} = require("../controllers/enrollment.controller");

//middlewares Imports
const checkEnrollment = require("../middlewares/check.enrollment");

// Apply auth protection globally to all enrollment routes
enrollmentRouter.use(authMiddleware);

// 1. getMyEnrollments (For Students & Admins)
enrollmentRouter.get(
  "/student/:studentId",
  authorize(UserTypes.STUDENT, UserTypes.ADMIN),
  validateStudentId,
  validationMiddleware,
  getMyEnrollments,
);

// 2. getCourseStudents (Instructor & Admin)
enrollmentRouter.get(
  "/course/:courseId",
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validationMiddleware,
  getCourseStudents,
);

// 3. getEnrollmentById (Admin & Instructor)
enrollmentRouter.get(
  "/:enrollmentId",
  authorize(UserTypes.ADMIN, UserTypes.INSTRUCTOR),
  validateEnrollmentId,
  checkEnrollment,
  validationMiddleware,
  getEnrollmentById,
);

// 4. enrollCourse (For Students)
enrollmentRouter.post(
  "/:courseId",
  authorize(UserTypes.STUDENT),
  validateCourseId,
  validationMiddleware,
  enrollCourse,
);

// 5. cancelEnrollment (Student, Admin, Instructor)
enrollmentRouter.delete(
  "/:enrollmentId",
  authorize(UserTypes.STUDENT, UserTypes.ADMIN, UserTypes.INSTRUCTOR),
  validateEnrollmentId,
  checkEnrollment,
  validationMiddleware,
  cancelEnrollment,
);

// 6. updateProgress (For Students)
enrollmentRouter.patch(
  "/progress",
  authorize(UserTypes.STUDENT),
  updateProgressValidation,
  validationMiddleware,
  updateProgress,
);

module.exports = enrollmentRouter;
