const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc  Register a new user or vendor
// @route POST /api/auth/register
// @access Public
const register = async (req, res) => {
  try {
    console.log("REGISTER HIT");
    console.log("BODY:", req.body);

    const { role } = req.body;

    // Normalize fields (🔥 THIS FIXES YOUR ISSUE)
    const email = req.body.email;
    const password = req.body.password;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.'
      });
    }

    if (role === 'vendor') {
      // Normalize vendor fields
      const shopName = req.body.shopName;
      const ownerName = req.body.ownerName || req.body.name;
      const phone = req.body.phone || req.body.mobile;
      const shopAddress = req.body.shopAddress || req.body.address;
      const serviceArea = req.body.serviceArea || req.body.location || req.body.city;
      const serviceType = req.body.serviceType;
      const pricingInfo = req.body.pricingInfo || '';

      if (!shopName || !ownerName || !email || !password || !phone || !shopAddress || !serviceArea || !serviceType) {
        return res.status(400).json({
          success: false,
          message: 'All required vendor fields must be filled.'
        });
      }

      // Create user record for vendor
      const user = await User.create({
        name: ownerName,
        email,
        password,
        role: 'vendor',
        phone,
        address: shopAddress,
        location: serviceArea
      });

      // Handle uploaded images
      const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

      // Create vendor profile
      const vendor = await Vendor.create({
        ownerId: user._id,
        shopName,
        ownerName,
        serviceType,
        phone,
        shopAddress,
        serviceArea,
        pricingInfo,
        images
      });

      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        success: true,
        message: 'Vendor registered successfully.',
        token,
        user: { ...user.toJSON(), vendorId: vendor._id }
      });

    } else {
      // Normalize user fields
      const name = req.body.name || req.body.fullName;
      const phone = req.body.phone || req.body.mobile;
      const address = req.body.address || '';
      const location = req.body.location || req.body.city || '';

      if (!name || !email || !password || !phone) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be filled.'
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: 'user',
        phone,
        address,
        location
      });

      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        token,
        user: user.toJSON()
      });
    }

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc  Login user
// @route POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account is blocked. Contact admin.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id, user.role);

    let vendorData = null;
    if (user.role === 'vendor') {
      vendorData = await Vendor.findOne({ ownerId: user._id });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: user.toJSON(),
      vendor: vendorData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc  Get current user profile
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    let vendorData = null;
    if (user.role === 'vendor') {
      vendorData = await Vendor.findOne({ ownerId: user._id });
    }

    res.status(200).json({
      success: true,
      user: user.toJSON(),
      vendor: vendorData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { register, login, getMe };