const mongoose = require('mongoose')
const connectDB = async () => {
    try {
      const conn = await mongoose.connect("mongodb+srv://vruti:20112002@atlascluster.nbwhdh4.mongodb.net/logintable", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB Connected`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
  module.exports = connectDB