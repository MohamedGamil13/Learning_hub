const AppError = require("../utils/app.error");

/**
 * Middleware that restricts access to specified roles
 * @param  {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("You are not allowed to access this resource", 403);
    }

    next();
  };
};
