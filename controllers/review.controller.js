const asyncWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");
const logger = require("../utils/logger");
const Review = require("../models/reviews.model");

const getCourseReviews = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const reviews = await Review.find({ course: courseId });
  logger.info("Reviews is ", reviews);
  if (reviews.length === 0) {
    return res.json({
      status: responseStatus.SUCCESS,
      data: {
        message: "No Reviews Yet",
      },
    });
  }
  res.json({
    status: responseStatus.SUCCESS,
    data: {
      reviews: reviews,
    },
  });
});
const getReviewById = asyncWrapper(async (req, res) => {
  const review = await Review.findById(id);
  logger.info("Review is ", review);
  res.json({
    status: responseStatus.SUCCESS,
    data: {
      review: review,
    },
  });
});

const addReview = asyncWrapper(async (req, res) => {
  const data = req.body;
  const newreview = await Review.create({
    ...data,
    course: req.params.courseId,
    student: req.user.id,
  });
  res.status(201).json({
    status: responseStatus.SUCCESS,
    data: {
      review: newreview,
    },
  });
});

const Review = require("../models/review.model");
const asyncWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");

// 1. Update Review
const updateReview = asyncWrapper(async (req, res) => {
  const { reviewId } = req.params;
  const updatedReview = req.body;

  const review = await Review.findByIdAndUpdate(reviewId, {
    ...updateReview,
    course: req.params.courseId,
    student: req.user.id, //for ensure that will not changes by User
  });
  return res.status(200).json({
    status: responseStatus.SUCCESS,
    data: { review: review },
  });
});

const deleteReview = asyncWrapper(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findByIdAndDelete(reviewId);

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
