const mongoose = require('mongoose');
const { seedInitialData } = require('./seeder');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/skill_platform';
  
  // 1. If non-local URI (e.g. MongoDB Atlas), attempt standard connection
  const isLocal = uri.includes('localhost') || uri.includes('127.0.0.1');
  
  if (!isLocal) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      await seedInitialData();
      return;
    } catch (error) {
      console.error(`DB Connection Error (Remote): ${error.message}`);
      process.exit(1);
    }
  }

  // 2. Try connecting to local MongoDB daemon first
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
    await seedInitialData();
    return;
  } catch (localErr) {
    console.log('ℹ️ Local MongoDB instance not detected, initializing In-Memory MongoDB Server...');
  }

  // 3. Fallback to embedded MongoMemoryServer
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ Embedded In-Memory MongoDB Server Connected: ${conn.connection.host}`);
    await seedInitialData();
  } catch (err) {
    console.error(`DB Initialization Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
