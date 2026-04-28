const Request = require('../models/Request');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');

// @desc  Create a new service request
// @route POST /api/requests
// @access Private (user)
const createRequest = async (req, res) => {
  try {
    const { vendorId, address, preferredTime, description } = req.body;

    if (!vendorId || !address || !preferredTime || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    if (vendor.status === 'closed') {
      return res.status(400).json({ success: false, message: 'Vendor is currently closed.' });
    }

    // Check if user has an active pending request with this vendor
    const existingRequest = await Request.findOne({
      userId: req.user._id,
      vendorId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You already have a pending request with this vendor.' });
    }

    const request = await Request.create({
      userId: req.user._id,
      vendorId,
      address,
      preferredTime,
      description
    });

    // Notify vendor owner
    await Notification.create({
      userId: vendor.ownerId,
      message: `New service request from ${req.user.name}. Address: ${address}`,
      type: 'request',
      requestId: request._id
    });

    res.status(201).json({ success: true, message: 'Request submitted successfully.', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all requests for a user
// @route GET /api/requests/user
// @access Private (user)
const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id })
      .populate({
        path: 'vendorId',
        select: 'shopName serviceType phone shopAddress avgRating'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all requests for a vendor
// @route GET /api/requests/vendor
// @access Private (vendor)
const getVendorRequests = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ ownerId: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const { status } = req.query;
    const query = { vendorId: vendor._id };
    if (status) query.status = status;

    const requests = await Request.find(query)
      .populate('userId', 'name phone address')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update request status (accept/reject/complete)
// @route PATCH /api/requests/:id
// @access Private (vendor)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['accepted', 'rejected', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const request = await Request.findById(req.params.id).populate('vendorId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    // Ensure vendor owns this request
    const vendor = await Vendor.findOne({ ownerId: req.user._id });
    if (!vendor || request.vendorId._id.toString() !== vendor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this request.' });
    }

    request.status = status;
    await request.save();

    // If accepted, set vendor to busy
    if (status === 'accepted') {
      await Vendor.findByIdAndUpdate(vendor._id, { availability: 'busy' });
    }

    // If completed, set vendor back to available
    if (status === 'completed') {
      await Vendor.findByIdAndUpdate(vendor._id, { availability: 'available' });
    }

    // Notify user
    const messages = {
      accepted: `Your service request has been accepted by ${vendor.shopName}! You can contact them now.`,
      rejected: `Your service request was rejected by ${vendor.shopName}.`,
      completed: `Your service with ${vendor.shopName} has been marked as completed. Please leave a review!`
    };

    await Notification.create({
      userId: request.userId,
      message: messages[status],
      type: 'status',
      requestId: request._id
    });

    // Notify vendor if feedback
    if (status === 'completed') {
      await Notification.create({
        userId: vendor.ownerId,
        message: `Service request completed. The customer may leave a review.`,
        type: 'feedback',
        requestId: request._id
      });
    }

    res.status(200).json({ success: true, message: `Request ${status} successfully.`, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single request by ID
// @route GET /api/requests/:id
// @access Private
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('userId', 'name phone')
      .populate('vendorId', 'shopName phone serviceType shopAddress');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRequest,
  getUserRequests,
  getVendorRequests,
  updateRequestStatus,
  getRequestById
};
