const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    initials: { type: String },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    items: [{ name: String, qty: Number, price: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
