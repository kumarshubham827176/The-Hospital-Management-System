const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    medicines: [medicineSchema],
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
