const Enrollment = require("../models/enrollment.model");
const User = require("../models/user.model");
const asyncWrapper = require("../middlewares/asnyc.wrapper");
const AppError = require("../utils/app.error");
const { sendSuccess, sendCreated } = require("../utils/api.response");

// Get Student Enrollments
const getStudentEnrollments = asyncWrapper(async (req, res) => {
  const studentId = req.params.studentId;

  const enrollments = await Enrollment.find({ student: studentId }).lean();

  sendSuccess(res, { Enrollments: enrollments });
});

// Get Course Students
const getCourseStudents = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;

  const enrollments = await Enrollment.find({ course: courseId })
    .select("student")
    .lean();

  const studentIds = enrollments.map((enrollment) => enrollment.student);

  if (studentIds.length === 0) {
    sendSuccess(res, { students: [] });
    return;
  }

  const students = await User.find({ _id: { $in: studentIds } }).lean();

  sendSuccess(res, { students });
});

// Get Enrollment By ID
const getEnrollmentById = asyncWrapper(async (req, res) => {
  const enrollmentId = req.params.enrollmentId;

  const enrollment = await Enrollment.findById(enrollmentId).lean();

  if (!enrollment) {
    throw new AppError("Enrollment Not Found", 404);
  }

  sendSuccess(res, { enrollment });
});

// Enroll in Course
const enrollCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const studentId = req.user.id;

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
  });

  sendCreated(res, { enrollment });
});

// Cancel Enrollment
const cancelEnrollment = asyncWrapper(async (req, res) => {
  const enrollmentId = req.params.enrollmentId;

  const canceledEnrollment = await Enrollment.findByIdAndDelete(enrollmentId);

  if (!canceledEnrollment) {
    throw new AppError("Enrollment Not Found", 404);
  }

  sendSuccess(res, { cancelEnrollment: canceledEnrollment });
});

module.exports = {
  getStudentEnrollments,
  getCourseStudents,
  getEnrollmentById,
  enrollCourse,
  cancelEnrollment,
};
