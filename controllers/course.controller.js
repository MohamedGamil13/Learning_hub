const Course = require("../models/courses.model");
const Enrollment = require("../models/enrollment.model");
const asnycWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");
const mongoose = require("mongoose");

// 1. Get All Courses
const getAllCourses = asnycWrapper(async (req, res) => {
  const allCourses = await Course.find().populate("instructor", "name email");

  if (allCourses.length === 0) {
    return res.status(200).json({
      status: responseStatus.FAIL,
      message: "No Courses Yet",
      data: { courses: [] },
    });
  }

  return res.status(200).json({
    status: responseStatus.SUCCESS,
    data: { courses: allCourses },
  });
});

// 2. Get Single Course By ID
const getCourseById = asnycWrapper(async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({
      status: responseStatus.FAIL,
      message: "Course ID is not valid",
    });
  }

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

// 3. Get Enrolled Courses for a Student
const getEnrolledCourses = asnycWrapper(async (req, res) => {
  const { studentId } = req.params;

  if (!mongoose.isValidObjectId(studentId)) {
    return res.status(400).json({
      status: responseStatus.FAIL,
      message: "Student ID is not valid",
    });
  }

  const enrolledCourses = await Enrollment.find({
    student: studentId,
  }).populate("course");

  if (enrolledCourses.length === 0) {
    return res.status(200).json({
      status: responseStatus.FAIL,
      message: "No Enrolled Courses Found",
      data: { courses: [] },
    });
  }

  return res.status(200).json({
    status: responseStatus.SUCCESS,
    data: { courses: enrolledCourses },
  });
});

// 4. Get Courses Created by an Instructor
const getAddedCourses = asnycWrapper(async (req, res) => {
  const { instructorId } = req.params;

  if (!mongoose.isValidObjectId(instructorId)) {
    return res.status(400).json({
      status: responseStatus.FAIL,
      message: "Instructor ID is not valid",
    });
  }

  const addedCourses = await Course.find({ instructor: instructorId });

  if (addedCourses.length === 0) {
    return res.status(200).json({
      status: responseStatus.FAIL,
      message: "No Courses Found for this instructor",
      data: { courses: [] },
    });
  }

  return res.status(200).json({
    status: responseStatus.SUCCESS,
    data: { courses: addedCourses },
  });
});

const addCourse = asnycWrapper(async (req, res) => {
  const { title, price } = req.body;
  const course = await Course.create({
    title: title,
    price: price,
  });
});

module.exports = {
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  getAddedCourses,
  addCourse,
};
