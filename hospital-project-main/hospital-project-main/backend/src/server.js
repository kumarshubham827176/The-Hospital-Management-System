const path = require('path');

// Load .env file from parent directory (backend/.env)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const { connectDB } = require('./config/db');

// Debug: Log which env file is being used
console.log(`[DEBUG] Looking for .env at: ${path.resolve(__dirname, '../.env')}`);
console.log(`[DEBUG] MONGODB_URI defined: ${!!process.env.MONGODB_URI}`);
console.log(`[DEBUG] NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed, starting in demo mode:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();