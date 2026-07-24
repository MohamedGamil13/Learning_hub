const { checkSchema } = require("express-validator");
const UserTypes = require("../constants/user.types");
const checkEmailExist = require("../utils/check.email.exist");
const registerValidator = checkSchema({
  name: {
    notEmpty: {
      errorMessage: "Name is required",
      bail: true,
    },
    isString: {
      errorMessage: "Name must be a valid string",
    },
    trim: true,
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
      bail: true,
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password should be at least 8 chars",
    },
    trim: true,
  },
  email: {
    notEmpty: {
      errorMessage: "Email is required",
      bail: true,
    },
    isEmail: {
      errorMessage: "Invalid email format",
      bail: true,
    },
    normalizeEmail: true,
    custom: {
      options: checkEmailExist,
    },
  },
  role: {
    notEmpty: {
      errorMessage: "Role is required",
      bail: true,
    },
    isIn: {
      options: [Object.values(UserTypes)],
      errorMessage: "Invalid user role",
    },
  },
});
const loginValidator = checkSchema({
  email: {
    notEmpty: {
      errorMessage: "Email is required",
      bail: true,
    },
    isEmail: {
      errorMessage: "Invalid email format",
      bail: true,
    },
    normalizeEmail: true,
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
      bail: true,
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password should be at least 8 chars",
    },
    trim: true,
  },
});

module.exports = {
  registerValidator,
  loginValidator,
};
