const asyncWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");
const logger = require("../utils/logger");
const Review = require("../models/reviews.model");
const Course = require("../models/courses.model");

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
//averageRating
//reviewsCount
const addReview = asyncWrapper(async (req, res) => {
  const data = req.body;
  const newreview = await Review.create({
    ...data,
    course: req.params.courseId,
    student: req.user.id,
  });
  const course = await Course.findById(courseId);
  updateCourseData(course, newreview.rating);
  res.status(201).json({
    status: responseStatus.SUCCESS,
    data: {
      review: newreview,
    },
  });
});

const updateReview = asyncWrapper(async (req, res) => {
  const { courseId, reviewId } = req.params;
  const updatedReview = req.body;

  const review = await Review.findByIdAndUpdate(reviewId, {
    ...updateReview,
    course: req.params.courseId,
    student: req.user.id, //for ensure that will not changes by User
  });
  const course = await Course.findById(courseId);
  updateCourseData(course, review.rating);
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

function calcuateNewAvg(oldAvg, reviewsNumber, newRating) {
  const oldSum = oldAvg * reviewsNumber;
  const newSum = oldSum + newRating;
  return newSum / (reviewsNumber + 1);
}
async function updateCourseData(course, newRating) {
  const newAvg = calcuateNewAvg(
    course.averageRating,
    course.ratingsCount,
    newRating,
  );
  const newReviewCount = course.ratingsCount + 1;
  await Course.findByIdAndUpdate(course.id, {
    reviewCount: newReviewCount,
    averageRating: newAvg,
  });
}
