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
} = require("../validators/enrollment.validation");

// Controller imports
const {
  getStudentEnrollments,
  getCourseStudents,
  getEnrollmentById,
  enrollCourse,
  cancelEnrollment,
  updateProgress,
} = require("../controllers/enrollment.controller");

// Middlewares Imports
const checkEnrollment = require("../middlewares/check.enrollment");
const checkCourseOwners = require("../middlewares/check.course.owner.middleware");

// Apply auth protection globally to all enrollment routes
enrollmentRouter.use(authMiddleware);

// 1. getStudentEnrollments (For Students & Admins)
enrollmentRouter.get(
  "/student/:studentId",
  authorize(UserTypes.STUDENT, UserTypes.ADMIN),
  validateStudentId,
  validationMiddleware,
  getStudentEnrollments,
);

// 2. getCourseStudents (Instructor & Admin)
enrollmentRouter.get(
  "/course/:courseId",
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validationMiddleware,
  checkCourseOwners(),
  getCourseStudents,
);

// 3. getEnrollmentById (Admin & Instructor)
enrollmentRouter.get(
  "/:enrollmentId",
  authorize(UserTypes.ADMIN, UserTypes.INSTRUCTOR),
  validateEnrollmentId,
  validationMiddleware,
  checkEnrollment,
  checkCourseOwners(),
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

// 6. cancelEnrollment (Student, Admin, Instructor)
enrollmentRouter.delete(
  "/:enrollmentId",
  authorize(UserTypes.STUDENT, UserTypes.ADMIN, UserTypes.INSTRUCTOR),
  validateEnrollmentId,
  validationMiddleware,
  checkEnrollment,
  checkCourseOwners(),
  cancelEnrollment,
);

module.exports = enrollmentRouter;
