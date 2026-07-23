const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./config/db.config");
const cors = require("cors");
const responseStatus = require("./constants/response.status");
app.use(express.static("uploads"));
app.use(cors());
app.use(express.json());
connectDB();
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: responseStatus.FAIL,
    data: {
      msg: "Route is not found",
    },
  });
});
const server = app.listen(process.env.PORT_NUMBER, () => {
  console.log("Server is running");
});
