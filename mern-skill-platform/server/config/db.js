const mongoose = require('mongoose');
const { seedInitialData } = require('./seeder');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const isExplicitRemote = uri && !uri.includes('localhost') && !uri.includes('127.0.0.1');

  // 1. If explicit remote MongoDB URI (e.g. MongoDB Atlas) is provided
  if (isExplicitRemote) {
    try {
      console.log('Connecting to remote MongoDB...');
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      await seedInitialData();
      return conn;
    } catch (error) {
      console.error(`DB Connection Error (Remote): ${error.message}`);
      process.exit(1);
    }
  }

  // 2. If in local development with an active MongoDB service running locally
  if (process.env.NODE_ENV !== 'production') {
    const localUri = uri || 'mongodb://localhost:27017/skill_platform';
    try {
      const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 1500 });
      console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
      await seedInitialData();
      return conn;
    } catch (localErr) {
      console.log('ℹ️ Local MongoDB instance not detected, switching cleanly to In-Memory MongoDB Server...');
      await mongoose.disconnect().catch(() => {});
    }
  }

  // 3. Embedded In-Memory Mongo Server (for Render without Atlas or instant local testing)
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create({
      binary: {
        version: '7.0.14',
      },
    });
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ Embedded In-Memory MongoDB Connected: ${conn.connection.host}`);
    await seedInitialData();
    return conn;
  } catch (err) {
    console.error(`DB Initialization Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
