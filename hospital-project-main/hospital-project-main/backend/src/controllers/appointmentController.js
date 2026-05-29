const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const { sendNotification } = require('../utils/notificationService');

const listAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate({ path: 'patient', populate: { path: 'user', select: 'name email phone' } })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email phone' } })
    .sort({ scheduledAt: 1 });
  res.json(appointments);
});

const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.create(req.body);
  const populated = await appointment
    .populate({ path: 'patient', populate: { path: 'user', select: 'name email phone' } })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email phone' } });

  await sendNotification({
    user: populated.patient.user,
    type: 'Appointment Booked',
    message: `Your appointment is scheduled for ${populated.scheduledAt.toISOString()}`,
  });

  res.status(201).json(populated);
});

const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const previousDate = appointment.scheduledAt;
  Object.assign(appointment, req.body);
  if (req.body.scheduledAt && req.body.scheduledAt !== previousDate) {
    appointment.status = 'Rescheduled';
    appointment.rescheduledFrom = appointment.rescheduledFrom || appointment._id;
  }

  await appointment.save();
  res.json(appointment);
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  appointment.status = 'Cancelled';
  appointment.cancelledReason = req.body.reason || 'Cancelled by user';
  await appointment.save();
  res.json(appointment);
});

module.exports = { listAppointments, createAppointment, updateAppointment, cancelAppointment };
