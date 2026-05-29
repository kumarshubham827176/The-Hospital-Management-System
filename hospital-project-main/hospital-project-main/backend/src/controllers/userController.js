const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

module.exports = { listUsers, updateUserRole };
