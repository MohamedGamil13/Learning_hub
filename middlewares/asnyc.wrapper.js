const AppError = require("../utils/app.error");

/**
 * Wraps async route handlers to catch errors and pass them to the error handler
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      if (error.name === "CastError") {
        return next(new AppError("Invalid ID format", 400));
      }

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return next(new AppError(`Duplicate value for ${field}`, 409));
      }

      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors)
          .map((val) => val.message)
          .join(", ");
        return next(new AppError(messages, 400));
      }

      next(error);
    });
  };
};
