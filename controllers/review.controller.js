const asyncWrapper = require("../middlewares/asnyc.wrapper");
const Review = require("../models/reviews.model");
const recalculateCourseRating = require("../utils/recalculate.course.rating");
const AppError = require("../utils/app.error");
const { sendSuccess, sendCreated } = require("../utils/api.response");

const getCourseReviews = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;

  const reviews = await Review.find({ course: courseId }).lean();

  sendSuccess(res, { reviews });
});

const getReviewById = asyncWrapper(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId).lean();

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  sendSuccess(res, { review });
});

const addReview = asyncWrapper(async (req, res) => {
  const { courseId } = req.params;

  const newReview = await Review.create({
    ...req.body,
    course: courseId,
    student: req.user.id,
  });

  await recalculateCourseRating(courseId);

  sendCreated(res, { review: newReview });
});

const updateReview = asyncWrapper(async (req, res) => {
  const { courseId, reviewId } = req.params;

  const review = await Review.findByIdAndUpdate(
    reviewId,
    {
      ...req.body,
      course: courseId,
      student: req.user.id,
    },
    { new: true, runValidators: true },
  );

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  await recalculateCourseRating(courseId);

  sendSuccess(res, { review });
});

const deleteReview = asyncWrapper(async (req, res) => {
  const { courseId, reviewId } = req.params;

  const review = await Review.findByIdAndDelete(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  await recalculateCourseRating(courseId);

  sendSuccess(res, null);
});

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getCourseReviews,
  getReviewById,
};
