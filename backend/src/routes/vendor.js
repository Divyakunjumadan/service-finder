const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  getVendors,
  getVendorById,
  updateVendorStatus,
  getVendorProfile,
  updateVendorProfile
} = require('../controllers/vendorController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Public / User routes
router.get('/', protect, getVendors);
router.get('/profile', protect, authorize('vendor'), getVendorProfile);
router.get('/:id', protect, getVendorById);

// Vendor-only routes
router.patch('/status', protect, authorize('vendor'), updateVendorStatus);
router.patch('/profile', protect, authorize('vendor'), upload.array('images', 5), updateVendorProfile);

module.exports = router;
