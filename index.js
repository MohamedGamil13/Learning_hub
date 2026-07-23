const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./config/db.config");
const cors = require("cors");
const responseStatus = require("./constants/response.status");
// Middle WaresUsage
app.use(express.static("uploads"));
app.use(cors());
app.use(express.json());

//connect DB
connectDB();

//default Route
app.get("/", (req, res) => {
  res.send("Hello World");
});
// For none Existing Routes
app.use((req, res) => {
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
