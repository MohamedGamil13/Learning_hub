const express = require("express");
const coursesRouter = express.Router();

const asnycWrapper = require("../middlewares/asnyc.wrapper");
const authorize = require("../middlewares/authorization");
const UserTypes = require("../constants/user.types");
const validationMiddleware = require("../middlewares/validation.middleware");

// Validation Rules Import
const {
  validateCourseId,
  validateInstructorId,
  validateStudentId,
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

// Get all Courses (No validations needed, but middleware safe to pass)
coursesRouter.get("/", getAllCourses);

// Get Course by ID
coursesRouter.get(
  "/:courseId",
  validateCourseId,
  validationMiddleware,
  getCourseById,
);

// Get Enrolled Courses for a Student
coursesRouter.get(
  "/enrolled_courses/:studentId",
  authorize(UserTypes.STUDENT, UserTypes.ADMIN),
  validateStudentId,
  validationMiddleware,
  getEnrolledCourses,
);

// Get My Added Courses for an Instructor
coursesRouter.get(
  "/added_courses/:instructorId",
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateInstructorId,
  validationMiddleware,
  getAddedCourses,
);

// Add Course
coursesRouter.post(
  "/",
  authorize(UserTypes.ADMIN, UserTypes.INSTRUCTOR),
  createCourseValidation,
  validationMiddleware,
  addCourse,
);

// Delete Course
coursesRouter.delete(
  "/:courseId",
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validationMiddleware,
  asnycWrapper(/* TODO: deleteCourse controller */),
);

// Publish Course
coursesRouter.patch(
  "/:courseId/publish",
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validationMiddleware,
  asnycWrapper(/* TODO: publishCourse controller */),
);

// Unpublish Course
coursesRouter.patch(
  "/:courseId/unpublish",
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validationMiddleware,
  asnycWrapper(/* TODO: unpublishCourse controller */),
);

// Upload Thumbnail
coursesRouter.patch(
  "/:courseId/thumbnail",
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validationMiddleware,
  asnycWrapper(/* TODO: uploadThumbnail controller */),
);

// Edit Course
coursesRouter.patch(
  "/:courseId",
  authorize(UserTypes.ADMIN, UserTypes.INSTRUCTOR),
  validateCourseId,
  updateCourseValidation,
  validationMiddleware,
  asnycWrapper(/* TODO: editCourse controller */),
);

module.exports = coursesRouter;
