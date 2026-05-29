const express = require('express');
const { body } = require('express-validator');
const { listUsers, updateUserRole } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', protect, authorize('Admin'), listUsers);
router.patch('/:id/role', protect, authorize('Admin'), [body('role').isIn(['Admin', 'Doctor', 'Patient'])], validateRequest, updateUserRole);

module.exports = router;
