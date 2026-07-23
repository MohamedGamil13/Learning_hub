const express = require("express");
const userRouter = express.Router();
const responseStatus = require("../constants/response.status");
userRouter.post("/api/users/register", (req, res) => {
  const userdata = req.body;
});

//get all Users
// auth (Registar,signIn)
/*
{
 username : 
} 

*/
