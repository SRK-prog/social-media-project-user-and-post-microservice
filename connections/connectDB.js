const mongoose = require("mongoose");

const connectDB = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("Connected to MongoDB");
        resolve();
      })
      .catch(reject);
  });
};

module.exports = connectDB;
