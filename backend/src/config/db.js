const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wanderlust';

  try {
    // Attempt standard connection with 2.5s server selection timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`✅ MongoDB Connected successfully to: ${mongoose.connection.host}:${mongoose.connection.port}`);
  } catch (error) {
    console.warn(`⚠️ Local MongoDB daemon is not running on ${uri}.`);
    console.log(`🚀 Seamlessly starting embedded in-memory MongoDB server...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`✅ Embedded MongoDB Server started & connected at: ${memUri}`);
    } catch (memError) {
      console.error(`❌ Failed to start embedded MongoDB:`, memError);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
