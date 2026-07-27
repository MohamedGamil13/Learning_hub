const Course = require("../models/courses.model");
const Enrollment = require("../models/enrollment.model");
const User = require("../models/user.model");
const asyncWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");
const jwt = require("jsonwebtoken");

//controllers
const getStudentEnrollments = asyncWrapper(async (req, res) => {
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
  const enrollments = await Enrollment.find({ course: courseId });
  const studentsIds = enrollments.map((enrollment) => {
    return enrollment.student;
  });
  const students = await User.find({ _id: { $in: studentsIds } });
  if (students.length == 0) {
    return res.json({
      status: responseStatus.SUCCESS,
      data: {
        message: "No Students Enrolled in this Course",
      },
    });
  }
  res.json({
    status: responseStatus.SUCCESS,
    data: {
      students: students,
    },
  });
});
const getEnrollmentById = asyncWrapper(async (req, res) => {});
const enrollCourse = asyncWrapper(async (req, res) => {});
const cancelEnrollment = asyncWrapper(async (req, res) => {});
const updateProgress = asyncWrapper(async (req, res) => {});

module.exports = {
  getStudentEnrollments,
  getCourseStudents,
  getEnrollmentById,
  enrollCourse,
  cancelEnrollment,
  updateProgress,
};
