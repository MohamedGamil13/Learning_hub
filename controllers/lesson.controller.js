const Course = require("../models/courses.model");
const Enrollment = require("../models/enrollment.model");
const asyncWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");
const jwt = require("jsonwebtoken");
const asnycWrapper = require("../middlewares/asnyc.wrapper");

//controllers
const addLesson = asnycWrapper(async (req, res) => {});
const editLesson = asnycWrapper(async (req, res) => {});
const getCourseLessons = asnycWrapper(async (req, res) => {});
const deleteLesson = asnycWrapper(async (req, res) => {});
const getLessonById = asnycWrapper(async (req, res) => {});
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
