const express = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validateRequest,
  login
);

router.get('/me', protect, me);

module.exports = router;
