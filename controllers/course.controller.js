const Course = require("../models/courses.model");
const Enrollment = require("../models/enrollment.model");
const asnycWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");

// 1. Get All Courses
const getAllCourses = asnycWrapper(async (req, res) => {
  const allCourses = await Course.find().populate("instructor", "name email");

  return res.status(200).json({
    status: responseStatus.SUCCESS,
    data: { courses: allCourses },
  });
});

// 2. Get Single Course By ID
const getCourseById = asnycWrapper(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId).populate(
    "instructor",
    "name email",
  );

  if (!course) {
    return res.status(404).json({
      status: responseStatus.FAIL,
      message: "No Course Found",
    });
  }

  return res.status(200).json({
    status: responseStatus.SUCCESS,
    data: { course },
  });
});

// 3. Get Enrolled Courses for Logged-in Student
const getEnrolledCourses = asnycWrapper(async (req, res) => {
  const studentId = req.user.id;

  const enrolledCourses = await Enrollment.find({
    student: studentId,
  }).populate("course");

  return res.status(200).json({
    status: responseStatus.SUCCESS,
    data: { courses: enrolledCourses },
  });
});

// 4. Get Added Courses for Logged-in Instructor
const getAddedCourses = asnycWrapper(async (req, res) => {
  const instructorId = req.user.id;

  const addedCourses = await Course.find({ instructor: instructorId });

  return res.status(200).json({
    status: responseStatus.SUCCESS,
    data: { courses: addedCourses },
  });
});

// 5. Add New Course
const addCourse = asnycWrapper(async (req, res) => {
  const newCourse = await Course.create({
    ...req.body,
    instructor: req.user.id,
  });

  return res.status(201).json({
    status: responseStatus.SUCCESS,
    data: { course: newCourse },
  });
});

module.exports = {
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  getAddedCourses,
  addCourse,
};
