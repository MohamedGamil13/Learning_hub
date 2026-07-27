const express = require("express");
const coursesRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
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
  editCourse,
  deleteCourse,
} = require("../controllers/course.controller");

// 1. Get All Courses
coursesRouter
  .get("/", getAllCourses)
  .patch(
    "/:courseId",
    authMiddleware,
    authorize(UserTypes.ADMIN, UserTypes.INSTRUCTOR),
    validateCourseId,
    updateCourseValidation,
    validationMiddleware,
    editCourse,
  )
  .get(
    "/enrolled_courses",
    authMiddleware,
    authorize(UserTypes.STUDENT, UserTypes.ADMIN),
    getEnrolledCourses,
  )
  .get(
    "/added_courses",
    authMiddleware,
    authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
    getAddedCourses,
  )
  .get("/:courseId", validateCourseId, validationMiddleware, getCourseById)
  .post(
    "/",
    authMiddleware,
    authorize(UserTypes.ADMIN, UserTypes.INSTRUCTOR),
    createCourseValidation,
    validationMiddleware,
    addCourse,
  )
  .delete(
    "/:courseId",
    authMiddleware,
    authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
    validateCourseId,
    validationMiddleware,
    deleteCourse,
  );

module.exports = coursesRouter;
