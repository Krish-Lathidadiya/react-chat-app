const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const URI = process.env.MONGO_URI;
    if (!URI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    const connectionDB = await mongoose.connect(URI);
    console.log('MongoDB connected:', connectionDB.connection.host);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports=connectDB