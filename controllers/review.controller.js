const asyncWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");
const logger = require("../utils/logger");
const Review = require("../models/reviews.model");
const Course = require("../models/courses.model");
const recalculateCourseRating;

const getCourseReviews = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const reviews = await Review.find({ course: courseId });

  if (reviews.length === 0) {
    return res.json({
      status: responseStatus.SUCCESS,
      data: { message: "No Reviews Yet" },
    });
  }

  res.json({
    status: responseStatus.SUCCESS,
    data: { reviews },
  });
});

const getReviewById = asyncWrapper(async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({
      status: responseStatus.FAIL,
      data: { message: "Review not found" },
    });
  }

  res.json({
    status: responseStatus.SUCCESS,
    data: { review },
  });
});

const addReview = asyncWrapper(async (req, res) => {
  const { courseId } = req.params; // 🛠️ تم استخراج courseId
  const data = req.body;

  const newReview = await Review.create({
    ...data,
    course: courseId,
    student: req.user.id,
  });

  // إعادة حساب متوسط تقييم الكورس
  await recalculateCourseRating(courseId);

  res.status(201).json({
    status: responseStatus.SUCCESS,
    data: { review: newReview },
  });
});

const updateReview = asyncWrapper(async (req, res) => {
  const { courseId, reviewId } = req.params;
  const updatedData = req.body;

  const review = await Review.findByIdAndUpdate(
    reviewId,
    {
      ...updatedData,
      course: courseId,
      student: req.user.id,
    },
    { new: true },
  );

  await recalculateCourseRating(courseId);

  return res.status(200).json({
    status: responseStatus.SUCCESS,
    data: { review },
  });
});

const deleteReview = asyncWrapper(async (req, res) => {
  const { courseId, reviewId } = req.params;

  const review = await Review.findByIdAndDelete(reviewId);

  if (!review) {
    return res.status(404).json({
      status: responseStatus.FAIL,
      data: { message: "Review not found" },
    });
  }

  await recalculateCourseRating(courseId);

  return res.status(200).json({
    status: responseStatus.SUCCESS,
    data: null,
  });
});

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getCourseReviews,
  getReviewById,
};
