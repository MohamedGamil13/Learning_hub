const Course = require("../models/courses.model");
const asnycWrapper = require("../middlewares/asnyc.wrapper");
const UserTypes = require("../constants/user.types");
const responseStatus = require("../constants/response.status");
const isValidNumber = require("../utils/check.valid.number");
const mongoose = require("mongoose");

const getAllCourses = asnycWrapper(async (req, res) => {
  const allCourses = await Course.find();
  if (!allCourses) {
    throw new Error("Server Error");
  }
  if (allCourses.length === 0) {
    return res.status(200).json({
      status: responseStatus.FAIL,
      message: "No Courses Yet",
      data: {
        courses: allCourses,
      },
    });
  }
  res.status(200).json({
    status: responseStatus.SUCCESS,
    data: {
      courses: allCourses,
    },
  });
});

const getCourseById = asnycWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  if (mongoose.isValidObjectId(courseId)) {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(200).json({
        status: responseStatus.FAIL,
        message: "No Courses Found",
      });
    }
    res.status(200).json({
      status: responseStatus.SUCCESS,
      data: {
        course: course,
      },
    });
  }
  res.status(400).json({
    status: responseStatus.ERROR,
    message: "Course Id is not Vaild",
  });
});

const getEnrolledCourses = asnycWrapper(async (req, res) => {});

module.exports = { getAllCourses, getCourseById, getEnrolledCourses };
