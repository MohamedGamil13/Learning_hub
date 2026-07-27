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

lessonRouter
  .get("/", validateCourseId, validationMiddleware, getCourseLessons)
  .get(
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
  )
  .post(
    "/",
    authMiddleware,
    authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
    checkCourseOwners,
    validateCourseId,
    createLessonValidation,
    validationMiddleware,
    addLesson,
  )
  .patch(
    "/:lessonId",
    authMiddleware,
    authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
    checkCourseOwners,
    validateCourseId,
    validateLessonId,
    updateLessonValidation,
    validationMiddleware,
    editLesson,
  )
  .delete(
    "/:lessonId",
    authMiddleware,
    authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
    checkCourseOwners,
    validateCourseId,
    validateLessonId,
    validationMiddleware,
    deleteLesson,
  )
  .patch(
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
