const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `MongoDB COnnected:${conn.connection.host}`.cyan.underline.bold
    );
  } catch (error) {
    console.log("MongoDB Connection Error: ", error);
  }
};

module.exports = connectDB;
