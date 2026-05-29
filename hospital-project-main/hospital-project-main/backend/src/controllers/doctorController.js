const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

const listDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find().populate('user', 'name email phone role');
  res.json(doctors);
});

const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone role');
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  res.json(doctor);
});

const createDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, phone, ...profile } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('Email already exists');
  }

  const user = await User.create({ name, email, password, phone, role: 'Doctor' });
  const doctor = await Doctor.create({ user: user._id, ...profile });
  const populated = await doctor.populate('user', 'name email phone role');
  res.status(201).json(populated);
});

const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  Object.assign(doctor, req.body);
  await doctor.save();
  res.json(doctor);
});

const assignShift = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  doctor.shiftAssignments.push(req.body);
  await doctor.save();
  res.json(doctor);
});

const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  await User.findByIdAndDelete(doctor.user);
  await doctor.deleteOne();
  res.json({ message: 'Doctor deleted' });
});

module.exports = { listDoctors, getDoctorById, createDoctor, updateDoctor, assignShift, deleteDoctor };
