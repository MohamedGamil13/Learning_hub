const express = require("express");
const userRouter = express.Router();

const validationMiddleware = require("../middlewares/validation.middleware");
const {
  registerValidator,
  loginValidator,
} = require("../validators/users.validator");
const {
  regController,
  loginController,
} = require("../controllers/user.controller");

userRouter.post(
  "/register",
  registerValidator,
  validationMiddleware,
  regController,
);

userRouter.post(
  "/login",
  loginValidator,
  validationMiddleware,
  loginController,
);

module.exports = userRouter;
