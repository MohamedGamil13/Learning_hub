const { checkSchema } = require("express-validator");
const UserTypes = require("../constants/user.types");
const checkEmailExist = require("../utils/check.email.exist");
const registerValidator = checkSchema({
  name: {
    isString: true,
    trim: true,
    notEmpty: true,
    errorMessage: "Invalid username",
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Password should be at least 8 chars",
    },
    notEmpty: true,
    trim: true,
  },
  email: {
    isEmail: true,
    normalizeEmail: true,
    errorMessage: "Invalid email",
    custom: {
      options: checkEmailExist,
    },
  },
  role: {
    isIn: {
      options: [Object.values(UserTypes)],
    },
    errorMessage: "Invalid userRole",
    notEmpty: true,
  },
});

module.exports = {
  registerValidator,
};
