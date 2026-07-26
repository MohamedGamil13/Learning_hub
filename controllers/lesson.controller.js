const Course = require("../models/courses.model");
const Lesson = require("../models/lesson.model");
const Enrollment = require("../models/enrollment.model");
const asyncWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");
const jwt = require("jsonwebtoken");
const asnycWrapper = require("../middlewares/asnyc.wrapper");
const logger = require("../utils/logger");

//controllers (Get Course's Lessons done)
const getCourseLessons = asnycWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  logger.info(courseId);
  const lessons = await Lesson.find({ course: courseId });
  logger.info(lessons);

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

//get Lesson By Id (done)
const getLessonById = asnycWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  logger.info(courseId);
  const lessonId = req.params.lessonId;
  logger.info(lessonId);
  const lesson = await Lesson.findOne({ course: courseId, _id: lessonId });
  logger.info(lesson);

  if (!lesson) {
    return res.status(200).json({
      status: responseStatus.SUCCESS,
      data: {
        message: "No Lesson Found",
        lessons: lesson,
      },
    });
  }
  res.status(200).json({
    status: responseStatus.SUCCESS,
    data: {
      lesson: lesson,
    },
  });
});

//add Lesson
const addLesson = asnycWrapper(async (req, res) => {
  logger.info("Hii");
  const courseId = req.params.courseId;
  logger.info("Course Id is ", courseId);
  logger.info("Request Body Is ", req.body);
  const newLesson = await Lesson.create({
    course: courseId,
    ...req.body,
  });

  res.status(200).json({
    status: responseStatus.SUCCESS,
    data: {
      lesson: newLesson,
    },
  });
});
// Edit Lesson
const editLesson = asnycWrapper(async (req, res) => {
  const { courseId, lessonId } = req.params;

  const updatedLesson = await Lesson.findOneAndUpdate(
    { _id: lessonId, course: courseId },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!updatedLesson) {
    return res.status(404).json({
      status: responseStatus.FAIL,
      data: { message: "Lesson not found for this course" },
    });
  }

  res.status(200).json({
    status: responseStatus.SUCCESS,
    data: { lesson: updatedLesson },
  });
});
// Delete Lesson
const deleteLesson = asnycWrapper(async (req, res) => {
  const { courseId, lessonId } = req.params;

  const lessonToDelete = await Lesson.findOneAndDelete({
    _id: lessonId,
    course: courseId,
  });

  if (!lessonToDelete) {
    return res.status(404).json({
      status: responseStatus.FAIL,
      data: { message: "Lesson not found for this course" },
    });
  }

  await Lesson.updateMany(
    { course: courseId, order: { $gt: lessonToDelete.order } },
    { $inc: { order: -1 } },
  );

  res.status(200).json({
    status: responseStatus.SUCCESS,
    data: null,
  });
});
// Change Single Lesson Order
const changeLessonOrder = asnycWrapper(async (req, res) => {
  const { courseId, lessonId } = req.params;
  const { newOrder } = req.body;

  if (!newOrder || newOrder < 1) {
    return res.status(400).json({
      status: responseStatus.FAIL,
      data: { message: "Invalid order number provided" },
    });
  }

  const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
  if (!lesson) {
    return res.status(404).json({
      status: responseStatus.FAIL,
      data: { message: "Lesson not found for this course" },
    });
  }

  const currentOrder = lesson.order;

  if (currentOrder !== newOrder) {
    if (newOrder > currentOrder) {
      await Lesson.updateMany(
        {
          course: courseId,
          order: { $gt: currentOrder, $lte: newOrder },
        },
        { $inc: { order: -1 } },
      );
    } else {
      await Lesson.updateMany(
        {
          course: courseId,
          order: { $gte: newOrder, $lt: currentOrder },
        },
        { $inc: { order: 1 } },
      );
    }

    lesson.order = newOrder;
    await lesson.save();
  }

  res.status(200).json({
    status: responseStatus.SUCCESS,
    data: { lesson },
  });
});
// Bulk Update Lessons Order
const updateLessonOrder = asnycWrapper(async (req, res) => {
  const { courseId } = req.params;
  const { lessonsOrder } = req.body;

  if (!Array.isArray(lessonsOrder) || lessonsOrder.length === 0) {
    return res.status(400).json({
      status: responseStatus.FAIL,
      data: { message: "lessonsOrder must be a non-empty array" },
    });
  }

  const bulkOps = lessonsOrder.map((item) => ({
    updateOne: {
      filter: { _id: item.lessonId, course: courseId },
      update: { $set: { order: item.order } },
    },
  }));

  await Lesson.bulkWrite(bulkOps);

  res.status(200).json({
    status: responseStatus.SUCCESS,
    data: { message: "Lessons order updated successfully" },
  });
});

module.exports = {
  addLesson,
  editLesson,
  getCourseLessons,
  deleteLesson,
  getLessonById,
  changeLessonOrder,
  updateLessonOrder,
};
