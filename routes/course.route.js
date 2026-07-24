const express = require("express");
const coursesRouter = express.Router();

const asnycWrapper = require("../middlewares/asnyc.wrapper");
const authMiddleware = require("../middlewares/auth.middleware"); // التأكد من هوية المستخدم
const authorize = require("../middlewares/authorization");
const UserTypes = require("../constants/user.types");
const validationMiddleware = require("../middlewares/validation.middleware");

// Validation Rules Import
const {
  validateCourseId,
  createCourseValidation,
  updateCourseValidation,
} = require("../validators/course.validation");

// Controller Handlers Import
const {
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  getAddedCourses,
  addCourse,
} = require("../controllers/course.controller");

// 1. Get All Courses
coursesRouter.get("/", getAllCourses);

// 2. Get Enrolled Courses (للـ Student الحالي)
coursesRouter.get(
  "/enrolled_courses",
  authMiddleware,
  authorize(UserTypes.STUDENT, UserTypes.ADMIN),
  getEnrolledCourses,
);

// 3. Get My Added Courses (للـ Instructor الحالي)
coursesRouter.get(
  "/added_courses",
  authMiddleware,
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  getAddedCourses,
);

// 4. Get Course by ID
coursesRouter.get(
  "/:courseId",
  validateCourseId,
  validationMiddleware,
  getCourseById,
);

// 5. Add Course
coursesRouter.post(
  "/",
  authMiddleware,
  authorize(UserTypes.ADMIN, UserTypes.INSTRUCTOR),
  createCourseValidation,
  validationMiddleware,
  addCourse,
);

// 6. Edit Course
coursesRouter.patch(
  "/:courseId",
  authMiddleware,
  authorize(UserTypes.ADMIN, UserTypes.INSTRUCTOR),
  validateCourseId,
  updateCourseValidation,
  validationMiddleware,
  asnycWrapper(/* TODO: editCourse controller */),
);

// 7. Delete Course
coursesRouter.delete(
  "/:courseId",
  authMiddleware,
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validationMiddleware,
  asnycWrapper(/* TODO: deleteCourse controller */),
);

module.exports = coursesRouter;
