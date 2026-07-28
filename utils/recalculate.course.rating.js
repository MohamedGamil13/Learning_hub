const Course = require("../models/courses.model");
const Review = require("../models/reviews.model");

/**
 * Recalculate the average rating for a course based on its reviews
 * @param {string} courseId - The ID of the course to recalculate ratings for
 */
const recalculateCourseRating = async (courseId) => {
  const stats = await Review.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$rating" },
        ratingsCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length === 0) {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: 0,
      ratingsCount: 0,
    });
    return;
  }

  await Course.findByIdAndUpdate(courseId, {
    averageRating: Math.round(stats[0].averageRating * 10) / 10,
    ratingsCount: stats[0].ratingsCount,
  });
};

module.exports = recalculateCourseRating;
