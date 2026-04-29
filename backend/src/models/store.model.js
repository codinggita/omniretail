const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    openingHours: { type: String, default: '9:00 AM - 10:00 PM' },
    isMainBranch: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for geo queries
storeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Store', storeSchema);
