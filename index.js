const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./config/db.config");
connectDB();
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT_NUMBER, () => {
  console.log("Server is running ");
});
