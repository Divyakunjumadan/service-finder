const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request'
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' }
  },
  { timestamps: true }
);

// Each user can only review a vendor once per request
reviewSchema.index({ userId: 1, requestId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
