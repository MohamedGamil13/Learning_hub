const express = require("express");
const userRouter = express.Router();
const validationMiddleware = require("../middlewares/validation.middleware");
const { registerValidator } = require("../validators/users.validator");
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
// userRouter.get("/signIn");
/*
encrypt Password , done
don't return  "__v": 0 , password  done
implement JWT
*/
module.exports = userRouter;
