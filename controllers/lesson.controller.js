const Course = require("../models/courses.model");
const Lesson = require("../models/lesson.model");
const Enrollment = require("../models/enrollment.model");
const asyncWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");
const jwt = require("jsonwebtoken");
const asnycWrapper = require("../middlewares/asnyc.wrapper");

//controllers (Get Course's Lessons done)
const getCourseLessons = asnycWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const lessons = await Lesson.find({ course: courseId });
  console.log(lessons);
  if (lessons.length === 0) {
    return res.status(200).json({
      status: responseStatus.SUCCESS,
      data: {
        message: "No Lessons Found",
        lessons: lessons,
      },
    });
  }
  res.status(200).json({
    status: responseStatus.SUCCESS,
    data: {
      lessons: lessons,
    },
  });
});
//get Lesson By Id
const getLessonById = asnycWrapper(async (req, res) => {});
const addLesson = asnycWrapper(async (req, res) => {});
const editLesson = asnycWrapper(async (req, res) => {});
const deleteLesson = asnycWrapper(async (req, res) => {});
const changeLessonOrder = asnycWrapper(async (req, res) => {});
const updateLessonOrder = asnycWrapper(async (req, res) => {});

module.exports = {
  addLesson,
  editLesson,
  getCourseLessons,
  deleteLesson,
  getLessonById,
  changeLessonOrder,
  updateLessonOrder,
};
