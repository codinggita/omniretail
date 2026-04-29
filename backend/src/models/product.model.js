const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true },
    minAcceptablePrice: { type: Number },
    category: { type: String, required: true },
    storeCategory: { type: String },
    negotiationEnabled: { type: Boolean, default: false },
    stockStatus: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock'],
      default: 'in_stock',
    },
    stockQuantity: { type: Number, default: 0 },
    isSurplus: { type: Boolean, default: false },
    images: [{ url: String, isPrimary: Boolean }],
    specifications: { type: Map, of: String },
    variants: {
      sizes: [String],
      colors: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
