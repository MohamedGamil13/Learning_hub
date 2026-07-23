const express = require("express");
const userRouter = express.Router();
const responseStatus = require("../constants/response.status");
const { registerValidator } = require("../validators/users.validator");
const { validationResult } = require("express-validator");
userRouter.post("/register", registerValidator, (req, res) => {
  const resivedData = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: responseStatus.FAIL,
      data: {
        msg: errors.array(),
      },
    });
  }
  res.status(200).json({
    resivedData,
  });
});

//get all Users
// auth (Registar,signIn)
/*
{
 username : 
} 

*/
module.exports = userRouter;
