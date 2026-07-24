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

//reg Route
userRouter.post(
  "/register",
  registerValidator,
  validationMiddleware,
  regController,
);

//login Route
userRouter.post(
  "/login",
  loginValidator,
  validationMiddleware,
  loginController,
);
module.exports = userRouter;
