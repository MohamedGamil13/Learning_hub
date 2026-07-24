const responseStatus = require("../constants/response.status");
const UserTypes = require("../constants/user.types");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      status: responseStatus.FAIL,
      data: {
        message: "You are not allowed to access this resource",
      },
    });
  };
};
