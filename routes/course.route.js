const express = require("express");
const coursesRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorization");
const UserTypes = require("../constants/user.types");
const validationMiddleware = require("../middlewares/validation.middleware");

// Middlewares
const checkCourseOwners = require("../middlewares/check.course.owner.middleware");

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
  editCourse,
  deleteCourse,
} = require("../controllers/course.controller");

// --- Static Routes (Must come BEFORE dynamic /:courseId routes) ---

// 1. Get All Courses
coursesRouter.get("/", getAllCourses);

// 2. Get Student Enrolled Courses
coursesRouter.get(
  "/enrolled_courses",
  authMiddleware,
  authorize(UserTypes.STUDENT, UserTypes.ADMIN),
  getEnrolledCourses,
);

// 3. Get Instructor Added Courses
coursesRouter.get(
  "/added_courses",
  authMiddleware,
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  getAddedCourses,
);

// 4. Add Course
coursesRouter.post(
  "/",
  authMiddleware,
  authorize(UserTypes.ADMIN, UserTypes.INSTRUCTOR),
  createCourseValidation,
  validationMiddleware,
  addCourse,
);

// --- Dynamic Routes (Routes with /:courseId) ---

// 5. Get Course By ID
coursesRouter.get(
  "/:courseId",
  validateCourseId,
  validationMiddleware,
  getCourseById,
);

// 6. Edit Course
coursesRouter.patch(
  "/:courseId",
  authMiddleware,
  authorize(UserTypes.ADMIN, UserTypes.INSTRUCTOR),
  validateCourseId,
  validationMiddleware,
  checkCourseOwners(),
  updateCourseValidation,
  editCourse,
);

// 7. Delete Course
coursesRouter.delete(
  "/:courseId",
  authMiddleware,
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validationMiddleware,
  checkCourseOwners(),
  deleteCourse,
);

module.exports = coursesRouter;
