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

const getEnrollmentById = asyncWrapper(async (req, res) => {
  const enrollmentId = req.params.enrollmentId;
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    return res.status(200).json({
      status: responseStatus.SUCCESS,
      data: {
        message: " Enrollment Not Found ",
      },
    });
  }
  res.status(200).json({
    status: responseStatus.SUCCESS,
    data: {
      enrollment: enrollment,
    },
  });
});

const enrollCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const studentId = req.user.id;
  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
  });
  return res.status(201).json({
    status: responseStatus.SUCCESS,
    data: { enrollment },
  });
});
const cancelEnrollment = asyncWrapper(async (req, res) => {
  const enrollmentId = req.params.enrollmentId;

  const cancelEnrollment = await Enrollment.findByIdAndDelete(enrollmentId);
  return res.status(201).json({
    status: responseStatus.SUCCESS,
    data: { cancelEnrollment },
  });
});

module.exports = {
  getStudentEnrollments,
  getCourseStudents,
  getEnrollmentById,
  enrollCourse,
  cancelEnrollment,
};
