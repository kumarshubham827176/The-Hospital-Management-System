const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    items: [
      {
        description: String,
        amount: Number,
      },
    ],
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' },
    dueDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
