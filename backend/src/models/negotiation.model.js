const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['bot', 'user'], required: true },
  content: { type: String, required: true },
  offer: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

const negotiationSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productImage: { type: String },
    productSku: { type: String },
    basePrice: { type: Number },
    minAcceptablePrice: { type: Number },
    currentOffer: { type: Number },
    customerName: { type: String },
    customerInitials: { type: String },
    status: {
      type: String,
      enum: ['active', 'accepted', 'rejected', 'expired'],
      default: 'active',
    },
    messages: [messageSchema],
    roundsTotal: { type: Number, default: 3 },
    roundsUsed: { type: Number, default: 0 },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Negotiation', negotiationSchema);
