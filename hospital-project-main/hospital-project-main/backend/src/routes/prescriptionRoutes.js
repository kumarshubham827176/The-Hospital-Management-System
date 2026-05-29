const express = require('express');
const { body } = require('express-validator');
const { listPrescriptions, createPrescription } = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('Admin', 'Doctor'), listPrescriptions)
  .post(
    protect,
    authorize('Admin', 'Doctor'),
    [body('doctor').notEmpty(), body('patient').notEmpty()],
    validateRequest,
    createPrescription
  );

module.exports = router;
