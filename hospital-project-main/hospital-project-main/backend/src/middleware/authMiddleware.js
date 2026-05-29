const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { getDbStatus } = require('../config/db');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.demo === true && !getDbStatus()) {
    req.user = {
      _id: 'demo-admin',
      name: 'Demo Admin',
      email: 'admin@hospital.com',
      role: 'Admin',
    };
    return next();
  }

  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('Access denied');
  }
  next();
};

module.exports = { protect, authorize };
