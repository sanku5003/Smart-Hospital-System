const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // If configured to use memory DB or if local connection fails, use MongoMemoryServer
    if (process.env.USE_MEMORY_DB === 'true') {
      console.log('⚡ Initializing embedded MongoMemoryServer for instant zero-config setup...');
      mongoMemoryServer = await MongoMemoryServer.create();
      mongoUri = mongoMemoryServer.getUri();
    }

    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected successfully: ${mongoUri}`);
  } catch (error) {
    console.warn(`⚠️ Direct MongoDB connection failed (${error.message}). Falling back to MongoMemoryServer...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const mongoUri = mongoMemoryServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`✅ Fallback MongoMemoryServer connected: ${mongoUri}`);
    } catch (fallbackErr) {
      console.error('❌ MongoDB Connection Error:', fallbackErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
