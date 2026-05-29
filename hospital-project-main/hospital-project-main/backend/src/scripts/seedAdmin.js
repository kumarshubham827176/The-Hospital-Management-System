const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  try {
    await connectDB();

    const email = (process.env.SEED_ADMIN_EMAIL || 'admin@hospital.com').toLowerCase();
    const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { email },
      {
        name: 'System Admin',
        email,
        password: passwordHash,
        role: 'Admin',
        phone: '0000000000',
        active: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Admin user ready: ${email}`);
    console.log(`Admin password set to: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

run();
