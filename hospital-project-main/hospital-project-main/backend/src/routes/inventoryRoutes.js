const express = require('express');
const { body } = require('express-validator');
const { listInventory, createItem, updateItem, deleteItem } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('Admin', 'Doctor'), listInventory)
  .post(protect, authorize('Admin', 'Doctor'), [body('name').notEmpty()], validateRequest, createItem);

router
  .route('/:id')
  .put(protect, authorize('Admin', 'Doctor'), updateItem)
  .delete(protect, authorize('Admin'), deleteItem);

module.exports = router;
