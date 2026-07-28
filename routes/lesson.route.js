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
  updateLessonOrder,
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

// Protected Routes
lessonRouter.use(authMiddleware);

// Add Lesson
lessonRouter.post(
  "/",
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
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validateLessonId,
  validationMiddleware,
  checkCourseOwners(),
  changeLessonOrderValidation,
  validationMiddleware,
  changeLessonOrder,
);

// Bulk Update Lessons Order
lessonRouter.patch(
  "/order",
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateCourseId,
  validationMiddleware,
  checkCourseOwners(),
  updateLessonOrder,
);

module.exports = lessonRouter;
