const express = require('express');
const { body } = require('express-validator');
const {
  listAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('Admin', 'Doctor', 'Patient'), listAppointments)
  .post(
    protect,
    authorize('Admin', 'Doctor', 'Patient'),
    [body('patient').notEmpty(), body('doctor').notEmpty(), body('scheduledAt').notEmpty()],
    validateRequest,
    createAppointment
  );

router.put('/:id', protect, authorize('Admin', 'Doctor', 'Patient'), updateAppointment);
router.post('/:id/cancel', protect, authorize('Admin', 'Doctor', 'Patient'), cancelAppointment);

module.exports = router;
