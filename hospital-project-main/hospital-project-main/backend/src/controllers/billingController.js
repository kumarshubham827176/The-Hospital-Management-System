const asyncHandler = require('express-async-handler');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');

const listInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find().populate({ path: 'patient', populate: { path: 'user', select: 'name email' } });
  res.json(invoices);
});

const createInvoice = asyncHandler(async (req, res) => {
  const payload = req.body;
  const subtotal = payload.items?.reduce((sum, item) => sum + Number(item.amount || 0), 0) || 0;
  const tax = Number(payload.tax || 0);
  const total = subtotal + tax;
  const invoice = await Invoice.create({ ...payload, subtotal, total });
  res.status(201).json(invoice);
});

const recordPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create(req.body);
  const invoice = await Invoice.findById(payment.invoice);
  if (invoice) {
    invoice.paidAmount = Number(invoice.paidAmount || 0) + Number(payment.amount || 0);
    invoice.status = invoice.paidAmount >= invoice.total ? 'Paid' : 'Pending';
    await invoice.save();
  }
  res.status(201).json(payment);
});

module.exports = { listInvoices, createInvoice, recordPayment };
