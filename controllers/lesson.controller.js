const Lesson = require("../models/lesson.model");
const asyncWrapper = require("../middlewares/asnyc.wrapper");
const AppError = require("../utils/app.error");
const { sendSuccess, sendCreated } = require("../utils/api.response");

// Get Course's Lessons
const getCourseLessons = asyncWrapper(async (req, res) => {
  const { courseId } = req.params;

  const lessons = await Lesson.find({ course: courseId })
    .sort({ order: 1 })
    .lean();

  sendSuccess(res, { lessons });
});

// Get Lesson By Id
const getLessonById = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;

  const lesson = await Lesson.findOne({ course: courseId, _id: lessonId });

  if (!lesson) {
    throw new AppError("No Lesson Found", 404);
  }

  sendSuccess(res, { lesson });
});

// Add Lesson
const addLesson = asyncWrapper(async (req, res) => {
  const { courseId } = req.params;
  const { order } = req.body;

  await Lesson.updateMany(
    {
      course: courseId,
      order: { $gte: order },
    },
    {
      $inc: { order: 1 },
    },
  );

  const lesson = await Lesson.create({
    ...req.body,
    course: courseId,
  });

  sendCreated(res, { lesson });
});

// Edit Lesson
const editLesson = asyncWrapper(async (req, res) => {
  const { courseId, lessonId } = req.params;

  const updatedLesson = await Lesson.findOneAndUpdate(
    { _id: lessonId, course: courseId },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!updatedLesson) {
    throw new AppError("Lesson not found for this course", 404);
  }

  sendSuccess(res, { lesson: updatedLesson });
});

// Delete Lesson
const deleteLesson = asyncWrapper(async (req, res) => {
  const { courseId, lessonId } = req.params;

  const lessonToDelete = await Lesson.findOneAndDelete({
    _id: lessonId,
    course: courseId,
  });

  if (!lessonToDelete) {
    throw new AppError("Lesson not found for this course", 404);
  }

  await Lesson.updateMany(
    { course: courseId, order: { $gt: lessonToDelete.order } },
    { $inc: { order: -1 } },
  );

  sendSuccess(res, null);
});

// Change Single Lesson Order
const changeLessonOrder = asyncWrapper(async (req, res) => {
  const { courseId, lessonId } = req.params;
  const { newOrder } = req.body;

  if (!newOrder || newOrder < 1) {
    throw new AppError("Invalid order number provided", 400);
  }

  const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });

  if (!lesson) {
    throw new AppError("Lesson not found for this course", 404);
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

  sendSuccess(res, { lesson });
});

// Bulk Update Lessons Order
const updateLessonOrder = asyncWrapper(async (req, res) => {
  const { courseId } = req.params;
  const { lessonsOrder } = req.body;

  if (!Array.isArray(lessonsOrder) || lessonsOrder.length === 0) {
    throw new AppError("lessonsOrder must be a non-empty array", 400);
  }

  const bulkOps = lessonsOrder.map((item) => ({
    updateOne: {
      filter: { _id: item.lessonId, course: courseId },
      update: { $set: { order: item.order } },
    },
  }));

  await Lesson.bulkWrite(bulkOps);

  sendSuccess(res, { message: "Lessons order updated successfully" });
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
