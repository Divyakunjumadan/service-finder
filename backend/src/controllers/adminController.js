const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Request = require('../models/Request');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

// @desc  Get dashboard analytics
// @route GET /api/admin/analytics
// @access Private (admin)
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVendors = await Vendor.countDocuments();
    const activeVendors = await Vendor.countDocuments({ status: 'open', availability: 'available' });
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const completedRequests = await Request.countDocuments({ status: 'completed' });

    // Requests in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRequests = await Request.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Requests per day (last 7 days)
    const requestsPerDay = await Request.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalVendors,
        activeVendors,
        totalRequests,
        pendingRequests,
        completedRequests,
        recentRequests,
        requestsPerDay
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all users
// @route GET /api/admin/users
// @access Private (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Block or unblock a user
// @route PATCH /api/admin/users/:id/block
// @access Private (admin)
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.`,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all vendors
// @route GET /api/admin/vendors
// @access Private (admin)
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .populate('ownerId', 'name email isBlocked')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Approve or reject a vendor
// @route PATCH /api/admin/vendors/:id/approve
// @access Private (admin)
const toggleApproveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found.' });

    vendor.isApproved = !vendor.isApproved;
    await vendor.save();

    res.status(200).json({
      success: true,
      message: `Vendor ${vendor.isApproved ? 'approved' : 'rejected'} successfully.`,
      vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete a vendor
// @route DELETE /api/admin/vendors/:id
// @access Private (admin)
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found.' });
    res.status(200).json({ success: true, message: 'Vendor removed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all requests
// @route GET /api/admin/requests
// @access Private (admin)
const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const requests = await Request.find(query)
      .populate('userId', 'name email phone')
      .populate({ path: 'vendorId', select: 'shopName serviceType' })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all reviews
// @route GET /api/admin/reviews
// @access Private (admin)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name')
      .populate('vendorId', 'shopName serviceType')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getAllUsers,
  toggleBlockUser,
  getAllVendors,
  toggleApproveVendor,
  deleteVendor,
  getAllRequests,
  getAllReviews
};
