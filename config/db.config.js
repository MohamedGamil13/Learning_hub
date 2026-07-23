const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("MongoDB Connected=====");
  } catch (e) {
    console.error("Database Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
