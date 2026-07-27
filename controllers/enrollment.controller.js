const Course = require("../models/courses.model");
const Enrollment = require("../models/enrollment.model");
const asyncWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");
const jwt = require("jsonwebtoken");

//controllers
const getMyEnrollments = asyncWrapper(async (req, res) => {
  const studentId = req.params.studentId;
  const enrollments = await Enrollment.find({ student: studentId });
  if (enrollments.length == 0) {
    return res.status(200).json({
      status: responseStatus.SUCCESS,
      data: {
        message: "No Courses Enrollments yet",
      },
    });
  }
  res.status(200).json({
    status: responseStatus.SUCCESS,
    data: {
      Enrollments: enrollments,
    },
  });
});

const getCourseStudents = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
});
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
