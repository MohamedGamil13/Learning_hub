const Course = require("../models/courses.model");
const Enrollment = require("../models/enrollment.model");
const asyncWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");
const jwt = require("jsonwebtoken");

//controllers
const getMyEnrollments = asyncWrapper(async (req, res) => {});
const getCourseStudents = asyncWrapper(async (req, res) => {});
const getEnrollmentById = asyncWrapper(async (req, res) => {});
const enrollCourse = asyncWrapper(async (req, res) => {});
const cancelEnrollment = asyncWrapper(async (req, res) => {});
const updateProgress = asyncWrapper(async (req, res) => {});

module.exports = {
  getMyEnrollments,
  getCourseStudents,
  getEnrollmentById,
  enrollCourse,
  cancelEnrollment,
  updateProgress,
};
