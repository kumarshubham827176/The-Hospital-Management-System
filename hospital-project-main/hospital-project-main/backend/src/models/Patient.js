const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const historySchema = new mongoose.Schema(
  {
    condition: String,
    diagnosis: String,
    notes: String,
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    mrn: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: { type: Date },
    bloodGroup: { type: String },
    address: { type: String },
    emergencyContact: { type: String },
    allergies: [String],
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    medicalHistory: [historySchema],
    reports: [reportSchema],
    diagnosis: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
