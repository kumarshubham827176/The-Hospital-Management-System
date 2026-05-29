const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['Cash', 'Card', 'BankTransfer', 'Online'], default: 'Online' },
    transactionId: String,
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
