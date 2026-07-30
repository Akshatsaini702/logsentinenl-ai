const mongoose = require('mongoose');

// Log analysis itself does not depend on MongoDB - the database only stores
// alert history. Exiting the process on a connection failure took the whole API
// down (and put Render into a restart loop), so we log and let the server run.
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not set - alert history will be unavailable.');
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error('Continuing without persistence - analysis still works.');
    return false;
  }
};

module.exports = connectDB;
