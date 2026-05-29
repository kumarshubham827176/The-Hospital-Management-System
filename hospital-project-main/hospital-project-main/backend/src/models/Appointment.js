const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Scheduled', 'Cancelled', 'Rescheduled', 'Completed'],
      default: 'Scheduled',
    },
    reason: { type: String },
    notes: { type: String },
    notificationStatus: { type: String, enum: ['Pending', 'Sent'], default: 'Pending' },
    rescheduledFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    cancelledReason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
