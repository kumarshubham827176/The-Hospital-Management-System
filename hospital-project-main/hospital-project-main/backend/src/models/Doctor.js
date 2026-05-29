const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema(
  {
    day: String,
    start: String,
    end: String,
    shiftType: { type: String, enum: ['Morning', 'Evening', 'Night'], default: 'Morning' },
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: String, required: true },
    department: { type: String },
    licenseNumber: { type: String, unique: true, sparse: true },
    qualifications: [String],
    consultationFee: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    schedule: [shiftSchema],
    shiftAssignments: [
      {
        date: Date,
        shiftType: String,
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
