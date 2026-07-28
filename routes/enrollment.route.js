const express = require("express");
const enrollmentRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorization");
const UserTypes = require("../constants/user.types");
const validationMiddleware = require("../middlewares/validation.middleware");

const {
  validateStudentId,
  validateCourseId,
  validateEnrollmentId,
} = require("../validators/enrollment.validation");

const {
  getStudentEnrollments,
  getCourseStudents,
  getEnrollmentById,
  enrollCourse,
  cancelEnrollment,
} = require("../controllers/enrollment.controller");

const checkCourseOwners = require("../middlewares/check.course.owner.middleware");

// Apply auth protection globally to all enrollment routes
enrollmentRouter.use(authMiddleware);

enrollmentRouter.get(
  "/student/:studentId",
  authorize(UserTypes.STUDENT, UserTypes.ADMIN),
  validateStudentId,
  validationMiddleware,
  getStudentEnrollments,
);

enrollmentRouter.get(
  "/course/:courseId",
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validationMiddleware,
  checkCourseOwners(),
  getCourseStudents,
);

enrollmentRouter.get(
  "/:enrollmentId",
  authorize(UserTypes.ADMIN, UserTypes.INSTRUCTOR),
  validateEnrollmentId,
  validationMiddleware,
  checkCourseOwners(),
  getEnrollmentById,
);

enrollmentRouter.post(
  "/:courseId",
  authorize(UserTypes.STUDENT),
  validateCourseId,
  validationMiddleware,
  enrollCourse,
);

enrollmentRouter.delete(
  "/:enrollmentId",
  authorize(UserTypes.STUDENT, UserTypes.ADMIN, UserTypes.INSTRUCTOR),
  validateEnrollmentId,
  validationMiddleware,
  checkCourseOwners(),
  cancelEnrollment,
);

module.exports = enrollmentRouter;
