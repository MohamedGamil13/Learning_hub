const express = require("express");
const lessonRouter = express.Router({ mergeParams: true });

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorization");
const UserTypes = require("../constants/user.types");
const validationMiddleware = require("../middlewares/validation.middleware");
const { validateCourseId } = require("../validators/course.validation");
const {
  addLesson,
  editLesson,
  getCourseLessons,
  deleteLesson,
  getLessonById,
  changeLessonOrder,
  updateLessonOrder,
} = require("../controllers/lesson.controller");
//getCourseLessons
lessonRouter.get("/", validateCourseId, getCourseLessons);
//getLessonById
lessonRouter.get("/", validateCourseId, getLessonById);
//add Lesson
lessonRouter.post("/", addLesson);
//edit Lesson
lessonRouter.patch("/", editLesson);
//delete lesson
lessonRouter.delete("/", deleteLesson);
//changeLessonOrder
lessonRouter.patch("/", changeLessonOrder);
//updateLessonOrder
lessonRouter.patch("/", updateLessonOrder);

module.exports = lessonRouter;
