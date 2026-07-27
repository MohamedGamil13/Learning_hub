const express = require("express");
const lessonRouter = express.Router({ mergeParams: true });

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorization");
const UserTypes = require("../constants/user.types");
const validationMiddleware = require("../middlewares/validation.middleware");

const { validateCourseId } = require("../validators/course.validation");
const checkCourseOwners = require("../middlewares/check.course.owner.middleware");
const {
  validateLessonId,
  createLessonValidation,
  updateLessonValidation,
  changeLessonOrderValidation,
} = require("../validators/lesson.validation");

const {
  addLesson,
  editLesson,
  getCourseLessons,
  deleteLesson,
  getLessonById,
  changeLessonOrder,
} = require("../controllers/lesson.controller");

// Public Get Course Lessons
lessonRouter.get("/", validateCourseId, validationMiddleware, getCourseLessons);

// Public Get Single Lesson By ID
lessonRouter.get(
  "/:lessonId",
  validateCourseId,
  validateLessonId,
  validationMiddleware,
  getLessonById,
);

// Add Lesson
lessonRouter.post(
  "/",
  authMiddleware,
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validationMiddleware,
  checkCourseOwners(),
  createLessonValidation,
  validationMiddleware,
  addLesson,
);

// Edit Lesson
lessonRouter.patch(
  "/:lessonId",
  authMiddleware,
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validateLessonId,
  validationMiddleware,
  checkCourseOwners(),
  updateLessonValidation,
  validationMiddleware,
  editLesson,
);

// Delete Lesson
lessonRouter.delete(
  "/:lessonId",
  authMiddleware,
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validateLessonId,
  validationMiddleware,
  checkCourseOwners(),
  deleteLesson,
);

// Change Lesson Order
lessonRouter.patch(
  "/:lessonId/order",
  authMiddleware,
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validateLessonId,
  validationMiddleware,
  checkCourseOwners(),
  changeLessonOrderValidation,
  validationMiddleware,
  changeLessonOrder,
);

module.exports = lessonRouter;
