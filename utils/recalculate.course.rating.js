module.exports = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) return;

  const reviews = await Review.find({ course: courseId });
  const reviewCount = reviews.length;

  if (reviewCount === 0) {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: 0,
      reviewCount: 0,
    });
    return;
  }

  const totalRatingSum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
  const newAvg = totalRatingSum / reviewCount;

  await Course.findByIdAndUpdate(courseId, {
    averageRating: Math.round(newAvg * 10) / 10,
    reviewCount: reviewCount,
  });
};
