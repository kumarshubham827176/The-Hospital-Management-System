const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { getDbStatus } = require('../config/db');

const DEMO_EMAIL = 'admin@hospital.com';
const DEMO_PASSWORD = 'admin123';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const buildProfile = async (user, body) => {
  if (user.role === 'Patient') {
    await Patient.create({
      user: user._id,
      mrn: body.mrn,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth,
      bloodGroup: body.bloodGroup,
      address: body.address,
      emergencyContact: body.emergencyContact,
      allergies: body.allergies || [],
      medicalHistory: body.medicalHistory || [],
      diagnosis: body.diagnosis,
      notes: body.notes,
    });
  }

  if (user.role === 'Doctor') {
    await Doctor.create({
      user: user._id,
      specialization: body.specialization || 'General Medicine',
      department: body.department,
      licenseNumber: body.licenseNumber,
      qualifications: body.qualifications || [],
      consultationFee: body.consultationFee || 0,
      schedule: body.schedule || [],
    });
  }
};

const register = asyncHandler(async (req, res) => {
  const { name, password, role, phone } = req.body;
  const email = String(req.body.email || '').trim().toLowerCase();
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const allowedRoles = ['Patient'];
  const creatingStaff = req.user && req.user.role === 'Admin' && ['Doctor', 'Admin'].includes(role);
  if (role && !allowedRoles.includes(role) && !creatingStaff) {
    res.status(403);
    throw new Error('Only admins can create staff users');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'Patient',
    phone,
  });

  await buildProfile(user, req.body);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: signToken(user._id),
  });
});

const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const { password } = req.body;

  // Fallback for local development when database is unavailable.
  if (!getDbStatus()) {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return res.json({
        _id: 'demo-admin',
        name: 'Demo Admin',
        email: DEMO_EMAIL,
        role: 'Admin',
        token: jwt.sign(
          { id: 'demo-admin', role: 'Admin', email: DEMO_EMAIL, demo: true },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        ),
      });
    }

    res.status(401);
    throw new Error('Invalid email or password');
  }

  const user = await User.findOne({ email }).select('+password');
  const isValid = user ? await user.matchPassword(password) : false;
  if (!isValid) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: signToken(user._id),
  });
});

const me = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { register, login, me };
