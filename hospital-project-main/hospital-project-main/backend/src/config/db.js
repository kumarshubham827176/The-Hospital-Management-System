const mongoose = require('mongoose');

let isDbConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('\n❌ MONGODB_URI is not defined');
    console.error('Steps to fix:');
    console.error('  1. Check if backend/.env exists');
    console.error('  2. Verify MONGODB_URI=mongodb+srv://... is in the .env file');
    console.error('  3. Make sure there are no spaces around the = sign');
    console.error('  4. Restart the server after updating .env\n');
    throw new Error('MONGODB_URI environment variable is required but not set');
  }

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    family: 4,
    tls: true,
    retryWrites: true,
    appName: 'Cluster0',
  });

  isDbConnected = true;
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

const getDbStatus = () => isDbConnected;

module.exports = { connectDB, getDbStatus };
