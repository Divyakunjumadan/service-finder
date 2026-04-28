const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    shopName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    serviceType: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    shopAddress: { type: String, required: true },
    serviceArea: { type: String, required: true },
    pricingInfo: { type: String, default: '' },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open'
    },
    availability: {
      type: String,
      enum: ['available', 'busy'],
      default: 'available'
    },
    isApproved: { type: Boolean, default: true },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
