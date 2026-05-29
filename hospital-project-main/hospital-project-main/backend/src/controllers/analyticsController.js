const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [patients, doctors, appointments, revenueAgg, upcomingAppointments] = await Promise.all([
    Patient.countDocuments(),
    Doctor.countDocuments(),
    Appointment.countDocuments(),
    Invoice.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, revenue: { $sum: '$total' } } },
    ]),
    Appointment.countDocuments({ status: 'Scheduled' }),
  ]);

  res.json({
    patients,
    doctors,
    appointments,
    upcomingAppointments,
    revenue: revenueAgg[0]?.revenue || 0,
  });
});

module.exports = { getDashboardStats };
