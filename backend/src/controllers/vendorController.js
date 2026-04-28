const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Review = require('../models/Review');

// @desc  Get all available vendors (with optional filters)
// @route GET /api/vendors
// @access Private (user)
const getVendors = async (req, res) => {
  try {
    const { search, serviceType, area, availableOnly } = req.query;

    const query = { isApproved: true };

    if (availableOnly === 'true') {
      query.status = 'open';
      query.availability = 'available';
    }

    if (serviceType) {
      query.serviceType = { $regex: serviceType, $options: 'i' };
    }

    if (area) {
      query.serviceArea = { $regex: area, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { shopName: { $regex: search, $options: 'i' } },
        { serviceType: { $regex: search, $options: 'i' } },
        { serviceArea: { $regex: search, $options: 'i' } }
      ];
    }

    const vendors = await Vendor.find(query)
      .populate('ownerId', 'name email phone')
      .sort({ avgRating: -1, createdAt: -1 });

    res.status(200).json({ success: true, count: vendors.length, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single vendor by ID
// @route GET /api/vendors/:id
// @access Private (user)
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('ownerId', 'name email');
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    const reviews = await Review.find({ vendorId: vendor._id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, vendor, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update vendor status (open/closed, available/busy)
// @route PATCH /api/vendors/status
// @access Private (vendor)
const updateVendorStatus = async (req, res) => {
  try {
    const { status, availability } = req.body;
    const vendor = await Vendor.findOne({ ownerId: req.user._id });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    if (status !== undefined) vendor.status = status;
    if (availability !== undefined) vendor.availability = availability;

    await vendor.save();

    res.status(200).json({
      success: true,
      message: 'Status updated successfully.',
      vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get vendor's own profile
// @route GET /api/vendors/profile
// @access Private (vendor)
const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ ownerId: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update vendor profile
// @route PATCH /api/vendors/profile
// @access Private (vendor)
const updateVendorProfile = async (req, res) => {
  try {
    const { shopName, phone, shopAddress, serviceArea, pricingInfo, serviceType } = req.body;
    const vendor = await Vendor.findOne({ ownerId: req.user._id });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    if (shopName) vendor.shopName = shopName;
    if (phone) vendor.phone = phone;
    if (shopAddress) vendor.shopAddress = shopAddress;
    if (serviceArea) vendor.serviceArea = serviceArea;
    if (pricingInfo !== undefined) vendor.pricingInfo = pricingInfo;
    if (serviceType) vendor.serviceType = serviceType;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/uploads/${f.filename}`);
      vendor.images = [...vendor.images, ...newImages];
    }

    await vendor.save();

    res.status(200).json({ success: true, message: 'Profile updated.', vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVendors,
  getVendorById,
  updateVendorStatus,
  getVendorProfile,
  updateVendorProfile
};
