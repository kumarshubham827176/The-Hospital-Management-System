const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');
const User = require('../models/User');

const listPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find()
    .populate('user', 'name email phone role')
    .populate('assignedDoctor');
  res.json(patients);
});

const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id)
    .populate('user', 'name email phone role')
    .populate({ path: 'assignedDoctor', populate: { path: 'user', select: 'name email phone' } });

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  res.json(patient);
});

const createPatient = asyncHandler(async (req, res) => {
  const { name, email, password, phone, ...profile } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('Email already exists');
  }

  const user = await User.create({ name, email, password, phone, role: 'Patient' });
  const patient = await Patient.create({ user: user._id, ...profile });
  const populated = await patient.populate('user', 'name email phone role');
  res.status(201).json(populated);
});

const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  Object.assign(patient, req.body);
  await patient.save();
  res.json(patient);
});

const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  await User.findByIdAndDelete(patient.user);
  await patient.deleteOne();
  res.json({ message: 'Patient deleted' });
});

module.exports = { listPatients, getPatientById, createPatient, updatePatient, deletePatient };
