const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    text: String,
    rating: { type: Number, min: 1, max: 5 },
    time: String,
  },
  { timestamps: true }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    totalSpend: { type: Number, default: 0 },
    status: { type: String, enum: ['Top', 'Active', 'Inactive'], default: 'Active' },
    avatar: { type: String },
    initials: { type: String },
    feedback: [feedbackSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
