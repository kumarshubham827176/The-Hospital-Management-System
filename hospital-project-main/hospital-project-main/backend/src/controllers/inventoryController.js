const asyncHandler = require('express-async-handler');
const InventoryItem = require('../models/InventoryItem');

const listInventory = asyncHandler(async (req, res) => {
  const items = await InventoryItem.find().sort({ createdAt: -1 });
  res.json(items);
});

const createItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.create(req.body);
  res.status(201).json(item);
});

const updateItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    res.status(404);
    throw new Error('Inventory item not found');
  }
  res.json(item);
});

const deleteItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Inventory item not found');
  }
  res.json({ message: 'Inventory item deleted' });
});

module.exports = { listInventory, createItem, updateItem, deleteItem };
