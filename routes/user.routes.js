const express = require("express");
const userRouter = express.Router();
const responseStatus = require("../constants/response.status");
const { registerValidator } = require("../validators/users.validator");
const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

userRouter.post("/register", registerValidator, async (req, res) => {
  const resivedData = req.body;
  console.log(req.body);
  const errors = validationResult(req);
  console.log(errors.isEmpty());
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: responseStatus.FAIL,
      data: {
        msg: errors.array(),
      },
    });
  }
  const user = new userModel(resivedData);
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  user.password = hashedPassword;
  await user.save();
  res.status(201).json({
    user,
  });
});

/*
encrypt Password , done
don't return  "__v": 0 , password 
implement JWT

*/
module.exports = userRouter;
