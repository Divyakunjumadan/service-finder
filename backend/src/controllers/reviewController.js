const Review = require('../models/Review');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');

// @desc  Submit a review for a vendor
// @route POST /api/reviews
// @access Private (user)
const createReview = async (req, res) => {
  try {
    const { vendorId, requestId, rating, comment } = req.body;

    if (!vendorId || !rating) {
      return res.status(400).json({ success: false, message: 'Vendor ID and rating are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    // Check if review already exists for this request
    const existingReview = await Review.findOne({ userId: req.user._id, requestId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this request.' });
    }

    const review = await Review.create({
      userId: req.user._id,
      vendorId,
      requestId,
      rating,
      comment: comment || ''
    });

    // Recalculate vendor average rating
    const allReviews = await Review.find({ vendorId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Vendor.findByIdAndUpdate(vendorId, {
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length
    });

    // Notify vendor
    const vendor = await Vendor.findById(vendorId);
    if (vendor) {
      await Notification.create({
        userId: vendor.ownerId,
        message: `${req.user.name} left you a ${rating}-star review. "${comment || 'No comment.'}"`,
        type: 'feedback',
        requestId
      });
    }

    res.status(201).json({ success: true, message: 'Review submitted.', review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get reviews for a vendor
// @route GET /api/reviews/vendor/:id
// @access Public
const getVendorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ vendorId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReview, getVendorReviews };
