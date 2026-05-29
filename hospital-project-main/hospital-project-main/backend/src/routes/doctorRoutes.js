const express = require('express');
const { body } = require('express-validator');
const {
  listDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  assignShift,
  deleteDoctor,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('Admin', 'Doctor'), listDoctors)
  .post(
    protect,
    authorize('Admin'),
    [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }), body('specialization').notEmpty()],
    validateRequest,
    createDoctor
  );

router.post('/:id/shift', protect, authorize('Admin'), assignShift);

router
  .route('/:id')
  .get(protect, authorize('Admin', 'Doctor'), getDoctorById)
  .put(protect, authorize('Admin'), updateDoctor)
  .delete(protect, authorize('Admin'), deleteDoctor);

module.exports = router;
