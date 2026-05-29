const asyncHandler = require('express-async-handler');
const Prescription = require('../models/Prescription');

const listPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await Prescription.find()
    .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
    .populate('appointment');
  res.json(prescriptions);
});

const createPrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.create(req.body);
  const populated = await prescription
    .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
    .populate('appointment');
  res.status(201).json(populated);
});

module.exports = { listPrescriptions, createPrescription };
