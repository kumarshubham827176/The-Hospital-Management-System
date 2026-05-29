const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, unique: true, sparse: true },
    batchNo: String,
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: 'pcs' },
    expiryDate: Date,
    supplier: String,
    reorderLevel: { type: Number, default: 10 },
    purchasePrice: Number,
    sellingPrice: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
