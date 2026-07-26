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

// 1. Get Course Lessons (Public)
lessonRouter.get("/", validateCourseId, validationMiddleware, getCourseLessons);

// 2. Get Lesson By ID (Public)
lessonRouter.get(
  "/:lessonId",
  validateCourseId,
  (req, res, next) => {
    console.log(1);
    next();
  },
  validateLessonId,
  (req, res, next) => {
    console.log(2);
    next();
  },
  validationMiddleware,
  (req, res, next) => {
    console.log(3);
    next();
  },
  getLessonById,
);

// 3. Add Lesson (Protected)
lessonRouter.post(
  "/",
  authMiddleware,
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  checkCourseOwners,
  validateCourseId,
  createLessonValidation,
  validationMiddleware,
  addLesson,
);

// 4. Edit Lesson Details (Protected)
lessonRouter.patch(
  "/:lessonId",
  authMiddleware,
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  checkCourseOwners,
  validateCourseId,
  validateLessonId,
  updateLessonValidation,
  validationMiddleware,
  editLesson,
);

// 5. Delete Lesson (Protected)
lessonRouter.delete(
  "/:lessonId",
  authMiddleware,
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  checkCourseOwners,
  validateCourseId,
  validateLessonId,
  validationMiddleware,
  deleteLesson,
);

// 6. Change Lesson Order Specific Route
lessonRouter.patch(
  "/:lessonId/order",
  authMiddleware,
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  checkCourseOwners,
  validateCourseId,
  validateLessonId,
  changeLessonOrderValidation,
  validationMiddleware,
  changeLessonOrder,
);

module.exports = lessonRouter;
