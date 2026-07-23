const express = require("express");
const userRouter = express.Router();
const { registerValidator } = require("../validators/users.validator");
const regController = require("../controllers/user.controller");
userRouter.post("/register", registerValidator, regController);

/*
encrypt Password , done
don't return  "__v": 0 , password  done
implement JWT
*/
module.exports = userRouter;
