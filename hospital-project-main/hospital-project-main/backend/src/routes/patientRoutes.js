const express = require('express');
const { body } = require('express-validator');
const {
  listPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('Admin', 'Doctor'), listPatients)
  .post(
    protect,
    authorize('Admin'),
    [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }), body('mrn').notEmpty()],
    validateRequest,
    createPatient
  );

router
  .route('/:id')
  .get(protect, authorize('Admin', 'Doctor', 'Patient'), getPatientById)
  .put(protect, authorize('Admin', 'Doctor'), updatePatient)
  .delete(protect, authorize('Admin'), deletePatient);

module.exports = router;
