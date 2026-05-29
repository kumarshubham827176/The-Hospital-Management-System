const express = require('express');
const { body } = require('express-validator');
const { listInvoices, createInvoice, recordPayment } = require('../controllers/billingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/invoices', protect, authorize('Admin', 'Doctor'), listInvoices);
router.post(
  '/invoices',
  protect,
  authorize('Admin', 'Doctor'),
  [body('patient').notEmpty(), body('items').isArray()],
  validateRequest,
  createInvoice
);
router.post('/payments', protect, authorize('Admin', 'Doctor'), recordPayment);

module.exports = router;
